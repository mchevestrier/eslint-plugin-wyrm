import path from 'node:path';

import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid comparing a length to a floating point number',
      recommended: true,
    },
    schema: [],
    messages: {
      noFloatLengthCheck:
        'You are comparing a length or a size to a floating point number. Make sure this is expected.',
    },
  },
  defaultOptions: [],
  create(context) {
    function checkBinaryExpression(
      node: TSESTree.BinaryExpression,
      left: TSESTree.Expression,
      right: TSESTree.Expression,
    ) {
      if (left.type !== AST_NODE_TYPES.MemberExpression) return;
      if (left.property.type !== AST_NODE_TYPES.Identifier) return;
      if (left.property.name !== 'length' && left.property.name !== 'size') return;

      if (right.type !== AST_NODE_TYPES.Literal) return;
      if (typeof right.value !== 'number') return;
      if (!right.raw.includes('.')) return;

      context.report({ node, messageId: 'noFloatLengthCheck' });
    }

    return {
      BinaryExpression(node) {
        if (
          node.operator !== '==' &&
          node.operator !== '===' &&
          node.operator !== '!=' &&
          node.operator !== '!==' &&
          node.operator !== '>' &&
          node.operator !== '>=' &&
          node.operator !== '<' &&
          node.operator !== '<='
        ) {
          return;
        }

        checkBinaryExpression(node, node.left, node.right);
        checkBinaryExpression(node, node.right, node.left);
      },
    };
  },
});
