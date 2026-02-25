import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';
import { getFirstOption, None, Some } from '../utils/option.js';
import type { Option } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce using `Map#has` and `Set#has`',
      strict: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferHas: 'Use `.has()` instead',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      BinaryExpression(node) {
        const maybeExpr = extractFromNotUndefinedCheck(node);
        if (!maybeExpr.some) return;
        const expr = maybeExpr.value;

        if (expr.type !== AST_NODE_TYPES.CallExpression) return;
        if (expr.callee.type !== AST_NODE_TYPES.MemberExpression) return;
        if (expr.callee.property.type !== AST_NODE_TYPES.Identifier) return;
        if (expr.callee.property.name !== 'get') return;

        context.report({
          node,
          messageId: 'preferHas',
          *fix(fixer) {
            yield fixer.replaceText(
              node,
              context.sourceCode
                .getText(expr)
                // Not sure if there is a cleaner way to do this without overlapping fixes
                .replace('.get(', '.has('),
            );
          },
        });
      },
    };
  },
});

function extractFromNotUndefinedCheck(
  node: TSESTree.BinaryExpression,
): Option<TSESTree.Expression> {
  if (node.left.type === AST_NODE_TYPES.PrivateIdentifier) return None;
  if (!isInequalityOperator(node.operator)) return None;

  return getFirstOption([
    extractTypeofUndefined(node.left, node.right),
    extractTypeofUndefined(node.right, node.left),

    extractNotUndefined(node.left, node.right),
    extractNotUndefined(node.right, node.left),
  ]);
}

function extractTypeofUndefined(
  left: TSESTree.Expression,
  right: TSESTree.Expression,
): Option<TSESTree.Expression> {
  if (right.type !== AST_NODE_TYPES.Literal) return None;
  if (right.value !== 'undefined') return None;

  if (left.type !== AST_NODE_TYPES.UnaryExpression) return None;
  if (left.operator !== 'typeof') return None;

  return Some(left.argument);
}

function extractNotUndefined(
  left: TSESTree.Expression,
  right: TSESTree.Expression,
): Option<TSESTree.Expression> {
  if (right.type !== AST_NODE_TYPES.Identifier) return None;
  if (right.name !== 'undefined') return None;

  return Some(left);
}

function isInequalityOperator(
  operator: TSESTree.BinaryExpression['operator'],
): operator is '!=' | '!==' {
  switch (operator) {
    case '!=':
    case '!==':
      return true;

    default:
      return false;
  }
}
