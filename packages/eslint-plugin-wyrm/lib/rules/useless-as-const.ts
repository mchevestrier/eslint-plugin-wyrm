import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';
import { None, Some } from '../utils/option.js';
import type { Option } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid useless `as const` assertions',
      strict: true,
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      uselessAsConst: '`as const` has no effect because of the type annotation.',
      removeTypeAnnotation: 'Remove type annotation',
      removeAsConst: 'Remove `as const` assertion',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      VariableDeclarator(node) {
        if (!node.init) return;
        if (!node.id.typeAnnotation) return;

        const initialization = node.init;
        const annotation = node.id.typeAnnotation;

        const maybeExpr = getAsConstExpr(initialization);
        if (!maybeExpr.some) return;
        const expr = maybeExpr.value;

        context.report({
          node: node.init,
          messageId: 'uselessAsConst',
          suggest: [
            {
              messageId: 'removeAsConst',
              fix(fixer) {
                return fixer.replaceText(
                  initialization,
                  context.sourceCode.getText(expr),
                );
              },
            },
            {
              messageId: 'removeTypeAnnotation',
              fix(fixer) {
                return fixer.remove(annotation);
              },
            },
          ],
        });
      },
    };
  },
});

function getAsConstExpr(node: TSESTree.Node): Option<TSESTree.Expression> {
  if (node.type !== AST_NODE_TYPES.TSAsExpression) return None;
  if (node.typeAnnotation.type !== AST_NODE_TYPES.TSTypeReference) return None;
  if (node.typeAnnotation.typeName.type !== AST_NODE_TYPES.Identifier) return None;
  if (node.typeAnnotation.typeName.name !== 'const') return None;
  return Some(node.expression);
}
