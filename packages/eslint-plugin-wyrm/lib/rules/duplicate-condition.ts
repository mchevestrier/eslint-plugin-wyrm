import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';
import type { RuleContext } from '@typescript-eslint/utils/ts-eslint';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid duplicate conditions',
      recommended: true,
    },
    schema: [],
    messages: {
      duplicateCondition:
        'This condition is already checked before. It is probably impossible.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      IfStatement(node) {
        if (
          node.parent.type !== AST_NODE_TYPES.BlockStatement &&
          node.parent.type !== AST_NODE_TYPES.Program
        ) {
          return;
        }

        const index = node.parent.body.indexOf(node);
        if (index <= 0) return;
        const previousSibling = node.parent.body.at(index - 1);
        if (!previousSibling) return;
        if (previousSibling.type !== AST_NODE_TYPES.IfStatement) return;

        if (!hasExitStatement(previousSibling.consequent)) return;

        if (areConditionsEquivalent(previousSibling.test, node.test, context)) {
          context.report({
            messageId: 'duplicateCondition',
            node,
          });
        }
      },
    };
  },
});

type Context = Readonly<RuleContext<string, unknown[]>>;

function areConditionsEquivalent(
  test1: TSESTree.Expression,
  test2: TSESTree.Expression,
  context: Context,
): boolean {
  const txt1 = context.sourceCode.getText(test1);
  const txt2 = context.sourceCode.getText(test2);
  if (txt1 === txt2) return true;

  const normalizedTxt1 = printNormalizedExpression(test1, context);
  const normalizedTxt2 = printNormalizedExpression(test2, context);
  if (normalizedTxt1 === normalizedTxt2) return true;

  return false;
}

function printNormalizedExpression(node: TSESTree.Expression, context: Context): string {
  return printExpression(normalizeExpression(node, context), context);
}

function normalizeExpression(
  node: TSESTree.Expression,
  context: Context,
): TSESTree.Expression {
  switch (node.type) {
    case AST_NODE_TYPES.BinaryExpression:
      return normalizeBinaryExpression(node, context);

    case AST_NODE_TYPES.LogicalExpression:
      return normalizeLogicalExpression(node, context);

    default:
      return node;
  }
}

function printExpression(
  node: TSESTree.PrivateIdentifier | TSESTree.Expression,
  context: Context,
): string {
  switch (node.type) {
    case AST_NODE_TYPES.BinaryExpression:
    case AST_NODE_TYPES.LogicalExpression: {
      const { left, right, operator } = node;
      return `${printExpression(left, context)} ${operator} ${printExpression(right, context)}`;
    }

    default:
      return context.sourceCode.getText(node);
  }
}

function normalizeBinaryExpression(
  node: TSESTree.BinaryExpression,
  context: Context,
): TSESTree.BinaryExpression {
  if (node.left.type === AST_NODE_TYPES.PrivateIdentifier) return node;

  type Op = TSESTree.BinaryExpression['operator'];

  const flipped = {
    '>': '<',
    '<': '>',
    '>=': '<=',
    '<=': '>=',

    '*': '*',
    '+': '+',
    '!==': '!==',
    '!=': '!=',
    '===': '===',
    '==': '==',
  } satisfies Partial<Record<Op, Op>>;

  function isFlippableOp(op: Op): op is keyof typeof flipped {
    return op in flipped;
  }

  const { operator, left, right } = node;

  if (isFlippableOp(operator) && shouldFlip(node, context)) {
    return {
      ...node,
      operator: flipped[operator],
      left: normalizeExpression(right, context),
      right: normalizeExpression(left, context),
    };
  }

  return {
    ...node,
    operator,
    left: normalizeExpression(left, context),
    right: normalizeExpression(right, context),
  };
}

function normalizeLogicalExpression(
  node: TSESTree.LogicalExpression,
  context: Context,
): TSESTree.LogicalExpression {
  type Op = TSESTree.LogicalExpression['operator'];

  const flipped = {
    '||': '||',
    '&&': '&&',
  } satisfies Partial<Record<Op, Op>>;

  function isFlippableOp(op: Op): op is keyof typeof flipped {
    return op in flipped;
  }

  const { operator, left, right } = node;

  if (isFlippableOp(operator) && shouldFlip(node, context)) {
    return {
      ...node,
      operator: flipped[operator],
      left: normalizeExpression(right, context),
      right: normalizeExpression(left, context),
    };
  }

  return {
    ...node,
    operator,
    left: normalizeExpression(left, context),
    right: normalizeExpression(right, context),
  };
}

function shouldFlip(
  expr: TSESTree.LogicalExpression | TSESTree.BinaryExpression,
  context: Context,
) {
  const { left, right } = expr;

  function rank(node: TSESTree.Node) {
    switch (node.type) {
      case AST_NODE_TYPES.Identifier:
        return 0;

      case AST_NODE_TYPES.MemberExpression:
        return 1;

      case AST_NODE_TYPES.CallExpression:
        return 2;

      case AST_NODE_TYPES.BinaryExpression:
      case AST_NODE_TYPES.LogicalExpression:
        return 3;

      case AST_NODE_TYPES.UnaryExpression:
        return 4;

      case AST_NODE_TYPES.Literal:
        return 5;

      default:
        return 6;
    }
  }

  const rLeft = rank(left);
  const rRight = rank(right);

  if (rLeft !== rRight) {
    return rLeft > rRight; // higher rank goes right
  }

  // same rank → deterministic tie-breaker
  function key(node: TSESTree.Node): string {
    switch (node.type) {
      case AST_NODE_TYPES.Identifier:
        return node.name;

      case AST_NODE_TYPES.Literal:
        return JSON.stringify(node.value);

      case AST_NODE_TYPES.MemberExpression:
        return `${key(node.object)}.${key(node.property)}`;

      case AST_NODE_TYPES.UnaryExpression:
        return `${node.operator}${key(node.argument)}`;

      case AST_NODE_TYPES.BinaryExpression:
      case AST_NODE_TYPES.LogicalExpression:
        return `(${key(node.left)} ${node.operator} ${key(node.right)})`;

      case AST_NODE_TYPES.CallExpression:
        return `${key(node.callee)}()`;

      default:
        return context.sourceCode.getText(node);
    }
  }

  const l = key(left);
  const r = key(right);

  return l > r; // lexicographic tie-break
}

function hasExitStatement(stmt: TSESTree.Statement): boolean {
  if (stmt.type === AST_NODE_TYPES.BlockStatement) {
    return stmt.body.some((s) => hasExitStatement(s));
  }

  switch (stmt.type) {
    case AST_NODE_TYPES.BreakStatement:
    case AST_NODE_TYPES.ContinueStatement:
    case AST_NODE_TYPES.ReturnStatement:
    case AST_NODE_TYPES.ThrowStatement:
      return true;

    default:
      return false;
  }
}
