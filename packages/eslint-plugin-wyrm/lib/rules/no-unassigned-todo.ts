import path from 'node:path';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid unassigned TODO comments',
      strict: true,
    },
    schema: [],
    messages: {
      noUnassignedComment:
        'Add details to this comment, such as an owner: TODO(johndoe) or a ticket ID: TODO(#1234)',
    },
  },
  defaultOptions: [],
  create(context) {
    if (typeof context.sourceCode.getAllComments === 'undefined') return {};

    const comments = context.sourceCode.getAllComments();

    for (const comment of comments) {
      for (const line of comment.value.split(/\n|\r|\r\n/u)) {
        if (!hasUnassignedTodo(line)) continue;

        context.report({
          node: comment,
          messageId: 'noUnassignedComment',
        });
      }
    }

    return {};
  },
});

function hasUnassignedTodo(line: string): boolean {
  const value = line.trim().replace(/^\*/u, '').trim().toLowerCase();

  if (!/^todo(?:\W|$)/u.test(value)) return false;

  return !/^todo\([^)]+\)/u.test(value);
}
