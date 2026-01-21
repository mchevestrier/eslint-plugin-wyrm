/**
 * @fileoverview
 *
 * Trying to build and parse URLs manually instead of relying on existing parsers is usually a bad idea,
 * as developers tend to overestimate their understanding of the URL spec and will often miss some edge cases, leading to subtle bugs.
 *
 * Instead, JavaScript code should use `URL` and `URLSearchParams` to build and parse URLs.
 *
 * @example
 * ```ts
 * // Bad: using `String.prototype.split` to extract the query string
 * const urlParams = new URLSearchParams(href.split('?')[1]);
 * // Good: using `URL` to extract the query params
 * const urlParams = new URL(href).searchParams;
 * ```
 */

import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid parsing or building URLs by hand',
      strict: true,
    },
    schema: [],
    messages: {
      noCustomUrlParsing:
        "It looks like you're trying to parse or build URLs by hand. Use the URL or URLSearchParams constructor instead.",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ConditionalExpression(node) {
        if (
          node.consequent.type !== AST_NODE_TYPES.Literal ||
          node.alternate.type !== AST_NODE_TYPES.Literal
        ) {
          return;
        }

        if (
          (node.consequent.value === '?' && node.alternate.value === '&') ||
          (node.consequent.value === '&' && node.alternate.value === '?')
        ) {
          context.report({ node, messageId: 'noCustomUrlParsing' });
        }
      },

      CallExpression(node) {
        if (node.arguments[0]?.type !== AST_NODE_TYPES.Literal) return;
        if (node.arguments[0].value !== '?') return;

        if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return;
        if (node.callee.property.type !== AST_NODE_TYPES.Identifier) return;
        if (!['indexOf', 'split'].includes(node.callee.property.name)) return;

        context.report({ node, messageId: 'noCustomUrlParsing' });
      },
    };
  },
});
