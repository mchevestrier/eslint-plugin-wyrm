import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { RuleContext } from '@typescript-eslint/utils/ts-eslint';

export function negateExpression(
  expr: TSESTree.Expression,
  context: Readonly<RuleContext<string, unknown[]>>,
): string {
  if (expr.type === AST_NODE_TYPES.UnaryExpression && expr.operator === '!') {
    return context.sourceCode.getText(expr.argument);
  }

  if (
    expr.type === AST_NODE_TYPES.BinaryExpression &&
    isNegatableOperator(expr.operator)
  ) {
    return `${context.sourceCode.getText(expr.left)} ${negatedBinaryOperator[expr.operator]} ${context.sourceCode.getText(expr.right)}`;
  }

  if (expr.type === AST_NODE_TYPES.LogicalExpression && expr.operator !== '??') {
    return `${negateExpression(expr.left, context)} ${negatedLogicalOperator[expr.operator]} ${negateExpression(expr.right, context)}`;
  }

  const testText = context.sourceCode.getText(expr);
  return `!(${testText})`;
}

type ValueOf<T> = T[keyof T];

export function isNegatableOperator(
  op: ValueOf<TSESTree.BinaryOperatorToText>,
): op is keyof typeof negatedBinaryOperator {
  return op in negatedBinaryOperator;
}

const negatedBinaryOperator = {
  '===': '!==',
  '==': '!=',
  '!==': '===',
  '!=': '==',
  '>=': '<',
  '>': '<=',
  '<=': '>',
  '<': '>=',
};

const negatedLogicalOperator = {
  '&&': '||',
  '||': '&&',
};
