import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';
import type { Option } from '../utils/option.js';
import { getFirstOption, None, Some } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid ternary conditions that can be replaced by optional chains',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noNullishTernary: 'Replace this ternary condition by optional chaining',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ConditionalExpression(node) {
        const maybeTestResult = analyzeTest(node.test);
        if (!maybeTestResult.some) return;
        const testResult = maybeTestResult.value;

        switch (testResult.kind) {
          case TestKind.TRUTHY:
            checkTernary(testResult.ident, node.consequent, node.alternate);
            break;

          case TestKind.FALSY:
            checkTernary(testResult.ident, node.alternate, node.consequent);
            break;

          default: {
            const check: never = testResult.kind;
            console.error(`[wyrm] Unexpected test kind: ${check}`);
          }
        }

        function checkTernary(
          ident: TSESTree.Identifier,
          consequent: TSESTree.Expression,
          alternate: TSESTree.Expression,
        ) {
          if (!isUndefinedLiteral(alternate)) return;

          if (consequent.type !== AST_NODE_TYPES.MemberExpression) return;
          if (consequent.object.type !== AST_NODE_TYPES.Identifier) return;
          if (consequent.object.name !== ident.name) return;

          context.report({
            node,
            messageId: 'noNullishTernary',
            fix(fixer) {
              const objTxt = context.sourceCode.getText(consequent.object);
              const propTxt = context.sourceCode.getText(consequent.property);
              const txt = consequent.computed
                ? `${objTxt}?.[${propTxt}]`
                : `${objTxt}?.${propTxt}`;
              return fixer.replaceText(node, txt);
            },
          });
        }
      },
    };
  },
});

function isUndefinedLiteral(node: TSESTree.Node): boolean {
  return node.type === AST_NODE_TYPES.Identifier && node.name === 'undefined';
}

enum TestKind {
  TRUTHY = 'TRUTHY',
  FALSY = 'FALSY',
}

type TestResult = { kind: TestKind; ident: TSESTree.Identifier };

function analyzeTest(test: TSESTree.Expression): Option<TestResult> {
  switch (test.type) {
    case AST_NODE_TYPES.Identifier:
      return Some({ kind: TestKind.TRUTHY, ident: test });

    case AST_NODE_TYPES.BinaryExpression: {
      return getFirstOption([
        analyzeEqualityCheck(test, test.left, test.right),
        analyzeEqualityCheck(test, test.right, test.left),
      ]);
    }

    case AST_NODE_TYPES.UnaryExpression:
      if (test.operator !== '!') return None;
      if (test.argument.type === AST_NODE_TYPES.Identifier) {
        return Some({ kind: TestKind.FALSY, ident: test.argument });
      }
      return None;

    default:
      return None;
  }
}

function analyzeEqualityCheck(
  node: TSESTree.BinaryExpression,
  left: TSESTree.PrivateIdentifier | TSESTree.Expression,
  right: TSESTree.PrivateIdentifier | TSESTree.Expression,
): Option<TestResult> {
  switch (node.operator) {
    case '!=':
    case '!==': {
      const kind = TestKind.TRUTHY;

      if (
        left.type === AST_NODE_TYPES.Identifier &&
        right.type === AST_NODE_TYPES.Literal &&
        right.value === null
      ) {
        return Some({ ident: left, kind });
      }

      if (
        left.type === AST_NODE_TYPES.Identifier &&
        right.type === AST_NODE_TYPES.Identifier &&
        right.name === 'undefined'
      ) {
        return Some({ ident: left, kind });
      }

      if (
        left.type === AST_NODE_TYPES.UnaryExpression &&
        left.operator === 'typeof' &&
        right.type === AST_NODE_TYPES.Literal &&
        right.value === 'undefined' &&
        left.argument.type === AST_NODE_TYPES.Identifier
      ) {
        return Some({ ident: left.argument, kind });
      }

      return None;
    }

    case '==':
    case '===': {
      const kind = TestKind.FALSY;

      if (
        left.type === AST_NODE_TYPES.Identifier &&
        right.type === AST_NODE_TYPES.Literal &&
        right.value === null
      ) {
        return Some({ ident: left, kind });
      }

      if (
        left.type === AST_NODE_TYPES.Identifier &&
        right.type === AST_NODE_TYPES.Identifier &&
        right.name === 'undefined'
      ) {
        return Some({ ident: left, kind });
      }

      if (
        left.type === AST_NODE_TYPES.UnaryExpression &&
        left.operator === 'typeof' &&
        right.type === AST_NODE_TYPES.Literal &&
        right.value === 'undefined' &&
        left.argument.type === AST_NODE_TYPES.Identifier
      ) {
        return Some({ ident: left.argument, kind });
      }

      return None;
    }

    default:
      return None;
  }
}
