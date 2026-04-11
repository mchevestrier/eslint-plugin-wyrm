import path from 'node:path';

import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import type {
  ParserServicesWithTypeInformation,
  TSESTree,
} from '@typescript-eslint/utils';
import * as ts from 'typescript';

import { createRule } from '../utils/createRule.js';
import { getFirstOption, None, Some } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid simplifiable logical expressions with boolean types',
      recommended: true,
      requiresTypeChecking: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noConvolutedLogicalExpression: 'This logical expression can be simplified',
    },
  },
  defaultOptions: [],
  create(context) {
    let services: ParserServicesWithTypeInformation | undefined;
    function getServices() {
      services ??= ESLintUtils.getParserServices(context);
      return services;
    }

    return {
      LogicalExpression(node) {
        if (node.operator === '&&') {
          const maybeXor = getFirstOption([
            getConvolutedXor(node, node.left, node.right),
            getConvolutedXor(node, node.right, node.left),
          ]);
          if (!maybeXor.some) return;
          const [a, b] = maybeXor.value;
          const typeA = getServices().getTypeAtLocation(a);
          if (!(typeA.flags & ts.TypeFlags.BooleanLike)) return;
          const typeB = getServices().getTypeAtLocation(b);
          if (!(typeB.flags & ts.TypeFlags.BooleanLike)) return;

          context.report({
            node,
            messageId: 'noConvolutedLogicalExpression',
            fix(fixer) {
              return fixer.replaceText(node, `${a.name} !== ${b.name}`);
            },
          });
          return;
        }

        if (node.operator === '||') {
          const maybeOr = getFirstOption([
            getConvolutedOr(node, node.left, node.right),
            getConvolutedOr(node, node.right, node.left),
          ]);

          if (!maybeOr.some) return;
          const [a, b] = maybeOr.value;
          const typeA = getServices().getTypeAtLocation(a);
          if (!(typeA.flags & ts.TypeFlags.BooleanLike)) return;
          const typeB = getServices().getTypeAtLocation(b);
          if (!(typeB.flags & ts.TypeFlags.BooleanLike)) return;

          context.report({
            node,
            messageId: 'noConvolutedLogicalExpression',
            fix(fixer) {
              return fixer.replaceText(node, `${a.name} || ${b.name}`);
            },
          });
        }
      },
    };
  },
});

function getConvolutedXor(
  expr: TSESTree.LogicalExpression,
  left: TSESTree.Expression,
  right: TSESTree.Expression,
) {
  if (expr.operator !== '&&') return None;

  const maybeOr = getOr(left);
  const maybeNand = getNand(right);
  if (!maybeOr.some) return None;
  if (!maybeNand.some) return None;
  const [maybeOrA, maybeOrB] = maybeOr.value;
  const [maybeNandA, maybeNandB] = maybeNand.value;

  if (maybeOrA.name === maybeNandA.name && maybeOrB.name === maybeNandB.name) {
    return Some([maybeOrA, maybeOrB] as const);
  }
  if (maybeOrA.name === maybeNandB.name && maybeOrB.name === maybeNandA.name) {
    return Some([maybeOrA, maybeOrB] as const);
  }
  return None;
}

function getOr(expr: TSESTree.Expression) {
  if (expr.type !== AST_NODE_TYPES.LogicalExpression) return None;
  if (expr.operator !== '||') return None;
  if (expr.left.type !== AST_NODE_TYPES.Identifier) return None;
  if (expr.right.type !== AST_NODE_TYPES.Identifier) return None;
  return Some([expr.left, expr.right] as const);
}

function getNand(expr: TSESTree.Expression) {
  if (expr.type === AST_NODE_TYPES.UnaryExpression) {
    if (expr.operator !== '!') return None;
    return getAnd(expr.argument);
  }

  if (expr.type === AST_NODE_TYPES.LogicalExpression) {
    return getFirstOption([
      getOrNot(expr, expr.left, expr.right),
      getOrNot(expr, expr.right, expr.left),
    ]);
  }

  return None;
}

function getOrNot(
  expr: TSESTree.LogicalExpression,
  left: TSESTree.Expression,
  right: TSESTree.Expression,
) {
  if (expr.operator !== '||') return None;
  const maybeNotA = getNot(left);
  const maybeNotB = getNot(right);
  if (!maybeNotA.some) return None;
  if (!maybeNotB.some) return None;

  if (maybeNotA.value.type !== AST_NODE_TYPES.Identifier) return None;
  if (maybeNotB.value.type !== AST_NODE_TYPES.Identifier) return None;

  return Some([maybeNotA.value, maybeNotB.value] as const);
}

function getAnd(expr: TSESTree.Expression) {
  if (expr.type !== AST_NODE_TYPES.LogicalExpression) return None;
  if (expr.operator !== '&&') return None;
  if (expr.left.type !== AST_NODE_TYPES.Identifier) return None;
  if (expr.right.type !== AST_NODE_TYPES.Identifier) return None;
  return Some([expr.left, expr.right] as const);
}

function getNot(expr: TSESTree.Expression) {
  if (expr.type !== AST_NODE_TYPES.UnaryExpression) return None;
  if (expr.operator !== '!') return None;
  return Some(expr.argument);
}

function getConvolutedOr(
  expr: TSESTree.LogicalExpression,
  left: TSESTree.Expression,
  right: TSESTree.Expression,
) {
  if (expr.operator !== '||') return None;

  const maybeIneq = getIneq(left);
  const maybeAnd = getAnd(right);
  if (!maybeIneq.some) return None;
  if (!maybeAnd.some) return None;
  const [maybeIneqA, maybeIneqB] = maybeIneq.value;
  const [maybeAndA, maybeAndB] = maybeAnd.value;

  if (maybeIneqA.name === maybeAndA.name && maybeIneqB.name === maybeAndB.name) {
    return Some([maybeIneqA, maybeIneqB] as const);
  }
  if (maybeIneqA.name === maybeAndB.name && maybeIneqB.name === maybeAndA.name) {
    return Some([maybeIneqA, maybeIneqB] as const);
  }
  return None;
}

function getIneq(expr: TSESTree.Expression) {
  if (expr.type !== AST_NODE_TYPES.BinaryExpression) return None;
  if (expr.operator !== '!==' && expr.operator !== '!=') return None;
  if (expr.left.type !== AST_NODE_TYPES.Identifier) return None;
  if (expr.right.type !== AST_NODE_TYPES.Identifier) return None;
  return Some([expr.left, expr.right] as const);
}
