import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';
import { getFirstOption, None, Option, Some } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid redundant condition for positive length before a loop',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noIfLengthFor:
        "You don't need to check that an array is not empty before a for loop",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      IfStatement(node) {
        if (node.alternate) return;

        const maybeIdent = getArrayIdent(node.test);
        if (!maybeIdent.some) return;
        const ident = maybeIdent.value;

        const maybeStmt = getUniqueStatement(node.consequent);
        if (!maybeStmt.some) return;
        const stmt = maybeStmt.value;

        if (!matchLoopWithIdent(stmt, ident)) return;

        context.report({
          node,
          messageId: 'noIfLengthFor',
          fix(fixer) {
            const text = context.sourceCode.getText(stmt);
            return fixer.replaceText(node, text);
          },
        });
      },
    };
  },
});

function matchLoopWithIdent(stmt: TSESTree.Statement, ident: string): boolean {
  return matchForLoopWithIdent(stmt, ident) || matchForEachLoopWithIdent(stmt, ident);
}

function matchForLoopWithIdent(stmt: TSESTree.Statement, ident: string): boolean {
  if (stmt.type !== AST_NODE_TYPES.ForOfStatement) return false;
  if (stmt.right.type !== AST_NODE_TYPES.Identifier) return false;
  if (stmt.right.name !== ident) return false;
  return true;
}

function matchForEachLoopWithIdent(stmt: TSESTree.Statement, ident: string): boolean {
  if (stmt.type !== AST_NODE_TYPES.ExpressionStatement) return false;
  if (stmt.expression.type !== AST_NODE_TYPES.CallExpression) return false;
  if (stmt.expression.callee.type !== AST_NODE_TYPES.MemberExpression) return false;

  if (stmt.expression.callee.property.type !== AST_NODE_TYPES.Identifier) return false;
  if (stmt.expression.callee.property.name !== 'forEach') return false;

  if (stmt.expression.callee.object.type !== AST_NODE_TYPES.Identifier) return false;
  if (stmt.expression.callee.object.name !== ident) return false;

  return true;
}

function getArrayIdent(test: TSESTree.Expression): Option<string> {
  return getFirstOption([
    extractIdentFromLengthAccess(test),
    extractIdentFromPositiveLengthCheck(test),
  ]);
}

function extractIdentFromLengthAccess(test: TSESTree.Expression): Option<string> {
  if (test.type !== AST_NODE_TYPES.MemberExpression) return None;
  if (test.property.type !== AST_NODE_TYPES.Identifier) return None;
  if (test.property.name !== 'length') return None;

  if (test.object.type !== AST_NODE_TYPES.Identifier) return None;
  return Some(test.object.name);
}

function extractIdentFromPositiveLengthCheck(test: TSESTree.Expression): Option<string> {
  if (test.type !== AST_NODE_TYPES.BinaryExpression) return None;

  switch (test.operator) {
    case '!=':
    case '!==':
      return getFirstOption([
        extractIdentFromLengthComparison(test.left, test.right),
        extractIdentFromLengthComparison(test.right, test.left),
      ]);

    case '>':
      return extractIdentFromLengthComparison(test.left, test.right);

    case '<':
      return extractIdentFromLengthComparison(test.right, test.left);

    default:
      return None;
  }
}

function extractIdentFromLengthComparison(
  left: TSESTree.Expression,
  right: TSESTree.Expression,
): Option<string> {
  if (right.type !== AST_NODE_TYPES.Literal) return None;
  if (right.value !== 0) return None;
  return extractIdentFromLengthAccess(left);
}

function getUniqueStatement(stmt: TSESTree.Statement) {
  if (stmt.type !== AST_NODE_TYPES.BlockStatement) {
    return Some(stmt);
  }

  if (stmt.body.length !== 1) return None;

  return Option.fromUndef(stmt.body[0]);
}
