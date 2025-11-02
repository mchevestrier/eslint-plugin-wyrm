import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

const DEFAULT_ALLOW_SINGLE_LINE = false;

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow ternary conditions in return statements',
      strict: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          allowSingleLine: {
            type: 'boolean',
            description: `Whether to allow single line ternary conditions. Default: \`${DEFAULT_ALLOW_SINGLE_LINE}\``,
          },
        },
      },
    ],
    messages: {
      noTernaryReturn: 'Replace this ternary condition by multiple return statements',
    },
  },
  defaultOptions: [{ allowSingleLine: DEFAULT_ALLOW_SINGLE_LINE }],
  create(context, [options]) {
    return {
      ReturnStatement(node) {
        const { argument } = node;
        if (!argument) return;
        if (argument.type !== AST_NODE_TYPES.ConditionalExpression) return;

        if (
          options.allowSingleLine &&
          argument.loc.start.line === argument.loc.end.line
        ) {
          return;
        }

        const { test, consequent, alternate } = argument;

        context.report({
          node,
          messageId: 'noTernaryReturn',
          *fix(fixer) {
            const condText = context.sourceCode.getText(test);
            const thenText = context.sourceCode.getText(consequent);
            const elseText = context.sourceCode.getText(alternate);

            const indent = ' '.repeat(node.loc.start.column);

            yield fixer.replaceText(node, `if (${condText}) return ${thenText};`);
            yield fixer.insertTextAfter(node, `\n${indent}return ${elseText};`);
          },
        });
      },
    };
  },
});
