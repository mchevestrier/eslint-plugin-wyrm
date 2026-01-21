import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';
import { None, type Option, Some } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid out of order numbered comments',
      recommended: true,
    },
    schema: [],
    messages: {
      noOutOfOrderComments: 'Do not use numbered comments.',
    },
  },
  defaultOptions: [],
  create(context) {
    if (typeof context.sourceCode.getAllComments === 'undefined') return {};

    const comments = context.sourceCode.getAllComments();

    let lastNumber: number | null = null;

    for (const comment of comments) {
      const n = getCommentNumber(comment);
      if (!n.some) continue;

      if (!lastNumber || n.value === 1) {
        lastNumber = n.value;
        continue;
      }

      if (lastNumber !== n.value - 1) {
        context.report({
          node: comment,
          messageId: 'noOutOfOrderComments',
        });
      }

      lastNumber = n.value;
    }

    return {};
  },
});

function getCommentNumber(comment: TSESTree.Comment): Option<number> {
  const result = /^(?<number>\d+)\. /u.exec(comment.value.trim());
  if (!result) return None;
  const capture = result.groups?.['number'];
  /** v8 ignore if -- @preserve */
  if (capture === undefined) {
    return None;
  }
  const n = Number(capture);
  if (!Number.isFinite(n)) return None;
  return Some(n);
}
