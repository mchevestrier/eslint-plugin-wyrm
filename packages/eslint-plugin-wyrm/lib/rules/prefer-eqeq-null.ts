/**
 * @fileoverview
 *
 * Using weak equality (`==`) can make checking for nullishness more concise.
 *
 * @example
 * ```ts
 * // With strict equality:
 * foo === null || foo === undefined;
 *
 * // With weak equality:
 * foo == null;
 * ```
 *
 * Enabling this rule only makes sense if you didn't enable the [`eqeqeq` ESLint rule](https://eslint.org/docs/latest/rules/eqeqeq), or if you enabled it but allow null (either with the `smart` setting, with `allow-null` or with `{"null": "ignore"}`).
 */

import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';
import { getFirstOption, None, Some } from '../utils/option.js';
import type { Option } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce using `x == null` instead of `x === null || x === undefined`',
      strict: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      useEqEqNull: 'Use `{{ ident }} == null` instead',
      useNotEqNull: 'Use `{{ ident }} != null` instead',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      LogicalExpression(node) {
        const { operator, left, right } = node;

        const maybeNullishEquality = getFirstOption([
          getNullishEqualityCheck(operator, left, right),
          getNullishEqualityCheck(operator, right, left),
        ]);

        if (maybeNullishEquality.some) {
          context.report({
            node,
            messageId: 'useEqEqNull',
            data: { ident: maybeNullishEquality.value },
            fix(fixer) {
              return fixer.replaceText(node, `${maybeNullishEquality.value} == null`);
            },
          });
        }

        const maybeNullishInequality = getFirstOption([
          getNullishInequalityCheck(operator, left, right),
          getNullishInequalityCheck(operator, right, left),
        ]);

        if (maybeNullishInequality.some) {
          context.report({
            node,
            messageId: 'useNotEqNull',
            data: { ident: maybeNullishInequality.value },
            fix(fixer) {
              return fixer.replaceText(node, `${maybeNullishInequality.value} != null`);
            },
          });
        }
      },
    };

    function getNullishEqualityCheck(
      operator: TSESTree.LogicalExpression['operator'],
      expr1: TSESTree.Expression,
      expr2: TSESTree.Expression,
    ): Option<string> {
      if (operator !== '||') return None;
      if (expr1.type !== AST_NODE_TYPES.BinaryExpression) return None;
      if (expr2.type !== AST_NODE_TYPES.BinaryExpression) return None;
      return getFirstOption([
        getNullishEqualityText(expr1, expr2),
        getNullishEqualityText(expr2, expr1),
      ]);
    }

    function getNullishEqualityText(
      a: TSESTree.BinaryExpression,
      b: TSESTree.BinaryExpression,
    ): Option<string> {
      const left = getNullEquality(a);
      const right = getUndefinedEquality(b);
      if (!left.some || !right.some) return None;

      const leftText = context.sourceCode.getText(left.value);
      const rightText = context.sourceCode.getText(right.value);
      if (leftText !== rightText) return None;
      return Some(leftText);
    }

    function getNullishInequalityCheck(
      operator: TSESTree.LogicalExpression['operator'],
      expr1: TSESTree.Expression,
      expr2: TSESTree.Expression,
    ): Option<string> {
      if (operator !== '&&') return None;
      if (expr1.type !== AST_NODE_TYPES.BinaryExpression) return None;
      if (expr2.type !== AST_NODE_TYPES.BinaryExpression) return None;

      return getFirstOption([
        getNullishInequalityText(expr1, expr2),
        getNullishInequalityText(expr2, expr1),
      ]);
    }

    function getNullishInequalityText(
      a: TSESTree.BinaryExpression,
      b: TSESTree.BinaryExpression,
    ): Option<string> {
      const left = getNullInequality(a);
      const right = getUndefinedInequality(b);
      if (!left.some || !right.some) return None;

      const leftText = context.sourceCode.getText(left.value);
      const rightText = context.sourceCode.getText(right.value);
      if (leftText !== rightText) return None;
      return Some(leftText);
    }
  },
});

function getNullEquality(expr: TSESTree.BinaryExpression): Option<TSESTree.Node> {
  if (expr.operator !== '==' && expr.operator !== '===') return None;
  if (isNullLiteral(expr.left)) return Some(expr.right);
  if (isNullLiteral(expr.right)) return Some(expr.left);
  return None;
}

function getUndefinedEquality(expr: TSESTree.BinaryExpression): Option<TSESTree.Node> {
  if (expr.operator !== '==' && expr.operator !== '===') return None;
  if (isUndefinedLiteral(expr.left)) return Some(expr.right);
  if (isUndefinedLiteral(expr.right)) return Some(expr.left);
  return None;
}

function getNullInequality(expr: TSESTree.BinaryExpression): Option<TSESTree.Node> {
  if (expr.operator !== '!=' && expr.operator !== '!==') return None;
  if (isNullLiteral(expr.left)) return Some(expr.right);
  if (isNullLiteral(expr.right)) return Some(expr.left);
  return None;
}

function getUndefinedInequality(expr: TSESTree.BinaryExpression): Option<TSESTree.Node> {
  if (expr.operator !== '!=' && expr.operator !== '!==') return None;
  if (isUndefinedLiteral(expr.left)) return Some(expr.right);
  if (isUndefinedLiteral(expr.right)) return Some(expr.left);
  return None;
}

function isUndefinedLiteral(node: TSESTree.Node): boolean {
  return node.type === AST_NODE_TYPES.Identifier && node.name === 'undefined';
}

function isNullLiteral(node: TSESTree.Node): boolean {
  return node.type === AST_NODE_TYPES.Literal && node.value === null;
}
