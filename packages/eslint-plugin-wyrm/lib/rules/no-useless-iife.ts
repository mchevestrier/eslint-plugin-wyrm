import path from 'node:path';

import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid useless IIFEs',
      recommended: true,
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      noUselessIIFE: 'An IIFE is unnecessary here',
      removeIIFE: 'Remove this IIFE',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        const { callee } = node;
        if (
          callee.type !== AST_NODE_TYPES.FunctionExpression &&
          callee.type !== AST_NODE_TYPES.ArrowFunctionExpression
        ) {
          return;
        }

        if (callee.body.type !== AST_NODE_TYPES.BlockStatement) {
          context.report({
            node,
            messageId: 'noUselessIIFE',
            suggest: [
              {
                messageId: 'removeIIFE',
                fix(fixer) {
                  return fixer.replaceText(node, context.sourceCode.getText(callee.body));
                },
              },
            ],
          });
          return;
        }

        const { body } = callee.body;

        const [lastStatement] = body;
        if (!lastStatement) return;

        if (body.length === 1 && lastStatement.type === AST_NODE_TYPES.ReturnStatement) {
          context.report({
            node,
            messageId: 'noUselessIIFE',
            suggest: [
              {
                messageId: 'removeIIFE',
                fix(fixer) {
                  const txt = lastStatement.argument
                    ? context.sourceCode.getText(lastStatement.argument)
                    : 'undefined';
                  return fixer.replaceText(node, txt);
                },
              },
            ],
          });
          return;
        }

        if (node.parent.type !== AST_NODE_TYPES.ExpressionStatement) return;

        const hasAwait = body.some(
          (stmt) =>
            stmt.type === AST_NODE_TYPES.ExpressionStatement &&
            stmt.expression.type === AST_NODE_TYPES.AwaitExpression,
        );

        if (!hasAwait) {
          context.report({
            node,
            messageId: 'noUselessIIFE',
            suggest: [
              {
                messageId: 'removeIIFE',
                fix(fixer) {
                  const txt = context.sourceCode.getText(callee.body);
                  return fixer.replaceText(node, txt);
                },
              },
            ],
          });
          return;
        }

        if (isStatementInAsyncFunction(node.parent)) {
          context.report({
            node,
            messageId: 'noUselessIIFE',
            suggest: [
              {
                messageId: 'removeIIFE',
                fix(fixer) {
                  const txt = context.sourceCode.getText(callee.body);
                  return fixer.replaceText(node, txt);
                },
              },
            ],
          });
        }
      },
    };
  },
});

function isStatementInAsyncFunction(stmt: TSESTree.ExpressionStatement): boolean {
  if (stmt.parent.type !== AST_NODE_TYPES.BlockStatement) return false;

  if (
    stmt.parent.parent.type === AST_NODE_TYPES.FunctionDeclaration ||
    stmt.parent.parent.type === AST_NODE_TYPES.ArrowFunctionExpression ||
    stmt.parent.parent.type === AST_NODE_TYPES.FunctionExpression
  ) {
    return stmt.parent.parent.async;
  }

  return false;
}
