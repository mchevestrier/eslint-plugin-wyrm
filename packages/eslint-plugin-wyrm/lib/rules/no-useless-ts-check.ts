import path from 'node:path';

import { AST_TOKEN_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid useless `@ts-check` comments in TypeScript files',
      recommended: true,
    },
    schema: [],
    messages: {
      noUselessTsCheck: 'You do not need `@ts-check` comments in TypeScript files.',
    },
  },
  defaultOptions: [],
  create(context) {
    if (typeof context.sourceCode.getAllComments === 'undefined') return {};

    if (!context.filename.endsWith('.ts') && !context.filename.endsWith('.tsx')) {
      return {};
    }

    const comments = context.sourceCode.getAllComments();

    for (const comment of comments) {
      if (comment.type !== AST_TOKEN_TYPES.Line) continue;
      if (comment.value.trim() !== '@ts-check') continue;

      context.report({
        node: comment,
        messageId: 'noUselessTsCheck',
      });
    }

    return {};
  },
});
