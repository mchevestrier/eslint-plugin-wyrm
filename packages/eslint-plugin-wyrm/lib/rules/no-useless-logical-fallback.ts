/**
 * @fileoverview
 *
 * This rule warns when the component of a logical expression does not have any effect on the result of the expression.
 *
 * @example
 * ```ts
 * declare const foo: string | undefined;
 * foo ?? undefined; // foo cannot be `null`, so the nullish coalescing `?? undefined` does not have any observable effect.
 *
 * declare const bar: string;
 * bar || ''; // The empty string is the only possible falsy value for strings, so the right side is unnecessary.
 * ```
 *
 * The rule also warns in some cases when the component of a logical expression makes the type of the expression constant.
 *
 * @example
 * ```ts
 * declare const quux: boolean;
 * quux && false; // This will always be false
 * ```
 */

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
    type: 'suggestion',
    docs: {
      description: 'Forbid useless fallback values for logical expressions',
      recommended: true,
      requiresTypeChecking: true,
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      noConstantExpression: '`{{expression}}` makes this logical expression constant',
      noUselessLogicalFallback:
        '`{{expression}}` does not change the result of this expression',
      removeLogicalFallback: 'Remove `{{expression}}`',
      noNumberOrZero:
        '`|| 0` on a number is equivalent to checking for `NaN`. You should be explicit and use `Number.isNaN()` instead',
      replaceByIsNaNCheck: 'Use `Number.isNaN()` instead',
      replaceByTrue: 'Use `true` instead',
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
      LogicalExpression(node) {
        switch (node.operator) {
          case '||':
            checkOrExpression(node);
            break;
          case '&&':
            checkAndExpression(node);
            break;
          case '??':
            checkNullishCoalescingExpression(node);
            break;

          /* v8 ignore next -- @preserve */
          default: {
            const check: never = node.operator;
            console.error(`[wyrm] Unexpected operator for LogicalExpression: ${check}`);
          }
        }
      },
    };

    function checkOrExpression(node: TSESTree.LogicalExpression) {
      if (node.right.type !== AST_NODE_TYPES.Literal) return;

      if (node.right.value === false) {
        if (!isOnlyBoolean(node.left)) return;

        const expression = `${node.operator} ${node.right.value}`;
        context.report({
          node,
          messageId: 'noUselessLogicalFallback',
          data: { expression },
          suggest: [
            {
              messageId: 'removeLogicalFallback',
              data: { expression },
              fix(fixer) {
                const leftText = context.sourceCode.getText(node.left);
                return fixer.replaceText(node, leftText);
              },
            },
          ],
        });
      }

      if (node.right.value === true) {
        if (!isOnlyBoolean(node.left)) return;

        const expression = `${node.operator} ${node.right.value}`;
        context.report({
          node,
          messageId: 'noConstantExpression',
          data: { expression },
          suggest: [
            {
              messageId: 'removeLogicalFallback',
              data: { expression },
              fix(fixer) {
                const leftText = context.sourceCode.getText(node.left);
                return fixer.replaceText(node, leftText);
              },
            },
          ],
        });
      }

      // string || ''
      if (isEmptyStringLiteral(node.right) && isOnlyString(node.left)) {
        const expression = "|| ''";
        context.report({
          node,
          messageId: 'noUselessLogicalFallback',
          data: { expression },
          suggest: [
            {
              messageId: 'removeLogicalFallback',
              data: { expression },
              fix(fixer) {
                const leftText = context.sourceCode.getText(node.left);
                return fixer.replaceText(node, leftText);
              },
            },
          ],
        });
      }

      // number || 0
      if (isZeroLiteral(node.right) && isOnlyNumber(node.left)) {
        context.report({
          node,
          messageId: 'noNumberOrZero',
          suggest: [
            {
              messageId: 'replaceByIsNaNCheck',
              fix(fixer) {
                const leftText = context.sourceCode.getText(node.left);
                const text = `Number.isNaN(${leftText}) ? 0 : ${leftText}`;
                return fixer.replaceText(node, text);
              },
            },
            {
              messageId: 'removeLogicalFallback',
              data: { expression: '|| 0' },
              fix(fixer) {
                const leftText = context.sourceCode.getText(node.left);
                return fixer.replaceText(node, leftText);
              },
            },
          ],
        });
      }
    }

    function checkAndExpression(node: TSESTree.LogicalExpression) {
      if (node.right.type !== AST_NODE_TYPES.Literal) return;

      if (node.right.value === true) {
        if (!isOnlyBoolean(node.left)) return;

        const expression = `${node.operator} ${node.right.value}`;
        context.report({
          node,
          messageId: 'noUselessLogicalFallback',
          data: { expression },
          suggest: [
            {
              messageId: 'removeLogicalFallback',
              data: { expression },
              fix(fixer) {
                const leftText = context.sourceCode.getText(node.left);
                return fixer.replaceText(node, leftText);
              },
            },
          ],
        });
      }

      if (node.right.value === false) {
        if (!isOnlyBoolean(node.left)) return;

        const expression = `${node.operator} ${node.right.value}`;
        context.report({
          node,
          messageId: 'noConstantExpression',
          data: { expression },
          suggest: [
            {
              messageId: 'removeLogicalFallback',
              data: { expression },
              fix(fixer) {
                const leftText = context.sourceCode.getText(node.left);
                return fixer.replaceText(node, leftText);
              },
            },
          ],
        });
      }
    }

    function checkNullishCoalescingExpression(node: TSESTree.LogicalExpression) {
      // undefined ?? undefined
      if (
        isUndefinedLiteral(node.right) &&
        !isPossiblyNull(node.left) &&
        isPossiblyUndefined(node.left)
      ) {
        const expression = '?? undefined';
        context.report({
          node,
          messageId: 'noUselessLogicalFallback',
          data: { expression },
          suggest: [
            {
              messageId: 'removeLogicalFallback',
              data: { expression },
              fix(fixer) {
                const leftText = context.sourceCode.getText(node.left);
                return fixer.replaceText(node, leftText);
              },
            },
          ],
        });
      }

      // null ?? null
      if (
        isNullLiteral(node.right) &&
        !isPossiblyUndefined(node.left) &&
        isPossiblyNull(node.left)
      ) {
        const expression = '?? null';
        context.report({
          node,
          messageId: 'noUselessLogicalFallback',
          data: { expression },
          suggest: [
            {
              messageId: 'removeLogicalFallback',
              data: { expression },
              fix(fixer) {
                const leftText = context.sourceCode.getText(node.left);
                return fixer.replaceText(node, leftText);
              },
            },
          ],
        });
      }

      // foo ?? !foo
      if (
        node.left.type === AST_NODE_TYPES.Identifier &&
        node.right.type === AST_NODE_TYPES.UnaryExpression &&
        node.right.operator === '!' &&
        node.right.argument.type === AST_NODE_TYPES.Identifier &&
        node.left.name === node.right.argument.name
      ) {
        context.report({
          node,
          messageId: 'replaceByTrue',
          suggest: [
            {
              messageId: 'replaceByTrue',
              fix(fixer) {
                return fixer.replaceText(node.right, 'true');
              },
            },
          ],
        });
      }
    }

    function isOnlyBoolean(expr: TSESTree.Expression): boolean {
      const booleanType = getChecker().getBooleanType();

      const type = getServices().getTypeAtLocation(expr);

      return type === booleanType;
    }

    function isOnlyString(expr: TSESTree.Expression): boolean {
      const stringType = getChecker().getStringType();

      const type = getServices().getTypeAtLocation(expr);

      return type === stringType;
    }

    function isOnlyNumber(expr: TSESTree.Expression): boolean {
      const numberType = getChecker().getNumberType();

      const type = getServices().getTypeAtLocation(expr);

      return type === numberType;
    }

    function isTypePossiblyNull(type: ts.Type): boolean {
      if (type.isUnion()) {
        return type.types.some((t) => isTypePossiblyNull(t));
      }

      const flags =
        ts.TypeFlags.Null |
        ts.TypeFlags.Any |
        ts.TypeFlags.Unknown |
        ts.TypeFlags.TypeParameter;

      return (type.getFlags() & flags) !== 0;
    }

    function isPossiblyNull(expr: TSESTree.Expression): boolean {
      const type = getServices().getTypeAtLocation(expr);
      return isTypePossiblyNull(type);
    }

    function isTypePossiblyUndefined(type: ts.Type): boolean {
      if (type.isUnion()) {
        return type.types.some((t) => isTypePossiblyUndefined(t));
      }

      const flags =
        ts.TypeFlags.Undefined |
        ts.TypeFlags.Any |
        ts.TypeFlags.Unknown |
        ts.TypeFlags.TypeParameter;

      return (type.getFlags() & flags) !== 0;
    }

    function isPossiblyUndefined(expr: TSESTree.Expression): boolean {
      const type = getServices().getTypeAtLocation(expr);

      return isTypePossiblyUndefined(type);
    }
  },
});

function isUndefinedLiteral(node: TSESTree.Node): boolean {
  return node.type === AST_NODE_TYPES.Identifier && node.name === 'undefined';
}

function isNullLiteral(node: TSESTree.Node): boolean {
  return node.type === AST_NODE_TYPES.Literal && node.value === null;
}

function isZeroLiteral(node: TSESTree.Node): boolean {
  return node.type === AST_NODE_TYPES.Literal && node.value === 0;
}

function isEmptyStringLiteral(node: TSESTree.Node): boolean {
  return node.type === AST_NODE_TYPES.Literal && node.value === '';
}
