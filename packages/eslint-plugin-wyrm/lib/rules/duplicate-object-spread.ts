import path from 'node:path';

import { AST_NODE_TYPES, AST_TOKEN_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid duplicate spread elements in object literals',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      duplicateSpread: 'This variable is already spread into the object literal',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        const seen = new Set<string>();

        for (const prop of node.properties) {
          if (prop.type !== AST_NODE_TYPES.SpreadElement) continue;
          if (prop.argument.type !== AST_NODE_TYPES.Identifier) continue;
          const value = prop.argument.name;

          if (!seen.has(value)) {
            seen.add(value);
            continue;
          }

          context.report({
            node: prop,
            messageId: 'duplicateSpread',
            *fix(fixer) {
              yield fixer.remove(prop);

              const commaToken = context.sourceCode.getTokenAfter(prop);
              if (
                commaToken?.type === AST_TOKEN_TYPES.Punctuator &&
                commaToken.value === ','
              ) {
                yield fixer.remove(commaToken);
              }
            },
          });
        }
      },
    };
  },
});
