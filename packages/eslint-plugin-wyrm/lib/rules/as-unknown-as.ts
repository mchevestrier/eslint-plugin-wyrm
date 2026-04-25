import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid `as unknown as`',
      strict: true,
    },
    schema: [],
    messages: {
      noAsUnknownAs: '`as unknown as` is unsafe',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      TSAsExpression(node) {
        if (node.parent.type !== AST_NODE_TYPES.TSAsExpression) return;
        if (node.typeAnnotation.type !== AST_NODE_TYPES.TSUnknownKeyword) return;

        context.report({ node, messageId: 'noAsUnknownAs' });
      },
    };
  },
});
