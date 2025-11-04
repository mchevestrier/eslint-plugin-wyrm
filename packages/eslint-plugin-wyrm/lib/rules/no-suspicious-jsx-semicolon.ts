/**
 * @fileoverview
 *
 * This rule detects the potential accidental insertion of a semicolon or comma in JSX when refactoring.
 */

import path from 'node:path';

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
        if (node.value.trim() === ';') {
          context.report({ node, messageId: 'noSuspiciousJsxSemicolon' });
          return;
        }

        if (node.value.trimEnd() === ',') {
          context.report({ node, messageId: 'noSuspiciousJsxComma' });
        }
      },
    };
  },
});
