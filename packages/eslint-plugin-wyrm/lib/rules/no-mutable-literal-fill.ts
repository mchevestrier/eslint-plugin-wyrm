/**
 * @fileoverview
 *
 * Passing a mutable object to the `Array.prototype.fill()` method can lead to surprising behavior,
 * as the same object passed as argument will be reused for all array elements.
 * So all array elements will contain a reference to the same object, and mutating one will mutate all the others as well.
 *
 * @example
 * ```ts
 * const arr = Array(10).fill([]);
 * arr[0].push(42);
 * console.log(arr[2]); // [ 42 ]
 * // You can either instantiate a new object for each element:
 * Array(10).fill(null).map(() => []);
 * // Or mark the array elements as readonly:
 * Array(10).fill([] as const);
 * ```
 */

import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid using mutable literals to fill arrays',
      recommended: true,
    },
    schema: [],
    messages: {
      noMutableLiteralFill:
        'Filling an array with a mutable value can have surprising results because the same mutable value will be reused for all elements. If you want each element to be distinct, use `.fill(null).map()` instead',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return;
        if (node.callee.property.type !== AST_NODE_TYPES.Identifier) return;
        if (node.callee.property.name !== 'fill') return;

        if (node.callee.object.type !== AST_NODE_TYPES.CallExpression) return;
        if (node.callee.object.callee.type !== AST_NODE_TYPES.Identifier) return;
        if (node.callee.object.callee.name !== 'Array') return;

        const [arg] = node.arguments;
        if (!arg) return;
        if (arg.type === AST_NODE_TYPES.SpreadElement) return;

        if (!isMutableLiteral(arg)) return;

        context.report({ node: arg, messageId: 'noMutableLiteralFill' });
      },
    };
  },
});

function isMutableLiteral(expr: TSESTree.Expression): boolean {
  switch (expr.type) {
    case AST_NODE_TYPES.ArrayExpression:
    case AST_NODE_TYPES.ObjectExpression:
    case AST_NODE_TYPES.NewExpression:
      return true;

    default:
      return false;
  }
}
