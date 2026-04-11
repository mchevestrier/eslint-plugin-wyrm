/**
 * @fileoverview
 *
 * This will only work if the styled component is declared in the same file where it is used.
 */

import path from 'node:path';

import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ASTUtils } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow usage of `styled.button` without an explicit `type` attribute.',
      recommended: true,
    },
    schema: [],
    messages: {
      missingType: 'Missing an explicit type attribute for button',
      complexType: 'The button type attribute must be specified by a static string',
      invalidValue: '"{{value}}" is an invalid value for button type attribute',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXElement(node) {
        if (node.openingElement.name.type !== AST_NODE_TYPES.JSXIdentifier) return;
        const scope = context.sourceCode.getScope(node);
        const def = findDef(scope, node.openingElement.name.name);
        if (!def) return;
        if (def.node.type !== AST_NODE_TYPES.VariableDeclarator) return;
        const { init } = def.node;
        if (!init) return;
        if (!isStyledHtmlButton(init)) return;

        const found = node.openingElement.attributes
          .filter((attr) => attr.type === AST_NODE_TYPES.JSXAttribute)
          .find((attr) => attr.name.name === 'type');

        if (!found) {
          context.report({ node, messageId: 'missingType' });
          return;
        }

        if (
          found.value?.type !== AST_NODE_TYPES.Literal ||
          typeof found.value.value !== 'string'
        ) {
          context.report({ node, messageId: 'complexType' });
          return;
        }

        const allowed = ['button', 'submit', 'reset'];
        if (allowed.includes(found.value.value)) return;
        context.report({
          node,
          messageId: 'invalidValue',
          data: { value: found.value.value },
        });
      },
    };
  },
});

function findDef(scope: TSESLint.Scope.Scope, ident: string) {
  const variable = ASTUtils.findVariable(scope, ident);
  return variable?.defs.at(-1);
}

function isStyledHtmlButton(expr: TSESTree.Expression): boolean {
  if (expr.type !== AST_NODE_TYPES.TaggedTemplateExpression) return false;
  return isStyledHtmlElement(expr.tag, 'button');
}

function isStyledHtmlElement(expr: TSESTree.Expression, htmlTag: string): boolean {
  // styled.button
  if (expr.type === AST_NODE_TYPES.MemberExpression) {
    return (
      expr.object.type === AST_NODE_TYPES.Identifier &&
      expr.object.name === 'styled' &&
      expr.property.type === AST_NODE_TYPES.Identifier &&
      expr.property.name === htmlTag
    );
  }

  if (expr.type !== AST_NODE_TYPES.CallExpression) return false;

  // styled('button')
  const [arg] = expr.arguments;
  if (!arg) return false;
  if (arg.type !== AST_NODE_TYPES.Literal) return false;
  if (arg.value !== htmlTag) return false;
  if (expr.callee.type !== AST_NODE_TYPES.Identifier) return false;
  return expr.callee.name === 'styled';
}
