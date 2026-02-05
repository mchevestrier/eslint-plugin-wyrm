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
      description:
        'Enforce using `meta.docs.requiresTypeChecking` only if the rule actually requires type checking.',
    },
    schema: [],
    messages: {
      excessRequiresTypeChecking:
        'This rule has a `meta.docs.requiresTypeChecking` property, but type checking is likely not required.',
      missingRequiresTypeChecking:
        'This rule requires type checking, but has no `meta.docs.requiresTypeChecking` property.',
    },
  },
  create(context) {
    /** @type {TSESTree.Property | undefined} */
    let requiresTypeCheckingProperty = undefined;
    let usesTypeChecking = false;

    return {
      Property(node) {
        if (node.key.type !== AST_NODE_TYPES.Identifier) return;
        if (node.key.name !== 'requiresTypeChecking') return;

        requiresTypeCheckingProperty = node;
      },
      CallExpression(node) {
        if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return;

        if (node.callee.object.type !== AST_NODE_TYPES.Identifier) return;
        if (node.callee.property.type !== AST_NODE_TYPES.Identifier) return;

        if (node.callee.object.name !== 'ESLintUtils') return;
        if (node.callee.property.name !== 'getParserServices') return;

        usesTypeChecking = true;
      },
      'Program:exit'(node) {
        if (!requiresTypeCheckingProperty && usesTypeChecking) {
          context.report({ node, messageId: 'missingRequiresTypeChecking' });
        }

        if (requiresTypeCheckingProperty && !usesTypeChecking) {
          context.report({
            node: requiresTypeCheckingProperty,
            messageId: 'excessRequiresTypeChecking',
          });
        }
      },
    };
  },
});
