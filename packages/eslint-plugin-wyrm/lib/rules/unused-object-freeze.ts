import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow unused `Object.freeze()` expressions',
      recommended: true,
    },
    schema: [],
    messages: {
      noUnusedObjectFreeze: 'This `Object.freeze()` expression is unused.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        if (node.parent.type !== AST_NODE_TYPES.ExpressionStatement) return;
        if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return;

        if (node.callee.object.type !== AST_NODE_TYPES.Identifier) return;
        if (node.callee.property.type !== AST_NODE_TYPES.Identifier) return;

        if (node.callee.object.name !== 'Object') return;
        if (node.callee.property.name !== 'freeze') return;

        const [arg] = node.arguments;
        if (!arg) return;
        if (arg.type !== AST_NODE_TYPES.ObjectExpression) return;

        context.report({ node, messageId: 'noUnusedObjectFreeze' });
      },
    };
  },
});
