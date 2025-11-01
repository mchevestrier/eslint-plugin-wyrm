import path from 'node:path';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid empty JSX expression containers',
      recommended: true,
    },
    schema: [],
    messages: {
      noEmptyJsxExpression: 'Remove this empty JSX expression container',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXEmptyExpression(node) {
        const comments = context.sourceCode.getCommentsInside(node);
        if (comments.length) return;
        context.report({ node, messageId: 'noEmptyJsxExpression' });
      },
    };
  },
});
