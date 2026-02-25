import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid iterating over empty literals',
      recommended: true,
    },
    schema: [],
    messages: {
      noEmptyLiteralIteration: 'Iterating over an empty literal is a noop.',
    },
  },
  defaultOptions: [],
  create(context) {
    function checkExpression(node: TSESTree.Expression) {
      if (!isEmptyLiteral(node)) return;
      context.report({ node, messageId: 'noEmptyLiteralIteration' });
    }

    return {
      ForOfStatement(node) {
        checkExpression(node.right);
      },
      ForInStatement(node) {
        checkExpression(node.right);
      },
      CallExpression(node) {
        if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return;
        if (node.callee.property.type !== AST_NODE_TYPES.Identifier) return;

        if (
          ![
            // Array methods
            'every',
            'filter',
            'find',
            'findIndex',
            'findLast',
            'findLastIndex',
            'forEach',
            'includes',
            'map',
            'reduce',
            'some',

            // Set methods
            'entries',
            'has',
            'keys',
            'values',
          ].includes(node.callee.property.name)
        ) {
          return;
        }

        checkExpression(node.callee.object);
      },
    };
  },
});

function isEmptyLiteral(node: TSESTree.Node): boolean {
  switch (node.type) {
    case AST_NODE_TYPES.TSSatisfiesExpression:
    case AST_NODE_TYPES.TSAsExpression:
    case AST_NODE_TYPES.TSNonNullExpression:
      return isEmptyLiteral(node.expression);

    case AST_NODE_TYPES.ArrayExpression:
      return node.elements.length === 0;

    case AST_NODE_TYPES.ObjectExpression:
      return node.properties.length === 0;

    case AST_NODE_TYPES.Literal:
      return node.value === '';

    case AST_NODE_TYPES.NewExpression: {
      if (node.callee.type !== AST_NODE_TYPES.Identifier) return false;
      if (
        ![
          'Array',
          'Object',
          'Map',
          'Set',
          'WeakMap',
          'WeakSet',

          // TypedArrays:
          'Int8Array',
          'Uint8Array',
          'Uint8ClampedArray',
          'Int16Array',
          'Uint16Array',
          'Int32Array',
          'Uint32Array',
          'Float16Array',
          'Float32Array',
          'Float64Array',
          'BigInt64Array',
          'BigUint64Array',
        ].includes(node.callee.name)
      ) {
        return false;
      }

      // new Map()
      const [arg] = node.arguments;
      if (!arg) return true;

      // new Set([])
      return isEmptyLiteral(arg);
    }

    default:
      return false;
  }
}
