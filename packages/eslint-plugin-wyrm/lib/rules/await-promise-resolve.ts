import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid `await Promise.resolve()`',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noAwaitPromiseResolve: '`await Promise.resolve()` is most likely pointless',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      AwaitExpression(node) {
        if (node.argument.type !== AST_NODE_TYPES.CallExpression) return;
        if (node.argument.callee.type !== AST_NODE_TYPES.MemberExpression) return;
        if (node.argument.callee.object.type !== AST_NODE_TYPES.Identifier) return;
        if (node.argument.callee.property.type !== AST_NODE_TYPES.Identifier) return;
        if (node.argument.callee.object.name !== 'Promise') return;
        if (node.argument.callee.property.name !== 'resolve') return;

        const args = node.argument.arguments;

        context.report({
          node,
          messageId: 'noAwaitPromiseResolve',
          fix(fixer) {
            if (args[0]) {
              return fixer.replaceText(
                node.argument,
                context.sourceCode.getText(args[0]),
              );
            }

            if (node.parent.type === AST_NODE_TYPES.ExpressionStatement) {
              return fixer.remove(node.parent);
            }

            return fixer.replaceText(node, 'undefined');
          },
        });
      },
    };
  },
});
