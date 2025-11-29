import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid simplifiable logical expressions',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noConvolutedLogicalExpression: 'This logical expression can be simplified',
    },
  },
  defaultOptions: [],
  create(context) {
    function checkDisjunctionOfTernaryExpressions(
      node: TSESTree.LogicalExpression,
      left: TSESTree.ConditionalExpression,
      right: TSESTree.ConditionalExpression,
    ) {
      if (left.test.type !== AST_NODE_TYPES.Identifier) return;
      if (!isNullishLiteral(left.alternate)) return;

      const leftAlternateText = context.sourceCode.getText(left.alternate);
      if (leftAlternateText !== context.sourceCode.getText(right.alternate)) return;

      const identifierName = left.test.name;
      const leftConsequentText = context.sourceCode.getText(left.consequent);
      const rightConsequentText = context.sourceCode.getText(right.consequent);
      const op = node.operator;

      // (quux ? foo : null) ?? (!quux ? bar : null)
      // (quux ? foo : null) || (!quux ? bar : null)
      // (quux ? foo : null) && (!quux ? bar : null)
      if (isNegatedIdentifier(right.test, left.test.name)) {
        context.report({
          node,
          messageId: 'noConvolutedLogicalExpression',
          fix(fixer) {
            const text = `${identifierName} ? (${leftConsequentText} ${op} ${leftAlternateText}) : ${rightConsequentText}`;
            return fixer.replaceText(node, text);
          },
        });
        return;
      }

      // (quux ? foo : null) ?? (quux ? bar : null)
      // (quux ? foo : null) || (quux ? bar : null)
      // (quux ? foo : null) && (quux ? bar : null)
      if (
        right.test.type === AST_NODE_TYPES.Identifier &&
        left.test.name === right.test.name
      ) {
        context.report({
          node,
          messageId: 'noConvolutedLogicalExpression',
          fix(fixer) {
            const text = `${identifierName} ? (${leftConsequentText} ${op} ${rightConsequentText}) : ${leftAlternateText}`;
            return fixer.replaceText(node, text);
          },
        });
        return;
      }

      // (quux ? foo : null) || (fnord ? bar : null)
      if (right.test.type === AST_NODE_TYPES.Identifier && node.operator === '||') {
        const rightIdentifierName = right.test.name;

        context.report({
          node,
          messageId: 'noConvolutedLogicalExpression',
          fix(fixer) {
            // quux && foo ? foo : fnord ? bar : null;
            const text = `${identifierName} && ${leftConsequentText} ? ${leftConsequentText} : ${rightIdentifierName} ? ${rightConsequentText} : ${leftAlternateText}`;
            return fixer.replaceText(node, text);
          },
        });
      }
    }

    return {
      LogicalExpression(node) {
        if (
          node.left.type === AST_NODE_TYPES.Identifier &&
          node.right.type === AST_NODE_TYPES.Identifier
        ) {
          if (node.left.name !== node.right.name) return;
          const identifierName = node.left.name;
          // Tautology
          context.report({
            node,
            messageId: 'noConvolutedLogicalExpression',
            fix(fixer) {
              return fixer.replaceText(node, identifierName);
            },
          });
          return;
        }

        if (
          node.left.type === AST_NODE_TYPES.Identifier &&
          node.right.type === AST_NODE_TYPES.LogicalExpression
        ) {
          // Absorption law
          const isDisjunctionWithConjunction =
            node.operator === '||' && node.right.operator === '&&';
          const isConjunctionWithDisjunction =
            node.operator === '&&' && node.right.operator === '||';
          const isAbsorbed = isDisjunctionWithConjunction || isConjunctionWithDisjunction;

          if (
            isAbsorbed &&
            node.right.left.type === AST_NODE_TYPES.Identifier &&
            node.left.name === node.right.left.name
          ) {
            const identifierName = node.left.name;
            context.report({
              node,
              messageId: 'noConvolutedLogicalExpression',
              fix(fixer) {
                return fixer.replaceText(node, identifierName);
              },
            });
          }
          return;
        }

        if (
          node.left.type === AST_NODE_TYPES.LogicalExpression &&
          node.right.type === AST_NODE_TYPES.LogicalExpression
        ) {
          // Distributive law
          const isDistributed: boolean = node.left.operator === node.right.operator;

          if (
            isDistributed &&
            node.left.left.type === AST_NODE_TYPES.Identifier &&
            node.right.left.type === AST_NODE_TYPES.Identifier &&
            node.left.left.name === node.right.left.name
          ) {
            const identifierName = node.left.left.name;
            const leftText = context.sourceCode.getText(node.left.right);
            const rightText = context.sourceCode.getText(node.right.right);
            const op = node.operator;
            const distributedOp = node.left.operator;
            const text = `${identifierName} ${distributedOp} (${leftText} ${op} ${rightText})`;

            context.report({
              node,
              messageId: 'noConvolutedLogicalExpression',
              fix(fixer) {
                return fixer.replaceText(node, text);
              },
            });
          }
          return;
        }

        if (
          node.left.type === AST_NODE_TYPES.ConditionalExpression &&
          node.right.type === AST_NODE_TYPES.ConditionalExpression
        ) {
          checkDisjunctionOfTernaryExpressions(node, node.left, node.right);
        }
      },
    };
  },
});

function isNegatedIdentifier(node: TSESTree.Node, identifierName: string): boolean {
  if (node.type !== AST_NODE_TYPES.UnaryExpression) return false;
  if (node.operator !== '!') return false;
  if (node.argument.type !== AST_NODE_TYPES.Identifier) return false;
  return node.argument.name === identifierName;
}

function isNullishLiteral(node: TSESTree.Node): boolean {
  if (node.type === AST_NODE_TYPES.Literal && node.value === null) return true;
  if (node.type === AST_NODE_TYPES.Identifier && node.name === 'undefined') return true;
  return false;
}
