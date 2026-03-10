import path from 'node:path';

import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import type {
  ParserServicesWithTypeInformation,
  TSESTree,
} from '@typescript-eslint/utils';
import * as ts from 'typescript';

import { createRule } from '../utils/createRule.js';
import { None, Some } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid using `x == null` when equivalent to `x === null`',
      strict: true,
      requiresTypeChecking: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      useEqEqEqNull: 'Use {{ op }} null',
      useEqEqEqUndefined: 'Use {{ op }} undefined',
      constantEquality:
        '`== null` or `== undefined` will always be true because undefined == null',
      constantInequality:
        '`!= null` or `!= undefined` will always be false because undefined == null',
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
      BinaryExpression(node) {
        if (node.operator !== '==' && node.operator !== '!=') return;

        const maybeExpr = getNullishedComparedNode(node);
        if (!maybeExpr.some) return;

        const type = getServices().getTypeAtLocation(maybeExpr.value);

        const text = context.sourceCode.getText(maybeExpr.value);
        const strictOperator = node.operator === '==' ? '===' : '!==';

        if (isNull(type) && !isUndefined(type)) {
          context.report({
            node,
            messageId: 'useEqEqEqNull',
            data: { op: strictOperator },
            fix(fixer) {
              return fixer.replaceText(node, `${text} ${strictOperator} null`);
            },
          });
          return;
        }

        if (!isNull(type) && isUndefined(type)) {
          context.report({
            node,
            messageId: 'useEqEqEqUndefined',
            data: { op: strictOperator },
            fix(fixer) {
              return fixer.replaceText(node, `${text} ${strictOperator} undefined`);
            },
          });
          return;
        }

        if (!isOnlyNullish(type)) return;
        if (node.operator === '==') {
          context.report({ node, messageId: 'constantEquality' });
        } else {
          context.report({ node, messageId: 'constantInequality' });
        }
      },
    };
  },
});

function isNull(type: ts.Type): boolean {
  if (type.isUnion()) return type.types.some((t) => isNull(t));
  return (type.getFlags() & ts.TypeFlags.Null) !== 0;
}

function isUndefined(type: ts.Type): boolean {
  if (type.isUnion()) return type.types.some((t) => isUndefined(t));
  return (type.getFlags() & ts.TypeFlags.Undefined) !== 0;
}

function isOnlyNullish(type: ts.Type): boolean {
  if (!type.isUnion()) return false;
  return type.types.every((t) => isNull(t) || isUndefined(t));
}

function getNullishedComparedNode(node: TSESTree.BinaryExpression) {
  if (isNullishLiteral(node.left)) return Some(node.right);
  if (isNullishLiteral(node.right)) return Some(node.left);
  return None;
}

function isNullishLiteral(node: TSESTree.Node): boolean {
  return isUndefinedLiteral(node) || isNullLiteral(node);
}

function isUndefinedLiteral(node: TSESTree.Node): boolean {
  return node.type === AST_NODE_TYPES.Identifier && node.name === 'undefined';
}

function isNullLiteral(node: TSESTree.Node): boolean {
  return node.type === AST_NODE_TYPES.Literal && node.value === null;
}
