import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid some empty JSX attributes',
      strict: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          attributes: {
            description: `Names of attributes to check. Default: \`${JSON.stringify(getDefaultAttributes())}\``,
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    ],
    messages: {
      noEmptyAttribute:
        'This attribute is empty which means it probably has no effect. See if you can remove it',
    },
  },
  defaultOptions: [{ attributes: getDefaultAttributes() }],
  create(context, [options]) {
    return {
      JSXAttribute(node) {
        if (node.parent.name.type !== AST_NODE_TYPES.JSXIdentifier) return;
        if (node.parent.name.name !== node.parent.name.name.toLowerCase()) return;

        if (!isEmptyStringAttribute(node)) return;
        if (typeof node.name.name !== 'string') return;

        if (!options.attributes.includes(node.name.name)) return;

        context.report({
          node,
          messageId: 'noEmptyAttribute',
        });
      },
    };
  },
});

function isEmptyStringAttribute(node: TSESTree.JSXAttribute): boolean {
  if (!node.value) return false;

  if (node.value.type === AST_NODE_TYPES.Literal && node.value.value === '') return true;

  if (node.value.type === AST_NODE_TYPES.JSXExpressionContainer) {
    return (
      node.value.expression.type === AST_NODE_TYPES.Literal &&
      node.value.expression.value === ''
    );
  }
  return false;
}

function getDefaultAttributes(): string[] {
  return [
    'action',
    'autocomplete',
    'className',
    'colspan',
    'decoding',
    'height',
    'id',
    'href',
    'loading',
    'max',
    'maxlength',
    'min',
    'method',
    'placeholder',
    'poster',
    'rel',
    'rowspan',
    'size',
    'src',
    'start',
    'tabindex',
    'target',
    'title',
    'type',
    'width',
  ];
}
