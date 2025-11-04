import path from 'node:path';

import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';
import { None, Some, type Option } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce that boolean casts are distributed over logical expressions',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      distributeBooleanCast: 'Distribute this boolean cast over logical expressions',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      LogicalExpression(node) {
        if (node.operator === '??') return;

        const parentCast = getParentBooleanCast(node);
        if (!parentCast.some) return;

        context.report({
          node,
          messageId: 'distributeBooleanCast',

          fix(fixer) {
            const left = maybeWrapInBooleanCast(node.left);
            const right = maybeWrapInBooleanCast(node.right);

            const newText = `${left} ${node.operator} ${right}`;
            return fixer.replaceText(parentCast.value, newText);
          },
        });
      },
    };

    function maybeWrapInBooleanCast(expr: TSESTree.Expression): string {
      const txt = context.sourceCode.getText(expr);
      if (isBooleanLike(expr)) return txt;
      return `!!(${txt})`;
    }
  },
});

function isBooleanLike(expr: TSESTree.Expression): boolean {
  if (expr.type === AST_NODE_TYPES.UnaryExpression) {
    return expr.operator === '!';
  }

  if (expr.type === AST_NODE_TYPES.BinaryExpression) {
    switch (expr.operator) {
      case '&&':
      case '||':
      case '!=':
      case '!==':
      case '==':
      case '===':
      case '<':
      case '<=':
      case '>':
      case '>=':
      case 'in':
      case 'instanceof':
        return true;

      default:
        return false;
    }
  }

  if (expr.type === AST_NODE_TYPES.Literal) {
    return typeof expr.value === 'boolean';
  }

  return false;
}

function getParentBooleanCast(node: TSESTree.Node): Option<TSESTree.Node> {
  if (!node.parent) return None;

  if (
    node.parent.type === AST_NODE_TYPES.UnaryExpression &&
    isDoubleNegation(node.parent)
  ) {
    return Some(node.parent.parent);
  }

  if (node.parent.type === AST_NODE_TYPES.CallExpression && isBooleanCall(node.parent)) {
    return Some(node.parent);
  }

  return None;
}

function isDoubleNegation(node: TSESTree.UnaryExpression): boolean {
  if (node.operator !== '!') return false;
  if (node.parent.type !== AST_NODE_TYPES.UnaryExpression) return false;
  if (node.parent.operator !== '!') return false;
  return true;
}

function isBooleanCall(node: TSESTree.CallExpression): boolean {
  if (node.callee.type !== AST_NODE_TYPES.Identifier) return false;
  if (node.callee.name !== 'Boolean') return false;
  return true;
}
