import path from 'node:path';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid `catch` clauses with unbound errors',
      strict: true,
    },
    schema: [],
    messages: {
      noUnboundError: 'You should use the error caught by this `catch` clause.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CatchClause(node) {
        if (node.param) return;
        context.report({ node, messageId: 'noUnboundError' });
      },
    };
  },
});
