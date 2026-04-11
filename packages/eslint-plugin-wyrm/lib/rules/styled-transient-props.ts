import path from 'node:path';

import isPropValid from '@emotion/is-prop-valid';
import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce using transient props in styled components to avoid polluting DOM elements with unknown props',
      recommended: true,
    },
    schema: [],
    messages: {
      useTransientProps:
        'Prefix this prop with `$` to avoid polluting the underlying DOM element.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      TaggedTemplateExpression(node) {
        if (!isStyledHtmlElement(node.tag)) return;

        if (!node.typeArguments) return;
        const [props] = node.typeArguments.params;
        if (!props) return;
        if (props.type !== AST_NODE_TYPES.TSTypeLiteral) return;

        for (const member of props.members) {
          checkMember(member);
        }
      },
    };

    function checkMember(member: TSESTree.TypeElement) {
      if (member.type !== AST_NODE_TYPES.TSPropertySignature) return;
      if (member.key.type !== AST_NODE_TYPES.Identifier) return;

      const propName = member.key.name;
      // Is it a transient prop?
      if (propName.startsWith('$')) return;
      // Is it a valid prop?
      if (isPropValid(propName)) return;

      context.report({ node: member.key, messageId: 'useTransientProps' });
    }
  },
});

function isStyledHtmlElement(expr: TSESTree.Expression): boolean {
  // styled.div
  if (expr.type === AST_NODE_TYPES.MemberExpression) {
    return (
      expr.object.type === AST_NODE_TYPES.Identifier && expr.object.name === 'styled'
    );
  }

  if (expr.type !== AST_NODE_TYPES.CallExpression) return false;

  // styled('div')
  const [arg] = expr.arguments;
  if (!arg) return false;
  if (arg.type !== AST_NODE_TYPES.Literal) return false;
  if (typeof arg.value !== 'string') return false;
  if (expr.callee.type !== AST_NODE_TYPES.Identifier) return false;
  return expr.callee.name === 'styled';
}
