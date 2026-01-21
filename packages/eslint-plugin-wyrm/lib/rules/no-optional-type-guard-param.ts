/**
 * @fileoverview
 *
 * In TypeScript, marking a function parameter as optional
 * means the function can be called without passing an argument for this parameter.
 * But calling a type guard without an argument makes no sense,
 * as the function is supposed to assert the type of this argument.
 *
 * @example
 * ```ts
 * // Here, `x` is optional, so `isString()` can be called without any argument
 * function isString(x?: unknown): x is string {
 *   return typeof x === 'string';
 * }
 *
 * isString(); // This would certainly be a mistake, but TypeScript would not complain
 * ```
 *
 * Instead, you can use a type union to mark the parameter as possibly undefined.
 *
 * @example
 * ```ts
 * function isString(x: string | undefined): x is string {
 *   return typeof x === 'string';
 * }
 *
 * isString(); // Now TypeScript will complain if we forget to pass an argument
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
      description: 'Forbid optional parameters in type guards',
      recommended: true,
    },
    schema: [],
    messages: {
      optionalTypeGuardParam:
        'This parameter is used in a type predicate, it probably should not be optional.',
    },
  },
  defaultOptions: [],
  create(context) {
    function checkFunction(
      fn:
        | TSESTree.FunctionDeclaration
        | TSESTree.FunctionExpression
        | TSESTree.ArrowFunctionExpression,
    ): void {
      if (!fn.returnType) return;
      const { typeAnnotation } = fn.returnType;
      if (typeAnnotation.type !== AST_NODE_TYPES.TSTypePredicate) return;
      const { parameterName } = typeAnnotation;
      if (parameterName.type !== AST_NODE_TYPES.Identifier) return;

      const param = fn.params
        .filter((p) => p.type === AST_NODE_TYPES.Identifier)
        .find((p) => p.name === parameterName.name);

      if (!param) return;
      if (!param.optional) return;

      context.report({ node: param, messageId: 'optionalTypeGuardParam' });
    }

    return {
      FunctionDeclaration: checkFunction,
      FunctionExpression: checkFunction,
      ArrowFunctionExpression: checkFunction,
    };
  },
});
