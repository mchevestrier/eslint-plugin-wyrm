/**
 * @fileoverview
 *
 * When an expression is inside a conditional test, it is implicitly coerced to a boolean.
 * Casting this expression to a boolean is therefore redundant.
 *
 * This rule supplements the builtin [`no-extra-boolean-cast`](https://eslint.org/docs/latest/rules/no-extra-boolean-cast) ESLint rule.
 * The `wyrm/no-extra-nested-boolean-cast` should have the same behavior as the builtin rule with the `enforceForInnerExpressions` option enabled, but it also supports some TypeScript constructs.
 *
 * Contrary to the builtin rule, it also enforces this for callback returns of some array methods like `Array.prototype.find` or `Array.prototype.filter`.
 *
 * @example
 * ```ts
 * declare const foo: string;
 * // `foo` doesn't need to be coerced to a boolean, because it is inside a ternary condition:
 * const bar = !!foo ? "ok" : "ko";
 * ```
 */

import path from 'node:path';

import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid extra boolean casts in conditions and predicates',
      strict: true,
    },
    schema: [],
    messages: {
      noExtraBooleanCast: 'Remove this boolean cast from the condition',
      noExtraBooleanCastInPredicate:
        'Remove this boolean cast from the return of the predicate',
    },
  },
  defaultOptions: [],
  create(context) {
    function isInCondition(node: TSESTree.Node): boolean {
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
          return node.parent.body === node && isPredicate(node.parent);

        case AST_NODE_TYPES.IfStatement:
        case AST_NODE_TYPES.ConditionalExpression:
          if (node === node.parent.test) return false;
          return isReturnedFromPredicate(node.parent);

        default:
          return false;
      }
    }

    return {
      UnaryExpression(node) {
        if (node.operator !== '!') return;
        if (node.parent.type !== AST_NODE_TYPES.UnaryExpression) return;
        if (node.parent.operator !== '!') return;

        if (isInCondition(node.parent)) {
          context.report({
            node: node.parent,
            messageId: 'noExtraBooleanCast',
          });
        }

        if (isReturnedFromPredicate(node.parent)) {
          context.report({
            node: node.parent,
            messageId: 'noExtraBooleanCastInPredicate',
          });
        }
      },

      CallExpression(node) {
        if (node.callee.type !== AST_NODE_TYPES.Identifier) return;
        if (node.callee.name !== 'Boolean') return;

        if (isInCondition(node.parent)) {
          context.report({ node, messageId: 'noExtraBooleanCast' });
        }
      },
    };
  },
});
