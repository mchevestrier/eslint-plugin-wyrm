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

    function checkNegationTautology(
      node: TSESTree.LogicalExpression,
      left: TSESTree.Identifier,
      right: TSESTree.UnaryExpression,
    ) {
      // Negation tautology
      if (right.operator !== '!') return;
      if (right.argument.type !== AST_NODE_TYPES.Identifier) return;
      if (right.argument.name !== left.name) return;

      const identifierName = left.name;
      context.report({
        node,
        messageId: 'noConvolutedLogicalExpression',
        fix(fixer) {
          return fixer.replaceText(node, identifierName);
        },
      });
    }

    function checkSimpleTautology(
      node: TSESTree.LogicalExpression,
      left: TSESTree.Identifier,
      right: TSESTree.Identifier,
    ) {
      // Tautology
      if (left.name !== right.name) return;
      const identifierName = left.name;

      context.report({
        node,
        messageId: 'noConvolutedLogicalExpression',
        fix(fixer) {
          return fixer.replaceText(node, identifierName);
        },
      });
    }

    function checkAbsorptionLaw(
      node: TSESTree.LogicalExpression,
      left: TSESTree.Identifier,
      right: TSESTree.LogicalExpression,
    ) {
      // Absorption law
      const isDisjunctionWithConjunction =
        node.operator === '||' && right.operator === '&&';
      const isConjunctionWithDisjunction =
        node.operator === '&&' && right.operator === '||';
      const isAbsorbed = isDisjunctionWithConjunction || isConjunctionWithDisjunction;

      if (
        isAbsorbed &&
        right.left.type === AST_NODE_TYPES.Identifier &&
        left.name === right.left.name
      ) {
        context.report({
          node,
          messageId: 'noConvolutedLogicalExpression',
          fix(fixer) {
            return fixer.replaceText(node, context.sourceCode.getText(node.left));
          },
        });
      }
    }

    function checkLogicalExpressions(
      node: TSESTree.LogicalExpression,
      left: TSESTree.LogicalExpression,
      right: TSESTree.LogicalExpression,
    ) {
      // Distributive law
      const isDistributed: boolean = left.operator === right.operator;

      if (
        isDistributed &&
        left.left.type === AST_NODE_TYPES.Identifier &&
        right.left.type === AST_NODE_TYPES.Identifier &&
        left.left.name === right.left.name
      ) {
        const identifierName = left.left.name;
        const leftText = context.sourceCode.getText(left.right);
        const rightText = context.sourceCode.getText(right.right);
        const op = node.operator;
        const distributedOp = left.operator;
        const text = `${identifierName} ${distributedOp} (${leftText} ${op} ${rightText})`;

        context.report({
          node,
          messageId: 'noConvolutedLogicalExpression',
          fix(fixer) {
            return fixer.replaceText(node, text);
          },
        });
      }
    }

    function checkBinaryExpressions(
      node: TSESTree.LogicalExpression,
      left: TSESTree.BinaryExpression,
      right: TSESTree.BinaryExpression,
    ) {
      checkInequalityTautology(node, left, right);
      // eslint-disable-next-line sonarjs/arguments-order
      checkInequalityTautology(node, right, left);

      checkComparisonTautology(node, left, right);
      // eslint-disable-next-line sonarjs/arguments-order
      checkComparisonTautology(node, right, left);
    }

    function checkInequalityTautology(
      node: TSESTree.LogicalExpression,
      left: TSESTree.BinaryExpression,
      right: TSESTree.BinaryExpression,
    ) {
      if (left.left.type !== AST_NODE_TYPES.Identifier) return;
      if (left.right.type !== AST_NODE_TYPES.Identifier) return;
      if (right.left.type !== AST_NODE_TYPES.Identifier) return;
      if (right.right.type !== AST_NODE_TYPES.Identifier) return;

      if (left.operator !== '!=' && left.operator !== '!==') return;
      if (right.operator !== '==' && right.operator !== '===') return;

      if (left.left.name !== right.left.name && left.left.name !== right.right.name) {
        return;
      }
      if (left.right.name !== right.left.name && left.right.name !== right.right.name) {
        return;
      }

      context.report({
        node,
        messageId: 'noConvolutedLogicalExpression',
        fix(fixer) {
          return fixer.replaceText(node, context.sourceCode.getText(right));
        },
      });
    }

    function checkComparisonTautology(
      node: TSESTree.LogicalExpression,
      left: TSESTree.BinaryExpression,
      right: TSESTree.BinaryExpression,
    ) {
      if (left.left.type !== AST_NODE_TYPES.Identifier) return;
      if (left.right.type !== AST_NODE_TYPES.Identifier) return;
      if (right.left.type !== AST_NODE_TYPES.Identifier) return;
      if (right.right.type !== AST_NODE_TYPES.Identifier) return;

      if (
        left.operator !== '>' &&
        left.operator !== '<' &&
        left.operator !== '>=' &&
        left.operator !== '<='
      ) {
        return;
      }
      if (right.operator !== '==' && right.operator !== '===') return;

      if (left.left.name !== right.left.name && left.left.name !== right.right.name) {
        return;
      }
      if (left.right.name !== right.left.name && left.right.name !== right.right.name) {
        return;
      }

      context.report({
        node,
        messageId: 'noConvolutedLogicalExpression',
        fix(fixer) {
          return fixer.replaceText(node, context.sourceCode.getText(right));
        },
      });
    }

    return {
      LogicalExpression(node) {
        if (
          node.left.type === AST_NODE_TYPES.Identifier &&
          node.right.type === AST_NODE_TYPES.Identifier
        ) {
          checkSimpleTautology(node, node.left, node.right);
          return;
        }

        if (
          node.left.type === AST_NODE_TYPES.Identifier &&
          node.right.type === AST_NODE_TYPES.UnaryExpression
        ) {
          checkNegationTautology(node, node.left, node.right);
          return;
        }
        if (
          node.left.type === AST_NODE_TYPES.UnaryExpression &&
          node.right.type === AST_NODE_TYPES.Identifier
        ) {
          checkNegationTautology(node, node.right, node.left);
          return;
        }

        if (
          node.left.type === AST_NODE_TYPES.Identifier &&
          node.right.type === AST_NODE_TYPES.LogicalExpression
        ) {
          checkAbsorptionLaw(node, node.left, node.right);
          return;
        }

        if (
          node.left.type === AST_NODE_TYPES.LogicalExpression &&
          node.right.type === AST_NODE_TYPES.Identifier
        ) {
          checkAbsorptionLaw(node, node.right, node.left);
          return;
        }

        if (
          node.left.type === AST_NODE_TYPES.LogicalExpression &&
          node.right.type === AST_NODE_TYPES.LogicalExpression
        ) {
          checkLogicalExpressions(node, node.left, node.right);
          return;
        }

        if (
          node.left.type === AST_NODE_TYPES.BinaryExpression &&
          node.right.type === AST_NODE_TYPES.BinaryExpression
        ) {
          checkBinaryExpressions(node, node.left, node.right);
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
