import path from 'node:path';

import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid duplicate keys in object destructuring patterns',
      recommended: true,
    },
    schema: [],
    messages: {
      duplicateKey:
        'This property key appears several times in the destructuring pattern. Make sure this is expected.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectPattern(node) {
        const seen = new Map<string, TSESTree.Node>();

        for (const prop of node.properties) {
          if (prop.type === AST_NODE_TYPES.RestElement) continue;
          const value = extractKeyValue(prop.key);
          if (value === undefined) continue;
          if (!seen.has(value)) {
            seen.set(value, prop.key);
            continue;
          }

          context.report({ node: prop.key, messageId: 'duplicateKey' });
        }
      },
    };
  },
});

function extractKeyValue(key: TSESTree.Property['key']): string | undefined {
  if (key.type === AST_NODE_TYPES.Identifier) {
    return key.name;
  }

  if (key.type !== AST_NODE_TYPES.Literal) {
    return undefined;
  }

  if (key.value === null) return 'null';
  return key.value.toString();
}
