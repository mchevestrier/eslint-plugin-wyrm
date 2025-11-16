import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid leading or trailing whitespace in object keys',
      strict: true,
    },
    schema: [],
    messages: {
      noWhitespace:
        'This property key contains a leading or trailing whitespace. Make sure this is expected.',
    },
  },
  defaultOptions: [],
  create(context) {
    function checkKey(key: TSESTree.Node): void {
      if (key.type !== AST_NODE_TYPES.Literal) return;

      const { value } = key;
      if (typeof value !== 'string') return;

      if (!value.startsWith(' ') && !value.endsWith(' ')) return;

      context.report({ node: key, messageId: 'noWhitespace' });
    }

    return {
      Property(node) {
        checkKey(node.key);
      },
      TSPropertySignature(node) {
        checkKey(node.key);
      },
    };
  },
});
