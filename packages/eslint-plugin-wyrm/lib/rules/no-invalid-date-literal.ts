import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow invalid date literals',
      recommended: true,
    },
    schema: [],
    messages: {
      noInvalidDateLiteral: 'This results in an invalid date',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      NewExpression(node) {
        if (node.callee.type !== AST_NODE_TYPES.Identifier) return;
        if (node.callee.name !== 'Date') return;

        if (node.arguments.length > 1) return;
        const [arg] = node.arguments;
        if (!arg) return;

        if (arg.type === AST_NODE_TYPES.Identifier) {
          if (['NaN', 'Infinity'].includes(arg.name)) {
            context.report({ node, messageId: 'noInvalidDateLiteral' });
          }
          return;
        }

        if (arg.type !== AST_NODE_TYPES.Literal) return;

        if (typeof arg.value === 'string' || typeof arg.value === 'number') {
          if (isValidDateLiteral(arg.value)) return;
          context.report({ node, messageId: 'noInvalidDateLiteral' });
        }
      },

      CallExpression(node) {
        const { callee } = node;
        if (callee.type !== AST_NODE_TYPES.MemberExpression) return;
        if (callee.object.type !== AST_NODE_TYPES.Identifier) return;
        if (callee.property.type !== AST_NODE_TYPES.Identifier) return;

        if (callee.object.name !== 'Date') return;
        if (callee.property.name !== 'parse') return;

        const [arg] = node.arguments;

        if (!arg) return;
        if (arg.type !== AST_NODE_TYPES.Literal) return;

        if (typeof arg.value === 'string') {
          if (isValidDateLiteral(arg.value)) return;
          context.report({ node, messageId: 'noInvalidDateLiteral' });
        }
      },
    };
  },
});

function isValidDateLiteral(literal: string | number): boolean {
  const value: number = new Date(literal).valueOf();
  return !Number.isNaN(value);
}
