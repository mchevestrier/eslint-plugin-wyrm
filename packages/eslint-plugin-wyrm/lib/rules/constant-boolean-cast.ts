/**
 * @fileoverview
 *
 * This rule only makes sense if you have `strictNullChecks` enabled in your `tsconfig.json` (this is the default for `strict: true`).
 */

import path from 'node:path';

import type {
  ParserServicesWithTypeInformation,
  TSESTree,
} from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import ts from 'typescript';

import { createRule } from '../utils/createRule.js';
import { None, Option, Some } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid boolean casts on values with constant truthiness',
      recommended: true,
      requiresTypeChecking: true,
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      alwaysFalsy: 'This value will always be false',
      alwaysTruthy: 'This value will always be true',
      truthyPredicate: 'This always returns a truthy value',
      falsyPredicate: 'This always returns a falsy value',
      useFalse: 'Replace by `false`',
      useTrue: 'Replace by `true`',
    },
  },
  defaultOptions: [],
  create(context) {
    let services: ParserServicesWithTypeInformation | undefined;
    function getServices() {
      services ??= ESLintUtils.getParserServices(context);
      return services;
    }

    let checker: ts.TypeChecker | undefined;
    function getChecker() {
      checker ??= getServices().program.getTypeChecker();
      return checker;
    }

    return {
      UnaryExpression(node) {
        if (isDoubleNegation(node)) {
          checkConstantTruthiness(node.parent, node.argument);
          return;
        }

        if (node.operator !== '!') return;
        if (
          node.argument.type === AST_NODE_TYPES.UnaryExpression &&
          node.argument.operator === '!'
        ) {
          return;
        }

        checkConstantTruthiness(node, node.argument, true);
      },

      CallExpression(node) {
        if (!isBooleanCall(node)) return;

        const [arg] = node.arguments;
        if (!arg) return;

        checkConstantTruthiness(node, arg);
      },

      ArrowFunctionExpression: checkFunctionExpression,
      FunctionExpression: checkFunctionExpression,
    };

    function checkFunctionExpression(
      fn: TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression,
    ) {
      if (!isPredicate(fn)) return;

      const maybeReturnValue = getReturnValue(fn.body);
      if (!maybeReturnValue.some) {
        const stmts = getAllReturnStatements(fn.body);
        if (!stmts.length) return;
        const returnValues = stmts.map((stmt) => stmt.argument);

        const onlyReturnsTruthy = returnValues.every((val) => {
          if (!val) return false;
          const type = getServices().getTypeAtLocation(val);
          return isTypeAlwaysTruthy(type);
        });

        if (onlyReturnsTruthy) {
          context.report({ node: fn, messageId: 'truthyPredicate' });
          return;
        }

        const onlyReturnsFalsy = returnValues.every((val) => {
          if (!val) return true;
          const type = getServices().getTypeAtLocation(val);
          return isTypeAlwaysFalsy(type);
        });

        if (onlyReturnsFalsy) {
          context.report({ node: fn, messageId: 'falsyPredicate' });
        }

        return;
      }

      const returnValue = maybeReturnValue.value;
      if (isSimpleNegation(returnValue)) return;

      checkConstantTruthiness(returnValue, returnValue);
    }

    function checkConstantTruthiness(
      node: TSESTree.Node,
      value: TSESTree.Node,
      negated = false,
    ) {
      const type = getServices().getTypeAtLocation(value);

      const alwaysFalsy = isTypeAlwaysFalsy(type);
      const alwaysTruthy = isTypeAlwaysTruthy(type);

      const nodeText = context.sourceCode.getText(node);

      if ((alwaysFalsy && !negated) || (alwaysTruthy && negated)) {
        context.report({
          node,
          messageId: 'alwaysFalsy',
          suggest:
            nodeText === 'false'
              ? []
              : [
                  {
                    messageId: 'useFalse',
                    fix(fixer) {
                      return fixer.replaceText(node, 'false');
                    },
                  },
                ],
        });
      }

      if ((alwaysTruthy && !negated) || (alwaysFalsy && negated)) {
        context.report({
          node,
          messageId: 'alwaysTruthy',
          suggest:
            nodeText === 'true'
              ? []
              : [
                  {
                    messageId: 'useTrue',
                    fix(fixer) {
                      return fixer.replaceText(node, 'true');
                    },
                  },
                ],
        });
      }
    }

    function isTypeAlwaysFalsy(type: ts.Type): boolean {
      if (type.isUnionOrIntersection()) {
        return type.types.every((t) => isTypeAlwaysFalsy(t));
      }

      const flags = ts.TypeFlags.Undefined | ts.TypeFlags.Null | ts.TypeFlags.Void;
      if ((type.getFlags() & flags) !== 0) return true;

      if (type.isStringLiteral() || type.isNumberLiteral()) {
        return !type.value;
      }

      // bigint
      if (type.isLiteral() && typeof type.value === 'object') {
        return type.value.base10Value === '0';
      }

      if (type.getFlags() & ts.TypeFlags.BooleanLiteral) {
        return type !== getChecker().getTrueType();
      }

      return false;
    }

    function isTypeAlwaysTruthy(type: ts.Type): boolean {
      if (type.isUnionOrIntersection()) {
        return type.types.every((t) => isTypeAlwaysTruthy(t));
      }

      const flags = ts.TypeFlags.Any | ts.TypeFlags.Unknown | ts.TypeFlags.Never;
      if ((type.getFlags() & flags) !== 0) return false;

      // Always truthy
      if ((type.getFlags() & ts.TypeFlags.PossiblyFalsy) === 0) return true;

      if (type.isStringLiteral() || type.isNumberLiteral()) {
        return !!type.value;
      }

      // bigint
      if (type.isLiteral() && typeof type.value === 'object') {
        return type.value.base10Value !== '0';
      }

      if (type.getFlags() & ts.TypeFlags.BooleanLiteral) {
        return type !== getChecker().getFalseType();
      }

      return false;
    }
  },
});

function isSimpleNegation(node: TSESTree.Node): boolean {
  if (node.type !== AST_NODE_TYPES.UnaryExpression) return false;
  if (node.operator !== '!') return false;
  return true;
}

function isDoubleNegation(node: TSESTree.UnaryExpression): boolean {
  if (node.operator !== '!') return false;
  if (!isSimpleNegation(node.parent)) return false;
  return true;
}

function isBooleanCall(node: TSESTree.CallExpression): boolean {
  if (node.callee.type !== AST_NODE_TYPES.Identifier) return false;
  if (node.callee.name !== 'Boolean') return false;
  return true;
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

function getAllReturnStatements(node: TSESTree.Node | null): TSESTree.ReturnStatement[] {
  if (!node) return [];

  switch (node.type) {
    case AST_NODE_TYPES.ReturnStatement:
      return [node];

    case AST_NODE_TYPES.BlockStatement:
      return node.body.flatMap((stmt) => getAllReturnStatements(stmt));

    case AST_NODE_TYPES.IfStatement:
      return [
        ...getAllReturnStatements(node.consequent),
        ...getAllReturnStatements(node.alternate),
      ].flat();

    case AST_NODE_TYPES.CatchClause:
      return getAllReturnStatements(node.body);

    case AST_NODE_TYPES.TryStatement:
      return [
        ...getAllReturnStatements(node.block),
        ...getAllReturnStatements(node.handler),
        ...getAllReturnStatements(node.finalizer),
      ].flat();

    case AST_NODE_TYPES.DoWhileStatement:
    case AST_NODE_TYPES.WhileStatement:
    case AST_NODE_TYPES.ForStatement:
    case AST_NODE_TYPES.ForInStatement:
    case AST_NODE_TYPES.ForOfStatement:
      return getAllReturnStatements(node.body);

    case AST_NODE_TYPES.SwitchCase:
      return node.consequent.flatMap((stmt) => getAllReturnStatements(stmt));

    case AST_NODE_TYPES.SwitchStatement:
      return node.cases.flatMap((c) => getAllReturnStatements(c));

    default:
      return [];
  }
}
