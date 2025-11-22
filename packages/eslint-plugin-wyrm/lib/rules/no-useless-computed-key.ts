import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid useless computed keys',
      strict: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noUselessComputedKey: 'This property key does not need to be a computed key.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      Property(node) {
        if (!node.computed) return;
        if (node.key.type !== AST_NODE_TYPES.Literal) return;
        if (typeof node.key.value !== 'string') return;

        const { raw } = node.key;

        context.report({
          node: node.key,
          messageId: 'noUselessComputedKey',
          fix(fixer) {
            const value = context.sourceCode.getText(node.value);
            const propertyText = `${raw}: ${value}`;
            return fixer.replaceText(node, propertyText);
          },
        });
      },
    };
  },
});
