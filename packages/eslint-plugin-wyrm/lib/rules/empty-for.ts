import path from 'node:path';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid using `for (;;)`',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noEmptyFor: 'Use `while (true)` instead of `for (;;)`',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ForStatement(node) {
        if (node.init) return;
        if (node.test) return;
        if (node.update) return;

        context.report({
          node,
          messageId: 'noEmptyFor',
          fix(fixer) {
            return fixer.replaceTextRange(
              [node.range[0], node.body.range[0]],
              'while (true) ',
            );
          },
        });
      },
    };
  },
});
