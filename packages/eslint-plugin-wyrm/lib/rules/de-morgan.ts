import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';
import { isNegatableOperator, negateExpression } from '../utils/negateExpression.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        "Enforce using De Morgan's law to simplify negated logical expressions",
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      deMorgan: "Use De Morgan's law to simplify this negated logical expression",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      UnaryExpression(node) {
        if (node.operator !== '!') return;
        if (
          node.parent.type === AST_NODE_TYPES.UnaryExpression &&
          node.parent.operator === '!'
        ) {
          return;
        }

        if (node.argument.type === AST_NODE_TYPES.BinaryExpression) {
          if (!isNegatableOperator(node.argument.operator)) return;
          const expr = node.argument;

          context.report({
            node,
            messageId: 'deMorgan',
            fix(fixer) {
              return fixer.replaceText(node, `(${negateExpression(expr, context)})`);
            },
          });
        }

        if (node.argument.type === AST_NODE_TYPES.LogicalExpression) {
          if (node.argument.operator === '??') return;
          const expr = node.argument;

          context.report({
            node,
            messageId: 'deMorgan',
            fix(fixer) {
              return fixer.replaceText(node, `(${negateExpression(expr, context)})`);
            },
          });
        }
      },
    };
  },
});
