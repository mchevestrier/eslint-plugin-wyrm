import path from 'node:path';

import { AST_TOKEN_TYPES, type TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid empty comments',
      strict: true,
    },
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          allowStacked: {
            type: 'boolean',
            description:
              'Whether to allow empty comments stacked next to non-empty comments',
          },
        },
      },
    ],
    messages: {
      noEmptyComment: 'Remove this empty comment',
    },
  },
  defaultOptions: [{ allowStacked: false }],
  create(context, [options]) {
    const comments = context.sourceCode.getAllComments();

    for (const comment of comments) {
      if (!isEmptyComment(comment)) continue;

      if (options.allowStacked && isStackedComment(comment, comments)) continue;

      context.report({
        node: comment,
        messageId: 'noEmptyComment',
      });
    }

    return {};
  },
});

function isEmptyComment(comment: TSESTree.Comment): boolean {
  const content = comment.value.replace(/^\*/, '').replaceAll('*\n', '').trim();
  return !content;
}

function isStackedComment(
  comment: TSESTree.Comment,
  comments: TSESTree.Comment[],
): boolean {
  if (comment.type !== AST_TOKEN_TYPES.Line) return false;

  return comments.some((otherComment) => {
    if (otherComment === comment) return false;
    if (otherComment.type !== AST_TOKEN_TYPES.Line) return false;
    if (isEmptyComment(otherComment)) return false;

    if (otherComment.loc.start.line === comment.loc.start.line - 1) return true;
    if (otherComment.loc.start.line === comment.loc.start.line + 1) return true;

    return false;
  });
}
