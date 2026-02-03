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
      description: 'Forbid different test cases with the same code',
    },
    schema: [],
    messages: {
      duplicateCode: 'The code in this test case is the same as in a previous case.',
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

      const codes = new Set();

      for (const testCase of prop.value.elements) {
        if (testCase?.type !== AST_NODE_TYPES.ObjectExpression) {
          console.error('Test case was not an object literal');
          continue;
        }

        const codeProp = findProperty(testCase.properties, 'code');

        if (codeProp === undefined) {
          console.error('Found a test case with no code property');
          continue;
        }

        if (codeProp.value.type !== AST_NODE_TYPES.TemplateLiteral) {
          console.error('Code property is not a template literal');
          continue;
        }

        const [quasi] = codeProp.value.quasis;
        if (!quasi || codeProp.value.quasis.length !== 1) {
          console.error('Code property does not have a single quasi');
          continue;
        }

        const codeTxt = quasi.value.cooked;

        const filenameProp = findProperty(testCase.properties, 'filename');
        const filenameTxt = getFilenameFromProp(filenameProp) ?? '';

        const optionsProp = findProperty(testCase.properties, 'options');
        const optionsTxt = context.sourceCode.getText(optionsProp?.value);

        const key = `${filenameTxt} ${optionsTxt} ${codeTxt}`;

        if (codes.has(key)) {
          context.report({ node: quasi, messageId: 'duplicateCode' });
          continue;
        }

        codes.add(key);
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

/**
 * @param {TSESTree.Property | undefined} prop
 */
function getFilenameFromProp(prop) {
  if (prop === undefined) return null;
  if (prop.value.type !== AST_NODE_TYPES.Literal) return null;
  if (typeof prop.value.value !== 'string') return null;
  return prop.value.value;
}
