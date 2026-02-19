import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Forbid useless empty object fallback for nullish values in object spread',
      strict: true,
    },
    schema: [],
    messages: {
      uselessFallback:
        'You do not need a fallback, nullish values are ignored when spread into objects.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        for (const prop of node.properties) {
          if (prop.type !== AST_NODE_TYPES.SpreadElement) continue;
          if (prop.argument.type !== AST_NODE_TYPES.LogicalExpression) continue;
          if (prop.argument.operator !== '??') continue;
          if (prop.argument.right.type !== AST_NODE_TYPES.ObjectExpression) continue;
          if (prop.argument.right.properties.length) continue;

          context.report({ node: prop, messageId: 'uselessFallback' });
        }
      },
    };
  },
});
