/**
 * @fileoverview
 *
 * When an expression is inside a conditional test, it is implicitly coerced to a boolean.
 * Falling back to `false` for nullish values is redundant, because nullish values will always be
 * coerced to `false` anyway.
 *
 * This also applies to the return values of predicates for array methods like `Array.prototype.find` or `Array.prototype.filter`,
 * and to expressions inside boolean casts.
 *
 * The rule also forbids `|| false`, for the same reasons.
 *
 * @example
 * ```ts
 * declare const foo: string | null | undefined;
 * // The nullish coalescing operator isn't necessary, because the value is already coerced to a boolean anyway:
 * const bar = Boolean(foo ?? false);
 * ```
 */

import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid extra `?? false` in conditions and predicates',
      strict: true,
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      noExtraFalseFallbackInCondition:
        'Remove this redundant `{{operator}} false` from the condition',
      noExtraFalseFallbackInPredicate:
        'Remove this redundant `{{operator}} false` from the return of the predicate',
      noExtraFalseFallbackInsideBooleanCast:
        'Remove this redundant `{{operator}} false` as the expression already is inside a boolean cast',
      removeFalseFallback: 'Remove `{{operator}} false`',
    },
  },
  defaultOptions: [],
  create(context) {
    function checkNullishCoalescingExpression(node: TSESTree.LogicalExpression) {
      const { operator } = node;

      if (isInCondition(node)) {
        context.report({
          node: node.right,
          messageId: 'noExtraFalseFallbackInCondition',
          data: { operator },
          suggest: [
            {
              messageId: 'removeFalseFallback',
              data: { operator },
              fix(fixer) {
                const leftText = context.sourceCode.getText(node.left);
                return fixer.replaceText(node, leftText);
              },
            },
          ],
        });
      }

      if (isReturnedFromPredicate(node)) {
        context.report({
          node: node.right,
          messageId: 'noExtraFalseFallbackInPredicate',
          data: { operator },
          suggest: [
            {
              messageId: 'removeFalseFallback',
              data: { operator },
              fix(fixer) {
                const leftText = context.sourceCode.getText(node.left);
                return fixer.replaceText(node, leftText);
              },
            },
          ],
        });
      }

      if (isInBooleanCast(node)) {
        context.report({
          node: node.right,
          messageId: 'noExtraFalseFallbackInsideBooleanCast',
          data: { operator },
          suggest: [
            {
              messageId: 'removeFalseFallback',
              data: { operator },
              fix(fixer) {
                const leftText = context.sourceCode.getText(node.left);
                return fixer.replaceText(node, leftText);
              },
            },
          ],
        });
      }
    }

    return {
      LogicalExpression(node) {
        if (node.operator !== '??' && node.operator !== '||') return;
        if (node.right.type !== AST_NODE_TYPES.Literal) return;
        if (node.right.value !== false) return;

        checkNullishCoalescingExpression(node);
      },
    };
  },
});

function isDoubleNegation(node: TSESTree.UnaryExpression): boolean {
  if (node.operator !== '!') return false;
  if (node.parent.type !== AST_NODE_TYPES.UnaryExpression) return false;
  if (node.parent.operator !== '!') return false;
  return true;
}

function isBooleanCall(node: TSESTree.CallExpression): boolean {
  if (node.callee.type !== AST_NODE_TYPES.Identifier) return false;
  if (node.callee.name !== 'Boolean') return false;
  return true;
}

function isInCondition(node: TSESTree.Node): boolean {
  /* v8 ignore if -- @preserve */
  if (!node.parent) return false;

  switch (node.parent.type) {
    case AST_NODE_TYPES.LogicalExpression:
    case AST_NODE_TYPES.TSAsExpression:
    case AST_NODE_TYPES.TSNonNullExpression:
    case AST_NODE_TYPES.TSSatisfiesExpression:
      return isInCondition(node.parent);

    case AST_NODE_TYPES.IfStatement:
    case AST_NODE_TYPES.ConditionalExpression:
      return node === node.parent.test;

    default:
      return false;
  }
}

function isPredicate(
  fn: TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression,
): boolean {
  if (fn.parent.type !== AST_NODE_TYPES.CallExpression) return false;
  if (fn.parent.arguments[0] !== fn) return false;
  if (fn.parent.callee.type !== AST_NODE_TYPES.MemberExpression) return false;
  if (fn.parent.callee.property.type !== AST_NODE_TYPES.Identifier) return false;

  const arrayMethods = [
    'every',
    'some',
    'filter',
    'find',
    'findIndex',
    'findLast',
    'findLastIndex',
  ];
  if (!arrayMethods.includes(fn.parent.callee.property.name)) return false;
  return true;
}

function isReturnedFromPredicate(node: TSESTree.Node): boolean {
  /* v8 ignore if -- @preserve */
  if (!node.parent) return false;

  switch (node.parent.type) {
    case AST_NODE_TYPES.LogicalExpression:
    case AST_NODE_TYPES.TSAsExpression:
    case AST_NODE_TYPES.TSNonNullExpression:
    case AST_NODE_TYPES.TSSatisfiesExpression:
    case AST_NODE_TYPES.ReturnStatement:
      return isReturnedFromPredicate(node.parent);

    case AST_NODE_TYPES.BlockStatement:
      if (
        node.parent.parent.type === AST_NODE_TYPES.FunctionExpression ||
        node.parent.parent.type === AST_NODE_TYPES.ArrowFunctionExpression
      ) {
        return isPredicate(node.parent.parent);
      }
      return false;

    case AST_NODE_TYPES.ArrowFunctionExpression:
      return isPredicate(node.parent);

    case AST_NODE_TYPES.IfStatement:
    case AST_NODE_TYPES.ConditionalExpression:
      if (node === node.parent.test) return false;
      return isReturnedFromPredicate(node.parent);

    default:
      return false;
  }
}

function isInBooleanCast(node: TSESTree.Node) {
  /* v8 ignore if -- @preserve */
  if (!node.parent) return false;

  switch (node.parent.type) {
    case AST_NODE_TYPES.LogicalExpression:
    case AST_NODE_TYPES.TSAsExpression:
    case AST_NODE_TYPES.TSNonNullExpression:
    case AST_NODE_TYPES.TSSatisfiesExpression:
      return isInBooleanCast(node.parent);

    case AST_NODE_TYPES.UnaryExpression:
      return isDoubleNegation(node.parent);

    case AST_NODE_TYPES.CallExpression:
      return isBooleanCall(node.parent);

    default:
      return false;
  }
}
