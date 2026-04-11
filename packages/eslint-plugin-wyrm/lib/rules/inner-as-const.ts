import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';
import { None, Some } from '../utils/option.js';
import type { Option } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce setting `as const` on the outermost object/array literal only',
      strict: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noInnerAsConstObject: 'Only set `as const` on the outermost object',
      noInnerAsConstArray: 'Only set `as const` on the outermost array',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ArrayExpression(node) {
        for (const elt of node.elements) {
          if (!elt) continue;
          const maybeExpr = getAsConstExpr(elt);
          if (!maybeExpr.some) continue;
          const expr = maybeExpr.value;

          context.report({
            node: elt,
            messageId: 'noInnerAsConstArray',
            *fix(fixer) {
              yield fixer.replaceText(elt, context.sourceCode.getText(expr));
              if (getAsConstExpr(node.parent).some) return;
              yield fixer.insertTextAfter(node, ' as const');
            },
          });
        }
      },
      ObjectExpression(node) {
        for (const prop of node.properties) {
          if (prop.type === AST_NODE_TYPES.SpreadElement) continue;
          const maybeExpr = getAsConstExpr(prop.value);
          if (!maybeExpr.some) continue;
          const expr = maybeExpr.value;

          context.report({
            node: prop,
            messageId: 'noInnerAsConstObject',
            *fix(fixer) {
              yield fixer.replaceText(prop.value, context.sourceCode.getText(expr));
              if (getAsConstExpr(node.parent).some) return;
              yield fixer.insertTextAfter(node, ' as const');
            },
          });
        }
      },
    };
  },
});

function getAsConstExpr(node: TSESTree.Node): Option<TSESTree.Expression> {
  if (node.type !== AST_NODE_TYPES.TSAsExpression) return None;
  if (node.typeAnnotation.type !== AST_NODE_TYPES.TSTypeReference) return None;
  if (node.typeAnnotation.typeName.type !== AST_NODE_TYPES.Identifier) return None;
  if (node.typeAnnotation.typeName.name !== 'const') return None;
  return Some(node.expression);
}
