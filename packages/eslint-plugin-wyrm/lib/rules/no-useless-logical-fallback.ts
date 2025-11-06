/**
 * @fileoverview
 *
 * This rule warns when the component of a logical expression does not have any effect on the type of the expression.
 *
 * @example
 * ```ts
 * declare const foo: string | undefined;
 * foo ?? undefined; // foo cannot be null, so the nullish coalescing `?? undefined` does not have any observable effect.
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

import { AST_NODE_TYPES, ESLintUtils, type TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid useless default values for nullish coalescing expressions',
      recommended: true,
      requiresTypeChecking: true,
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      noConstantExpression:
        '`{{expression}}` makes the type of this logical expression constant',
      noUselessNullishFallback:
        '`{{expression}}` does not change the type of this expression',
      removeNullishFallback: 'Remove `{{expression}}`',
    },
  },
  defaultOptions: [],
  create(context) {
    function checkOrExpression(node: TSESTree.LogicalExpression) {
      if (node.right.type !== AST_NODE_TYPES.Literal) return;

      if (node.right.value === false) {
        if (!isOnlyBoolean(node.left)) return;

        const expression = `${node.operator} ${node.right.value}`;
        context.report({
          node,
          messageId: 'noUselessNullishFallback',
          data: { expression },
          suggest: [
            {
              messageId: 'removeNullishFallback',
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
              messageId: 'removeNullishFallback',
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

    function checkAndExpression(node: TSESTree.LogicalExpression) {
      if (node.right.type !== AST_NODE_TYPES.Literal) return;

      if (node.right.value === true) {
        if (!isOnlyBoolean(node.left)) return;

        const expression = `${node.operator} ${node.right.value}`;
        context.report({
          node,
          messageId: 'noUselessNullishFallback',
          data: { expression },
          suggest: [
            {
              messageId: 'removeNullishFallback',
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
              messageId: 'removeNullishFallback',
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

    function isOnlyBoolean(expr: TSESTree.Expression): boolean {
      const services = ESLintUtils.getParserServices(context);
      const checker = services.program.getTypeChecker();
      const booleanType = checker.getBooleanType();

      const type = services.getTypeAtLocation(expr);

      return type === booleanType;
    }

    function isPossiblyNull(expr: TSESTree.Expression): boolean {
      const services = ESLintUtils.getParserServices(context);
      const checker = services.program.getTypeChecker();
      const nullType = checker.getNullType();

      const type = services.getTypeAtLocation(expr);

      if (type.isUnion()) {
        return type.types.includes(nullType);
      }

      return type === nullType;
    }

    function isPossiblyUndefined(expr: TSESTree.Expression): boolean {
      const services = ESLintUtils.getParserServices(context);
      const checker = services.program.getTypeChecker();
      const undefinedType = checker.getUndefinedType();

      const type = services.getTypeAtLocation(expr);

      if (type.isUnion()) {
        return type.types.includes(undefinedType);
      }

      return type === undefinedType;
    }

    function checkNullishCoalescingExpression(node: TSESTree.LogicalExpression) {
      // undefined ?? undefined
      if (isUndefinedLiteral(node.right) && !isPossiblyNull(node.left)) {
        const expression = '?? undefined';
        context.report({
          node,
          messageId: 'noUselessNullishFallback',
          data: { expression },
          suggest: [
            {
              messageId: 'removeNullishFallback',
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
      if (isNullLiteral(node.right) && !isPossiblyUndefined(node.left)) {
        const expression = '?? null';
        context.report({
          node,
          messageId: 'noUselessNullishFallback',
          data: { expression },
          suggest: [
            {
              messageId: 'removeNullishFallback',
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
          default: {
            const check: never = node.operator;
            console.error(`Unexpected operator for LogicalExpression: ${check}`);
          }
        }
      },
    };
  },
});

function isUndefinedLiteral(node: TSESTree.Node): boolean {
  return node.type === AST_NODE_TYPES.Identifier && node.name === 'undefined';
}

function isNullLiteral(node: TSESTree.Node): boolean {
  return node.type === AST_NODE_TYPES.Literal && node.value === null;
}
