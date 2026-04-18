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
      description: 'Forbid nested `reduce` calls',
      strict: true,
    },
    schema: [],
    messages: {
      noNestedReduce: 'Refactor to avoid nesting `reduce` calls.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        if (!isReduceCall(node)) return;
        if (!isInsideReduceCall(node)) return;
        context.report({ node: node.callee, messageId: 'noNestedReduce' });
      },
    };
  },
});

function isReduceCall(expr: TSESTree.CallExpression): boolean {
  if (expr.callee.type !== AST_NODE_TYPES.MemberExpression) return false;
  if (expr.callee.property.type !== AST_NODE_TYPES.Identifier) return false;
  return expr.callee.property.name === 'reduce';
}

function isInsideReduceCall(node: TSESTree.Node): boolean {
  if (!node.parent) return false;
  switch (node.parent.type) {
    case AST_NODE_TYPES.FunctionDeclaration:
      return false;

    case AST_NODE_TYPES.CallExpression:
      if (isReduceCall(node.parent)) {
        return true;
      }
      break;

    default:
      break;
  }

  return isInsideReduceCall(node.parent);
}
