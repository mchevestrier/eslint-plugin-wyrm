import path from 'node:path';

import type {
  ParserServicesWithTypeInformation,
  TSESTree,
} from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';
import { None, Option, Some } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid inferable type predicates',
      strict: true,
      requiresTypeChecking: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noInferableTypePredicate:
        'Since TypeScript 5.5, this type predicate can be automatically inferred. You should remove it.',
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
      FunctionDeclaration: checkFunction,
      FunctionExpression: checkFunction,
      ArrowFunctionExpression: checkFunction,
    };

    type FunctionNode =
      | TSESTree.FunctionDeclaration
      | TSESTree.FunctionExpression
      | TSESTree.ArrowFunctionExpression;

    function checkFunction(fn: FunctionNode) {
      const { returnType } = fn;
      if (!returnType) return;
      if (returnType.typeAnnotation.type !== AST_NODE_TYPES.TSTypePredicate) {
        return;
      }

      const [param] = fn.params;
      if (!param) return;
      if (param.type !== AST_NODE_TYPES.Identifier) return;

      const maybeReturnValue = getReturnValue(fn.body);
      if (!maybeReturnValue.some) return;
      const returnValue = maybeReturnValue.value;

      if (
        !isInferableEquality(returnValue, param) &&
        !isInferableInequality(returnValue, param)
      ) {
        return;
      }

      context.report({
        node: fn,
        messageId: 'noInferableTypePredicate',
        fix(fixer) {
          return fixer.remove(returnType);
        },
      });
    }

    function isInferableInequality(
      expr: TSESTree.Expression,
      param: TSESTree.Identifier,
    ) {
      if (expr.type !== AST_NODE_TYPES.BinaryExpression) return false;
      if (expr.operator !== '!==' && expr.operator !== '!=') return false;

      const paramType = getServices().getTypeAtLocation(param);
      if (!paramType.isUnion()) return false;

      return (
        isLiteralInequality(expr.left, expr.right, param) ||
        isLiteralInequality(expr.right, expr.left, param)
      );
    }
  },
});

function isInferableEquality(
  expr: TSESTree.Expression,
  param: TSESTree.Identifier,
): boolean {
  if (expr.type !== AST_NODE_TYPES.BinaryExpression) return false;
  if (expr.operator !== '===') return false;

  return (
    isTypeOfCheck(expr.left, expr.right, param) ||
    isTypeOfCheck(expr.right, expr.left, param) ||
    isLiteralEquality(expr.left, expr.right, param) ||
    isLiteralEquality(expr.right, expr.left, param)
  );
}

function isTypeOfCheck(
  left: TSESTree.Expression,
  right: TSESTree.Expression,
  ident: TSESTree.Identifier,
): boolean {
  if (left.type !== AST_NODE_TYPES.UnaryExpression) return false;
  if (left.operator !== 'typeof') return false;
  if (left.argument.type !== AST_NODE_TYPES.Identifier) return false;
  if (left.argument.name !== ident.name) return false;

  if (right.type !== AST_NODE_TYPES.Literal) return false;
  if (typeof right.value !== 'string') return false;

  return true;
}

function isLiteralInequality(
  left: TSESTree.Expression,
  right: TSESTree.Expression,
  ident: TSESTree.Identifier,
): boolean {
  if (left.type !== AST_NODE_TYPES.Identifier) return false;
  if (left.name !== ident.name) return false;

  switch (right.type) {
    case AST_NODE_TYPES.Literal:
      return right.value === null;
    case AST_NODE_TYPES.Identifier:
      return right.name === 'undefined';

    default:
      return false;
  }
}

function isLiteralEquality(
  left: TSESTree.Expression,
  right: TSESTree.Expression,
  ident: TSESTree.Identifier,
): boolean {
  if (left.type !== AST_NODE_TYPES.Identifier) return false;
  if (left.name !== ident.name) return false;

  switch (right.type) {
    case AST_NODE_TYPES.Literal:
      return true;
    case AST_NODE_TYPES.Identifier:
      return right.name === 'undefined';

    default:
      return false;
  }
}

function getReturnValue(body: TSESTree.BlockStatement | TSESTree.Expression) {
  if (body.type !== AST_NODE_TYPES.BlockStatement) {
    return Some(body);
  }

  if (body.body.length !== 1) return None;

  const returnStatement = body.body.find(
    (stmt) => stmt.type === AST_NODE_TYPES.ReturnStatement,
  );

  if (!returnStatement) return None;
  if (!returnStatement.argument) return None;

  return Option.fromUndef(returnStatement.argument);
}
