import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid JSX expression statements',
      recommended: true,
    },
    schema: [],
    messages: {
      noJsxExpressionStatement: 'Did you mean to return this JSX element?',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ExpressionStatement(node) {
        if (
          node.expression.type === AST_NODE_TYPES.JSXElement ||
          node.expression.type === AST_NODE_TYPES.JSXFragment
        ) {
          context.report({
            node,
            messageId: 'noJsxExpressionStatement',
          });
        }
      },
    };
  },
});
