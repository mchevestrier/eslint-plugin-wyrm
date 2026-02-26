import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid useless fallback for nullish values in object spread',
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

          const { right } = prop.argument;

          const isEmptyObject =
            right.type === AST_NODE_TYPES.ObjectExpression && !right.properties.length;
          const isUndefined =
            right.type === AST_NODE_TYPES.Identifier && right.name === 'undefined';
          const isNonIterableLiteral =
            right.type === AST_NODE_TYPES.Literal && typeof right.value !== 'string';

          const isNullishEquivalent =
            isEmptyObject || isUndefined || isNonIterableLiteral;
          if (!isNullishEquivalent) return;

          context.report({ node: prop, messageId: 'uselessFallback' });
        }
      },
    };
  },
});
