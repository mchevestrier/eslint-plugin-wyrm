import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid commented out comments',
      recommended: true,
    },
    schema: [],
    messages: {
      commentedOutComment:
        'This looks like a commented out comment. Make sure this is expected.',
    },
  },
  defaultOptions: [],
  create(context) {
    if (typeof context.sourceCode.getAllComments === 'undefined') return {};

    const comments = context.sourceCode.getAllComments();

    for (const comment of comments) {
      checkComment(comment);
    }

    return {};

    function checkComment(comment: TSESTree.Comment) {
      if (
        comment.value.trim().startsWith('//') ||
        comment.value.trim().startsWith('/*')
      ) {
        context.report({ node: comment, messageId: 'commentedOutComment' });
      }
    }
  },
});
