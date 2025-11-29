import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Forbid referencing parameters marked as unused with a leading underscore',
      strict: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noUnusedParamRead:
        'If you want to use this parameter, remove the leading underscore',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      Identifier(node) {
        if (!node.name.startsWith('_')) return;

        if (
          node.parent.type !== AST_NODE_TYPES.FunctionDeclaration &&
          node.parent.type !== AST_NODE_TYPES.FunctionExpression &&
          node.parent.type !== AST_NODE_TYPES.ArrowFunctionExpression
        ) {
          return;
        }
        if (!node.parent.params.includes(node)) return;

        const scope = context.sourceCode.getScope(node);
        const refs = scope.references
          .filter((ref) => ref.identifier.name === node.name)
          .filter((ref) => ref.isRead());
        if (!refs.length) return;

        context.report({ node, messageId: 'noUnusedParamRead' });
      },
    };
  },
});
