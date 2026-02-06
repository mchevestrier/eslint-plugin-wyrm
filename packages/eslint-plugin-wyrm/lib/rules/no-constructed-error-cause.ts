/**
 * @fileoverview
 *
 * The `Error.cause` property is used to wrap a previously caught error in a new instantiated error:
 *
 * ```ts
 * try {
 *   // ...
 * } catch (err) {
 *   throw Error('New error message', { cause: err });
 * }
 * ```
 *
 * But sometimes it can also be used as a way to store additional information on `Error` objects:
 *
 * ```ts
 * throw Error('Division by zero', { cause: { code: 'division_by_zero' } });
 * ```
 *
 * This second pattern is what this rule forbids. Custom errors should be used instead:
 *
 * ```ts
 * class ZeroDivisionError extends Error {
 *   public override message = 'Division by zero';
 *   public code = 'division_by_zero';
 * }
 *
 * throw new ZeroDivisionError();
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
    type: 'suggestion',
    docs: {
      description: 'Forbid using `Error.cause` with constructed objects',
      strict: true,
    },
    schema: [],
    messages: {
      noConstructedErrorCause:
        'Error.cause should be used to wrap a caught error, not to include new information',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      NewExpression: checkInstantiation,
      CallExpression: checkInstantiation,
    };

    function checkInstantiation(node: TSESTree.NewExpression | TSESTree.CallExpression) {
      if (node.callee.type !== AST_NODE_TYPES.Identifier) return;
      if (node.callee.name !== 'Error') return;

      const [, options] = node.arguments;
      if (!options) return;
      if (options.type !== AST_NODE_TYPES.ObjectExpression) return;
      const cause = options.properties
        .filter((prop) => prop.type === AST_NODE_TYPES.Property)
        .find(
          ({ key }) => key.type === AST_NODE_TYPES.Identifier && key.name === 'cause',
        )?.value;

      if (!cause) return;

      switch (cause.type) {
        case AST_NODE_TYPES.CallExpression:
        case AST_NODE_TYPES.ObjectExpression:
        case AST_NODE_TYPES.NewExpression:
          break;

        default:
          return;
      }

      context.report({ node, messageId: 'noConstructedErrorCause' });
    }
  },
});
