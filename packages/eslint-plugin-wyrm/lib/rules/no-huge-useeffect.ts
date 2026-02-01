import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

const DEFAULT_MAX_LINES = 20;

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid huge `useEffect` functions',
      strict: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          maxNbLines: {
            type: 'number',
            description: `Maximum number of lines for a \`useEffect\` function. Default: \`${DEFAULT_MAX_LINES}\``,
          },
        },
      },
    ],
    messages: {
      noHugeUseEffect:
        'This `useEffect` function spans more than {{ maxNbLines }} lines. Refactor to avoid huge blocks of side-effect code.',
    },
  },
  defaultOptions: [
    {
      maxNbLines: DEFAULT_MAX_LINES,
    },
  ],
  create(context, [options]) {
    return {
      CallExpression(node) {
        if (!isUseEffect(node)) return;

        const [arg] = node.arguments;
        if (!arg) return;

        if (
          arg.type !== AST_NODE_TYPES.ArrowFunctionExpression &&
          arg.type !== AST_NODE_TYPES.FunctionExpression
        ) {
          return;
        }

        if (arg.body.type !== AST_NODE_TYPES.BlockStatement) return;

        const nbFuncLines = arg.body.loc.end.line - arg.body.loc.start.line + 1;

        if (nbFuncLines <= options.maxNbLines) return;

        context.report({
          node: arg,
          messageId: 'noHugeUseEffect',
          data: { maxNbLines: options.maxNbLines },
        });
      },
    };
  },
});

function isUseEffect(node: TSESTree.CallExpression): boolean {
  const hookName = 'useEffect';

  if (node.callee.type === AST_NODE_TYPES.Identifier && node.callee.name === hookName) {
    return true;
  }

  if (node.callee.type !== AST_NODE_TYPES.MemberExpression) {
    return false;
  }

  if (node.callee.object.type !== AST_NODE_TYPES.Identifier) return false;
  if (node.callee.property.type !== AST_NODE_TYPES.Identifier) return false;

  if (node.callee.object.name !== 'React') return false;
  if (node.callee.property.name !== hookName) return false;

  return true;
}
