import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow suspicious use of `.map().length`',
      recommended: true,
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      suspiciousMapLength:
        'Using `.map().length` does not make a lot of sense, did you mean `.filter().length`?',
      useFilter: 'Use `.filter().length` instead',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      MemberExpression(node) {
        if (node.property.type !== AST_NODE_TYPES.Identifier) return;
        if (node.property.name !== 'length') return;

        if (node.object.type !== AST_NODE_TYPES.CallExpression) return;
        if (node.object.callee.type !== AST_NODE_TYPES.MemberExpression) return;

        if (node.object.callee.property.type !== AST_NODE_TYPES.Identifier) return;
        if (node.object.callee.property.name !== 'map') return;

        const method = node.object.callee.property;

        context.report({
          node,
          messageId: 'suspiciousMapLength',
          suggest: [
            {
              messageId: 'useFilter',
              fix(fixer) {
                return fixer.replaceText(method, 'filter');
              },
            },
          ],
        });
      },
    };
  },
});
