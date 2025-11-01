/**
 * This rule supplements the [`@typescript-eslint/no-non-null-asserted-optional-chain`](https://typescript-eslint.io/rules/no-non-null-asserted-optional-chain/) ESLint rule.
 *
 * It checks for type assertions on optional chain expressions (`?.`) where the asserted type doesn't include `undefined`.
 *
 * Optional chaining can return `undefined` by default, so this is likely a mistake.
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
        if (node.expression.type !== AST_NODE_TYPES.ChainExpression) return;

        let propertyAccess: TSESTree.Node = node.expression.expression;

        if (node.expression.expression.type === AST_NODE_TYPES.CallExpression) {
          propertyAccess = node.expression.expression.callee;
        }

        if (propertyAccess.type !== AST_NODE_TYPES.MemberExpression) return;

        if (!propertyAccess.optional) {
          console.error(
            'ChainExpression > MemberExpression.optional should always be true',
          );
          return;
        }

        const services = ESLintUtils.getParserServices(context);

        const type = services.getTypeAtLocation(node);

        if (
          type.isUnion() &&
          type.types.some((t) => {
            if (t.flags & ts.TypeFlags.Undefined) return true;
            if (t.flags & ts.TypeFlags.Any) return true;
            if (t.flags & ts.TypeFlags.Unknown) return true;
            return false;
          })
        ) {
          return;
        }

        if (type.flags & ts.TypeFlags.Any) return;
        if (type.flags & ts.TypeFlags.Unknown) return;

        context.report({ node, messageId: 'unsafeAssertionOnOptionalChain' });
      },
    };
  },
});
