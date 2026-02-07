import path from 'node:path';

/** @import {TSESTree} from '@typescript-eslint/utils' */

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid skipped test cases',
    },
    schema: [],
    messages: {
      noSkip: 'Do not forget to unskip this test.',
      noSkipFalse: 'You can just remove the `skip` property.',
      weirdSkipValue: 'Only use true/false for the `skip` property.',
    },
  },
  create(context) {
    if (!context.filename.endsWith('.test.ts')) return {};

    return {
      ObjectExpression(node) {
        const props = node.properties
          .filter((prop) => prop.type === AST_NODE_TYPES.Property)
          .map((prop) => /** @type {const} */ ([prop.key, prop]));

        const [, valid] =
          props.find(
            ([key]) => key.type === AST_NODE_TYPES.Identifier && key.name === 'valid',
          ) ?? [];

        const [, invalid] =
          props.find(
            ([key]) => key.type === AST_NODE_TYPES.Identifier && key.name === 'invalid',
          ) ?? [];

        if (!valid || !invalid) return;

        checkProperty(valid);
        checkProperty(invalid);
      },
    };

    /** @param {TSESTree.Property} prop */
    function checkProperty(prop) {
      if (prop.value.type !== AST_NODE_TYPES.ArrayExpression) {
        console.error('Value of valid/invalid key was not an array literal');
        return;
      }

      for (const testCase of prop.value.elements) {
        if (testCase?.type !== AST_NODE_TYPES.ObjectExpression) {
          console.error('Test case was not an object literal');
          continue;
        }

        const skipProp = findProperty(testCase.properties, 'skip');

        if (skipProp === undefined) continue;

        if (
          skipProp.value.type !== AST_NODE_TYPES.Literal ||
          typeof skipProp.value.value !== 'boolean'
        ) {
          context.report({ node: skipProp, messageId: 'weirdSkipValue' });
          continue;
        }

        if (skipProp.value.value) {
          context.report({ node: skipProp, messageId: 'noSkip' });
        } else {
          context.report({ node: skipProp, messageId: 'noSkipFalse' });
        }
      }
    }
  },
});

/**
 * @param {TSESTree.ObjectLiteralElement[]} properties
 * @param {string} propName
 */
function findProperty(properties, propName) {
  return properties
    .filter((prop) => prop.type === AST_NODE_TYPES.Property)
    .find(({ key }) => key.type === AST_NODE_TYPES.Identifier && key.name === propName);
}
