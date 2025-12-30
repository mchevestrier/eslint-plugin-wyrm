import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid disallowed comments like FIXME, XXX, HACK',
      strict: true,
    },
    schema: [],
    messages: {
      noDisallowedWarningComment: 'Just use TODO',
    },
  },
  defaultOptions: [],
  create(context) {
    if (typeof context.sourceCode.getAllComments === 'undefined') return {};

    const comments = context.sourceCode.getAllComments();

    for (const comment of comments) {
      checkBadTodo(comment);
      checkWarningComment(comment);
    }

    return {};

    function checkWarningComment(comment: TSESTree.Comment) {
      const prefixes = [
        'fixme',
        'hack',
        'xxx',
        // spellchecker:ignore-next-line
        'tood',
        'tdo',
      ];

      for (const line of getLines(comment)) {
        if (!startsWith(line, prefixes)) continue;

        context.report({
          node: comment,
          messageId: 'noDisallowedWarningComment',
        });
        break;
      }
    }

    function checkBadTodo(comment: TSESTree.Comment) {
      for (const line of getLines(comment)) {
        if (!isBadTodo(line)) continue;

        context.report({
          node: comment,
          messageId: 'noDisallowedWarningComment',
        });
        break;
      }
    }
  },
});

function getLines(comment: TSESTree.Comment) {
  return comment.value.split(/\n|\r|\r\n/u).map((line) => line.trim());
}

/** Whether a string starts with a non-standard casing of some string */
function startsWithNonStandard(str: string, standard: string) {
  if (str.startsWith(standard)) return false;
  return startsWithCaseInsensitive(str, standard);
}

function startsWithCaseInsensitive(haystack: string, needle: string) {
  return haystack.toLowerCase().startsWith(needle.toLowerCase());
}

const suffixes = [' ', ':', ',', ';', '(', '.', '!'];

function isBadTodo(line: string) {
  const standard = 'TODO';

  if (line === standard) return false;
  if (line.toLowerCase() === standard.toLowerCase()) return true;

  return suffixes.some((suffix) => startsWithNonStandard(line, `${standard}${suffix}`));
}

function startsWith(line: string, keywords: string[]) {
  return keywords.some(
    (keyword) =>
      line.toLowerCase() === keyword.toLowerCase() ||
      suffixes.some((suffix) => startsWithCaseInsensitive(line, `${keyword}${suffix}`)),
  );
}
