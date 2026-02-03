import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid adding `meta.fixable` if the rule is actually never fixable.',
    },
    schema: [],
    messages: {
      excessMetaFixable:
        'This rule has a `meta.fixable` property, but no fix is ever applied.',
    },
  },
  create(context) {
    let hasMetaFixable = false;
    let hasFixMethod = false;

    return {
      Property(node) {
        if (node.key.type !== AST_NODE_TYPES.Identifier) return;
        if (node.key.name !== 'fixable') return;

        hasMetaFixable = true;
      },
      CallExpression(node) {
        if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return;

        if (node.callee.object.type !== AST_NODE_TYPES.Identifier) return;
        if (node.callee.property.type !== AST_NODE_TYPES.Identifier) return;

        if (node.callee.object.name !== 'context') return;
        if (node.callee.property.name !== 'report') return;

        const [arg] = node.arguments;
        if (!arg) return;
        if (arg.type !== AST_NODE_TYPES.ObjectExpression) return;

        const props = arg.properties.filter(
          (prop) => prop.type === AST_NODE_TYPES.Property,
        );
        if (
          props.some(
            (prop) =>
              prop.key.type === AST_NODE_TYPES.Identifier && prop.key.name === 'fix',
          )
        ) {
          hasFixMethod = true;
        }
      },
      'Program:exit'(node) {
        if (!hasMetaFixable || hasFixMethod) return;
        context.report({ node, messageId: 'excessMetaFixable' });
      },
    };
  },
});
