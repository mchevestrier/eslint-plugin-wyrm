import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid numbered comments',
      pedantic: true,
    },
    schema: [],
    messages: {
      noNumberedComment: 'Do not use numbered comments.',
    },
  },
  defaultOptions: [],
  create(context) {
    if (typeof context.sourceCode.getAllComments === 'undefined') return {};

    const comments = context.sourceCode.getAllComments();

    for (const comment of comments) {
      if (!isNumberedComment(comment)) continue;

      context.report({
        node: comment,
        messageId: 'noNumberedComment',
      });
    }

    return {};
  },
});

function isNumberedComment(comment: TSESTree.Comment): boolean {
  return /^\d+\. /u.test(comment.value.trim());
}
