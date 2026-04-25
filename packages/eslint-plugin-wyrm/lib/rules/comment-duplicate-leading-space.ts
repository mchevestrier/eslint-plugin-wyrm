import path from 'node:path';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid duplicate leading space in comments',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      duplicateSpace: 'Remove this duplicate leading space',
    },
  },
  defaultOptions: [],
  create(context) {
    if (typeof context.sourceCode.getAllComments === 'undefined') return {};

    const comments = context.sourceCode.getAllComments();
    for (const comment of comments) {
      if (/^ {2}\w/u.test(comment.value)) {
        context.report({
          node: comment,
          messageId: 'duplicateSpace',
          fix(fixer) {
            const start = comment.range[0];
            const range = [start + 2, start + 3] as const;
            return fixer.removeRange(range);
          },
        });
      }
    }
    return {};
  },
});
