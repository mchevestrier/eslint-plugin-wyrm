import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid nested try/catch statements',
      strict: true,
    },
    schema: [],
    messages: {
      noNestedTryCatch: 'Refactor to avoid nesting try/catch statements.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      TryStatement(node) {
        if (node.parent.type !== AST_NODE_TYPES.BlockStatement) return;

        switch (node.parent.parent.type) {
          case AST_NODE_TYPES.TryStatement:
          case AST_NODE_TYPES.CatchClause: {
            const token = context.sourceCode.getFirstToken(node);
            context.report({ node: token ?? node, messageId: 'noNestedTryCatch' });
            break;
          }

          default:
            break;
        }
      },
    };
  },
});
