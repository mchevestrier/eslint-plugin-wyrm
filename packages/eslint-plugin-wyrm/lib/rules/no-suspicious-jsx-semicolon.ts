/**
 * @fileoverview
 *
 * This rule detects the potential accidental insertion of a semicolon or comma in JSX when refactoring.
 */

import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid suspicious semicolons in JSX',
      recommended: true,
    },
    schema: [],
    messages: {
      noSuspiciousJsxSemicolon:
        'This semicolon looks suspiciously out of place. Did you add it on purpose?',
      noSuspiciousJsxComma:
        'This comma looks suspiciously out of place. Did you add it on purpose?',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXText(node) {
        /* v8 ignore if -- @preserve */
        if (
          node.parent.type !== AST_NODE_TYPES.JSXElement &&
          node.parent.type !== AST_NODE_TYPES.JSXFragment
        ) {
          const msg = `Did not expect JSXText node to be a child of ${node.parent.type}`;
          console.warn(msg);
          return;
        }

        if (node.parent.children.at(-1) !== node) return;

        const previousNeighbor = node.parent.children.at(-2);
        if (!previousNeighbor) return;
        if (
          previousNeighbor.type !== AST_NODE_TYPES.JSXElement &&
          previousNeighbor.type !== AST_NODE_TYPES.JSXFragment
        ) {
          return;
        }

        const neighborBeforeElement = node.parent.children.at(-3);
        if (
          neighborBeforeElement?.type === AST_NODE_TYPES.JSXText &&
          neighborBeforeElement.value.trim()
        ) {
          return;
        }

        if (node.value.trim() === ';') {
          context.report({ node, messageId: 'noSuspiciousJsxSemicolon' });
          return;
        }

        if (node.value.trimEnd() === ',' && node.value.includes(',\n')) {
          context.report({ node, messageId: 'noSuspiciousJsxComma' });
        }
      },
    };
  },
});
