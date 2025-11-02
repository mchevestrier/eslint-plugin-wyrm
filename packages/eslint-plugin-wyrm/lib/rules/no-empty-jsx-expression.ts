import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid empty JSX expression containers',
      recommended: true,
    },
    schema: [],
    messages: {
      noEmptyJsxExpression: 'Remove this empty JSX expression container',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXEmptyExpression(node) {
        const comments = context.sourceCode.getCommentsInside(node);
        if (comments.length) return;
        context.report({ node, messageId: 'noEmptyJsxExpression' });
      },

      JSXExpressionContainer(node) {
        if (node.expression.type === AST_NODE_TYPES.JSXEmptyExpression) return;

        switch (node.expression.type) {
          case AST_NODE_TYPES.Literal:
            if (node.expression.value === null) break;
            if (node.expression.value === false) break;
            if (node.expression.value === '') break;
            return;

          case AST_NODE_TYPES.Identifier:
            if (node.expression.name === 'undefined') break;
            return;

          default:
            return;
        }

        context.report({ node, messageId: 'noEmptyJsxExpression' });
      },
    };
  },
});
