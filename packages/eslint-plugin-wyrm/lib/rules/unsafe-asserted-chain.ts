/**
 * @fileoverview
 *
 * This rule supplements the [`@typescript-eslint/no-non-null-asserted-optional-chain`](https://typescript-eslint.io/rules/no-non-null-asserted-optional-chain/) ESLint rule.
 *
 * It checks for type assertions on optional chain expressions (`?.`) where the asserted type doesn't include `undefined`.
 *
 * Optional chaining can return `undefined` by definition, so this is likely a mistake.
 *
 * This rule only makes sense if you have `strictNullChecks` enabled in your `tsconfig.json` (this is the default for `strict: true`).
 *
 * @example
 * ```ts
 * foo?.bar as string;
 * // This should be:
 * foo?.bar as string | undefined;
 * // Or, if the optional chaining isn't actually necessary:
 * foo.bar as string;
 * ```
 */

import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import * as ts from 'typescript';

import { createRule } from '../utils/createRule.js';
import type { Option } from '../utils/option.js';
import { None, Some } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow unsafe type assertions on optional chained expressions',
      requiresTypeChecking: true,
      strict: true,
    },
    schema: [],
    messages: {
      unsafeAssertionOnOptionalChain:
        'You should type assert as a type that includes undefined',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      TSAsExpression(node) {
        if (!hasOptionalChaining(node.expression)) return;

        const services = ESLintUtils.getParserServices(context);

        const type = services.getTypeAtLocation(node);

        if (type.isUnion() && type.types.some((t) => t.flags & ts.TypeFlags.Undefined)) {
          return;
        }

        if (type.flags & ts.TypeFlags.Any) return;
        if (type.flags & ts.TypeFlags.Unknown) return;

        context.report({ node, messageId: 'unsafeAssertionOnOptionalChain' });
      },
    };
  },
});

function hasOptionalChaining(expression: TSESTree.Expression) {
  if (
    expression.type === AST_NODE_TYPES.ChainExpression ||
    expression.type === AST_NODE_TYPES.TSSatisfiesExpression ||
    expression.type === AST_NODE_TYPES.TSAsExpression
  ) {
    return hasOptionalChaining(expression.expression);
  }

  if (
    expression.type !== AST_NODE_TYPES.MemberExpression &&
    expression.type !== AST_NODE_TYPES.CallExpression
  ) {
    return false;
  }

  const memberExpression = unwrapMemberExpression(expression);

  if (!memberExpression.some) return false;
  if (memberExpression.value.optional) return true;

  return hasOptionalChaining(memberExpression.value.object);
}

function unwrapMemberExpression(
  expr: TSESTree.CallExpression | TSESTree.MemberExpression,
): Option<TSESTree.MemberExpression> {
  if (expr.type === AST_NODE_TYPES.MemberExpression) return Some(expr);

  if (expr.callee.type !== AST_NODE_TYPES.MemberExpression) return None;
  return Some(expr.callee);
}
