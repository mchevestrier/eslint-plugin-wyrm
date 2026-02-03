/**
 * @fileoverview
 *
 * Comparing values that are possibly undefined or null can hint to subtle issues in business logic,
 * for example when equality is used to authorize access.
 *
 * @example
 * ```ts
 * function canViewPrivateStuff(
 *   stuffOwnerId: string | null,
 *   currentUserId: string | null,
 * ): boolean {
 *   // If both stuffOwnerId and currentUserId are null,
 *   // this will return true, which may have unintended consequences.
 *   return stuffOwnerId === currentUserId;
 * }
 * ```
 */

import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import * as ts from 'typescript';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid checking the equality of possibly nullish values',
      requiresTypeChecking: true,
      strict: true,
    },
    schema: [],
    messages: {
      noPossiblyNullishEquality:
        'You are comparing two values, but if they are both undefined or both null, they will be considered equal. Make sure this is expected.',
      noPossiblyNullishLooseEquality:
        'You are comparing two values, but if they are both undefined or null, they will be considered equal. Make sure this is expected.',
      noConstantNullishComparison:
        'You are comparing some values that can only be undefined or null here. You should use literals like `null` or `undefined` instead',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      BinaryExpression(node) {
        if (
          node.operator !== '==' &&
          node.operator !== '===' &&
          node.operator !== '!=' &&
          node.operator !== '!=='
        ) {
          return;
        }

        if (!isIdentifier(node.left) || !isIdentifier(node.right)) return;

        const services = ESLintUtils.getParserServices(context);

        const leftType = services.getTypeAtLocation(node.left);
        if (!isPossiblyNullish(leftType)) return;
        if (isConstantNullish(leftType)) {
          context.report({ node, messageId: 'noConstantNullishComparison' });
          return;
        }

        const rightType = services.getTypeAtLocation(node.right);
        if (!isPossiblyNullish(rightType)) return;
        if (isConstantNullish(rightType)) {
          context.report({ node, messageId: 'noConstantNullishComparison' });
          return;
        }

        const isLooseEquality = node.operator === '!=' || node.operator === '==';
        if (!isLooseEquality && !nullishTypesIntersect(leftType, rightType)) return;

        if (isLooseEquality) {
          context.report({ node, messageId: 'noPossiblyNullishLooseEquality' });
          return;
        }

        context.report({ node, messageId: 'noPossiblyNullishEquality' });
      },
    };
  },
});

function isPossiblyNullish(type: ts.Type) {
  if (type.isUnion() && type.types.some((t) => isPossiblyNullish(t))) {
    return true;
  }

  return (type.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)) !== 0;
}

function nullishTypesIntersect(a: ts.Type, b: ts.Type): boolean {
  if (isPossiblyNull(a) && !isPossiblyNull(b)) return false;
  if (isPossiblyUndefined(a) && !isPossiblyUndefined(b)) return false;

  // The following conditions can never be true because a & b are always nullish (so either null or undefined)

  /* v8 ignore if -- @preserve */
  if (!isPossiblyNull(a) && isPossiblyNull(b)) return false;
  /* v8 ignore if -- @preserve */
  if (!isPossiblyUndefined(a) && isPossiblyUndefined(b)) return false;

  return true;
}

function isPossiblyNull(type: ts.Type) {
  if (type.isUnion() && type.types.some((t) => isPossiblyNull(t))) {
    return true;
  }

  return (type.flags & ts.TypeFlags.Null) !== 0;
}

function isPossiblyUndefined(type: ts.Type) {
  if (type.isUnion() && type.types.some((t) => isPossiblyUndefined(t))) {
    return true;
  }

  return (type.flags & ts.TypeFlags.Undefined) !== 0;
}

function isConstantNullish(type: ts.Type) {
  if (type.isUnion() && type.types.every((t) => isConstantNullish(t))) {
    return true;
  }

  return (type.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)) !== 0;
}

function isIdentifier(node: TSESTree.Node): boolean {
  if (node.type !== AST_NODE_TYPES.Identifier) return false;
  if (node.name === 'undefined') return false;
  return true;
}
