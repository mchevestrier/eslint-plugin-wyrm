import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';
import { None, type Option, Some } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce using optional call expression syntax',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      useOptionalCallExpressionSyntax: 'Use optional call expression syntax.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      IfStatement(node) {
        if (node.alternate) return;

        const maybeIdent = extractTruthyIdentifier(node.test);
        if (!maybeIdent.some) return;
        const ident = maybeIdent.value;

        const stmt = extractUniqueStatement(node.consequent);
        if (stmt === null) return;

        if (stmt.type !== AST_NODE_TYPES.ExpressionStatement) return;

        if (stmt.expression.type !== AST_NODE_TYPES.CallExpression) return;
        const expr = stmt.expression;
        if (expr.callee.type !== AST_NODE_TYPES.Identifier) return;

        if (ident.name !== expr.callee.name) return;

        context.report({
          node,
          messageId: 'useOptionalCallExpressionSyntax',
          fix(fixer) {
            const args = expr.arguments
              .map((arg) => context.sourceCode.getText(arg))
              .join(', ');
            return fixer.replaceText(node, `${ident.name}?.(${args});`);
          },
        });
      },

      ConditionalExpression(node) {
        if (node.parent.type !== AST_NODE_TYPES.ExpressionStatement) return;

        const maybeIdent = extractTruthyIdentifier(node.test);
        if (!maybeIdent.some) return;
        const ident = maybeIdent.value;

        if (node.consequent.type !== AST_NODE_TYPES.CallExpression) return;
        const expr = node.consequent;
        if (expr.callee.type !== AST_NODE_TYPES.Identifier) return;

        if (ident.name !== expr.callee.name) return;

        context.report({
          node,
          messageId: 'useOptionalCallExpressionSyntax',
          fix(fixer) {
            const args = expr.arguments
              .map((arg) => context.sourceCode.getText(arg))
              .join(', ');
            return fixer.replaceText(node, `${ident.name}?.(${args})`);
          },
        });
      },
    };
  },
});

function extractUniqueStatement(stmt: TSESTree.Statement): TSESTree.Statement | null {
  if (stmt.type !== AST_NODE_TYPES.BlockStatement) return stmt;
  if (stmt.body.length > 1) return null;
  return stmt.body.at(0) ?? null;
}

function extractTruthyIdentifier(node: TSESTree.Expression): Option<TSESTree.Identifier> {
  switch (node.type) {
    case AST_NODE_TYPES.Identifier:
      return Some(node);

    case AST_NODE_TYPES.BinaryExpression: {
      const ident = isTruthinessEqualityCheck(node, node.left, node.right);
      if (ident.some) return ident;
      return isTruthinessEqualityCheck(node, node.right, node.left);
    }

    default:
      return None;
  }
}

function isTruthinessEqualityCheck(
  node: TSESTree.BinaryExpression,
  left: TSESTree.PrivateIdentifier | TSESTree.Expression,
  right: TSESTree.PrivateIdentifier | TSESTree.Expression,
): Option<TSESTree.Identifier> {
  switch (node.operator) {
    case '!=':
    case '!==':
      if (
        left.type === AST_NODE_TYPES.Identifier &&
        right.type === AST_NODE_TYPES.Literal &&
        right.value === null
      ) {
        return Some(left);
      }

      if (
        left.type === AST_NODE_TYPES.Identifier &&
        right.type === AST_NODE_TYPES.Identifier &&
        right.name === 'undefined'
      ) {
        return Some(left);
      }

      if (
        left.type === AST_NODE_TYPES.UnaryExpression &&
        left.operator === 'typeof' &&
        right.type === AST_NODE_TYPES.Literal &&
        right.value === 'undefined' &&
        left.argument.type === AST_NODE_TYPES.Identifier
      ) {
        return Some(left.argument);
      }

      return None;

    case '==':
    case '===':
      if (
        left.type === AST_NODE_TYPES.UnaryExpression &&
        left.operator === 'typeof' &&
        right.type === AST_NODE_TYPES.Literal &&
        right.value === 'function' &&
        left.argument.type === AST_NODE_TYPES.Identifier
      ) {
        return Some(left.argument);
      }

      return None;

    default:
      return None;
  }
}
