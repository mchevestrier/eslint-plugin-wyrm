import path from 'node:path';

import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import type {
  ParserServicesWithTypeInformation,
  TSESTree,
} from '@typescript-eslint/utils';
import * as ts from 'typescript';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description:
        'Prefer distributing boolean casts over nullish coalescing expressions',
      strict: true,
      requiresTypeChecking: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      booleanCoalescing:
        'Distribute boolean casts over this nullish coalescing expression',
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
        if (node.operator !== '??') return;

        const isEvaluatedToBoolean =
          isInSimpleNegation(node) ||
          isInBooleanCast(node) ||
          isInCondition(node) ||
          isReturnedFromPredicate(node);

        if (!isEvaluatedToBoolean) {
          return;
        }

        const leftType = getServices().getTypeAtLocation(node.left);
        if (!isSafeLeftType(leftType)) return;

        context.report({
          node,
          messageId: 'booleanCoalescing',
          *fix(fixer) {
            const range = [node.left.range[1], node.right.range[0]] as const;
            yield fixer.replaceTextRange(range, ' || ');

            const leftText = context.sourceCode.getText(node.left);
            yield fixer.replaceText(node.left, `!!(${leftText})`);

            const rightText = context.sourceCode.getText(node.right);
            yield fixer.replaceText(node.right, `!!(${rightText})`);
          },
        });
      },
    };
  },
});

function isSafeLeftType(type: ts.Type): boolean {
  if (type.isUnion()) {
    return type.types.every((t) => !isFalsyNotNullish(t));
  }
  return !isFalsyNotNullish(type);
}

function isPossiblyFalsy(type: ts.Type): boolean {
  return (type.flags & ts.TypeFlags.PossiblyFalsy) !== 0;
}

function isNullish(type: ts.Type): boolean {
  return (type.flags & (ts.TypeFlags.Null | ts.TypeFlags.Undefined)) !== 0;
}

function isFalsyNotNullish(type: ts.Type): boolean {
  return isPossiblyFalsy(type) && !isNullish(type);
}

function isInBooleanCast(node: TSESTree.Node): boolean {
  /* v8 ignore if -- @preserve */
  if (!node.parent) return false;

  switch (node.parent.type) {
    case AST_NODE_TYPES.LogicalExpression:
    case AST_NODE_TYPES.TSAsExpression:
    case AST_NODE_TYPES.TSNonNullExpression:
    case AST_NODE_TYPES.TSSatisfiesExpression:
      return isInBooleanCast(node.parent);

    case AST_NODE_TYPES.UnaryExpression:
      return isDoubleNegation(node.parent);

    case AST_NODE_TYPES.CallExpression:
      return isBooleanCall(node.parent);

    default:
      return false;
  }
}

function isInSimpleNegation(node: TSESTree.Node): boolean {
  if (!node.parent) return false;
  if (node.parent.type !== AST_NODE_TYPES.UnaryExpression) return false;
  if (node.parent.operator !== '!') return false;
  return true;
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

function isInCondition(node: TSESTree.Node): boolean {
  /* v8 ignore if -- @preserve */
  if (!node.parent) return false;

  switch (node.parent.type) {
    case AST_NODE_TYPES.LogicalExpression:
    case AST_NODE_TYPES.TSAsExpression:
    case AST_NODE_TYPES.TSNonNullExpression:
    case AST_NODE_TYPES.TSSatisfiesExpression:
      return isInCondition(node.parent);

    case AST_NODE_TYPES.IfStatement:
    case AST_NODE_TYPES.ConditionalExpression:
    case AST_NODE_TYPES.DoWhileStatement:
    case AST_NODE_TYPES.WhileStatement:
      return node === node.parent.test;

    default:
      return false;
  }
}

function isPredicate(
  fn: TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression,
): boolean {
  if (fn.parent.type !== AST_NODE_TYPES.CallExpression) return false;
  if (fn.parent.arguments[0] !== fn) return false;
  if (fn.parent.callee.type !== AST_NODE_TYPES.MemberExpression) return false;
  if (fn.parent.callee.property.type !== AST_NODE_TYPES.Identifier) return false;

  const arrayMethods = [
    'every',
    'some',
    'filter',
    'find',
    'findIndex',
    'findLast',
    'findLastIndex',
  ];
  if (!arrayMethods.includes(fn.parent.callee.property.name)) return false;
  return true;
}

function isReturnedFromPredicate(node: TSESTree.Node): boolean {
  /* v8 ignore if -- @preserve */
  if (!node.parent) return false;

  switch (node.parent.type) {
    case AST_NODE_TYPES.LogicalExpression:
    case AST_NODE_TYPES.TSAsExpression:
    case AST_NODE_TYPES.TSNonNullExpression:
    case AST_NODE_TYPES.TSSatisfiesExpression:
    case AST_NODE_TYPES.ReturnStatement:
      return isReturnedFromPredicate(node.parent);

    case AST_NODE_TYPES.BlockStatement:
      if (
        node.parent.parent.type === AST_NODE_TYPES.FunctionExpression ||
        node.parent.parent.type === AST_NODE_TYPES.ArrowFunctionExpression
      ) {
        return isPredicate(node.parent.parent);
      }
      return false;

    case AST_NODE_TYPES.ArrowFunctionExpression:
      return isPredicate(node.parent);

    case AST_NODE_TYPES.IfStatement:
    case AST_NODE_TYPES.ConditionalExpression:
      if (node === node.parent.test) return false;
      return isReturnedFromPredicate(node.parent);

    default:
      return false;
  }
}
