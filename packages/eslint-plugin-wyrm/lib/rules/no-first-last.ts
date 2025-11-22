/* eslint-disable unicorn/consistent-function-scoping */
import path from 'node:path';

import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

import { compareTokens } from '../utils/compareTokens.js';
import { createRule } from '../utils/createRule.js';
import { None, Some, type Option } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid confusing naming for "first" or "last"',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noFirstLast: 'This is named "first" but it looks like a "last"',
      noLastFirst: 'This is named "last" but it looks like a "first"',
    },
  },
  defaultOptions: [],
  create(context) {
    function getIdentifierName(ident: TSESTree.Node): Option<string> {
      if (ident.type === AST_NODE_TYPES.Identifier) return Some(ident.name);

      if (ident.type !== AST_NODE_TYPES.Literal) return None;

      const { value } = ident;
      if (typeof value !== 'string') return None;
      return Some(value);
    }

    function checkAssignment(
      ident: TSESTree.Node,
      expr: TSESTree.Node,
      node: TSESTree.Node,
    ) {
      const maybeIdentName = getIdentifierName(ident);
      if (!maybeIdentName.some) return;

      checkFirstLast(maybeIdentName.value, expr, node);
      checkLastFirst(maybeIdentName.value, expr, node);
    }

    function isFirstIdent(variableName: string): boolean {
      return (
        /^first(?:[^a-z].*|)$/u.test(variableName) ||
        /^FIRST(?:[^A-Z].*|)$/u.test(variableName)
      );
    }

    function isLastIdent(variableName: string): boolean {
      return (
        /^last(?:[^a-z].*|)$/u.test(variableName) ||
        /^LAST(?:[^A-Z].*|)$/u.test(variableName)
      );
    }

    function hasFirstIdent(node: TSESTree.Node) {
      return hasIdent(node, isFirstIdent);
    }

    function hasLastIdent(node: TSESTree.Node) {
      return hasIdent(node, isLastIdent);
    }

    function hasIdent(node: TSESTree.Node, pred: (name: string) => boolean): boolean {
      switch (node.type) {
        case AST_NODE_TYPES.Identifier:
          return pred(node.name);

        case AST_NODE_TYPES.MemberExpression:
          return hasIdent(node.object, pred) || hasIdent(node.property, pred);

        case AST_NODE_TYPES.TSAsExpression:
        case AST_NODE_TYPES.TSSatisfiesExpression:
        case AST_NODE_TYPES.TSNonNullExpression:
          return hasIdent(node.expression, pred);

        case AST_NODE_TYPES.CallExpression:
          return hasIdent(node.callee, pred);

        default:
          return false;
      }
    }

    function unwrapExpr(node: TSESTree.Node) {
      switch (node.type) {
        case AST_NODE_TYPES.TSSatisfiesExpression:
        case AST_NODE_TYPES.TSNonNullExpression:
        case AST_NODE_TYPES.TSAsExpression:
          return unwrapExpr(node.expression);

        default:
          return node;
      }
    }

    function isCallExprFirstExpr(expr: TSESTree.CallExpression) {
      const callee = unwrapExpr(expr.callee);
      if (callee.type !== AST_NODE_TYPES.MemberExpression) return false;
      if (callee.property.type !== AST_NODE_TYPES.Identifier) return false;

      // lastFoos.at(0)
      if (hasLastIdent(callee.object)) {
        return false;
      }

      // foos.at(-1).at(0)
      if (isLastExpr(callee.object)) {
        return false;
      }

      // foo.find()
      if (callee.property.name === 'find') return true;

      if (callee.property.name !== 'at') return false;

      // foo.at(0)
      const [arg] = expr.arguments;
      if (!arg) return false;
      if (arg.type !== AST_NODE_TYPES.Literal) return false;
      return arg.value === 0;
    }

    function isFirstExpr(node: TSESTree.Node): boolean {
      const expr = unwrapExpr(node);

      switch (expr.type) {
        case AST_NODE_TYPES.CallExpression:
          return isCallExprFirstExpr(expr);

        case AST_NODE_TYPES.MemberExpression:
          // lastFoos[0]
          if (hasLastIdent(expr.object)) {
            return false;
          }

          // foos.at(-1)[0]
          if (isLastExpr(expr.object)) {
            return false;
          }

          // foo[0]
          return (
            expr.property.type === AST_NODE_TYPES.Literal && expr.property.value === 0
          );

        default:
          return false;
      }
    }

    function isCallExprLastExpr(expr: TSESTree.CallExpression) {
      const callee = unwrapExpr(expr.callee);
      if (callee.type !== AST_NODE_TYPES.MemberExpression) return false;
      if (callee.property.type !== AST_NODE_TYPES.Identifier) return false;

      // firstFoos.at(-1)
      if (hasFirstIdent(callee.object)) {
        return false;
      }

      // foos.at(0).at(-1)
      if (isFirstExpr(callee.object)) {
        return false;
      }

      // foo.findLast()
      if (callee.property.name === 'findLast') return true;

      if (callee.property.name !== 'at') return false;

      // foo.at(-1)
      const [arg] = expr.arguments;
      if (!arg) return false;
      if (arg.type !== AST_NODE_TYPES.UnaryExpression) return false;
      if (arg.operator !== '-') return false;
      if (arg.argument.type !== AST_NODE_TYPES.Literal) return false;
      return arg.argument.value === 1;
    }

    function isMemberExprLastExpr(expr: TSESTree.MemberExpression) {
      // firstFoos[firstFoos.length - 1]
      if (hasFirstIdent(expr.object)) {
        return false;
      }

      // foos[0][foos[0] - 1]
      if (isFirstExpr(expr.object)) {
        return false;
      }

      // foo[foo.length - 1]

      if (expr.property.type !== AST_NODE_TYPES.BinaryExpression) return false;
      if (expr.property.operator !== '-') return false;

      const { left, right } = expr.property;

      if (right.type !== AST_NODE_TYPES.Literal) return false;
      if (right.value !== 1) return false;

      if (left.type !== AST_NODE_TYPES.MemberExpression) return false;
      if (left.property.type !== AST_NODE_TYPES.Identifier) return false;
      if (left.property.name !== 'length') return false;

      // foo[...]
      const leftTokens = context.sourceCode.getTokens(expr.object);
      // ...[foo ...]
      const rightTokens = context.sourceCode.getTokens(left.object);

      return compareTokens(leftTokens, rightTokens);
    }

    function isLastExpr(node: TSESTree.Node): boolean {
      const expr = unwrapExpr(node);

      switch (expr.type) {
        case AST_NODE_TYPES.CallExpression:
          return isCallExprLastExpr(expr);

        case AST_NODE_TYPES.MemberExpression:
          return isMemberExprLastExpr(expr);

        default:
          return false;
      }
    }

    function checkFirstLast(
      variableName: string,
      expr: TSESTree.Node,
      node: TSESTree.Node,
    ) {
      if (!isFirstIdent(variableName)) return;
      if (!isLastExpr(expr)) return;

      context.report({ node, messageId: 'noFirstLast' });
    }

    function checkLastFirst(
      variableName: string,
      expr: TSESTree.Node,
      node: TSESTree.Node,
    ) {
      if (!isLastIdent(variableName)) return;
      if (!isFirstExpr(expr)) return;

      context.report({ node, messageId: 'noLastFirst' });
    }

    return {
      VariableDeclarator(node) {
        if (!node.init) return;
        checkAssignment(node.id, node.init, node);
      },

      AssignmentExpression(node) {
        checkAssignment(node.left, node.right, node);
      },

      Property(node) {
        checkAssignment(node.key, node.value, node);
      },

      ArrayPattern(node) {
        if (node.parent.type !== AST_NODE_TYPES.VariableDeclarator) return;
        if (node.parent.init?.type !== AST_NODE_TYPES.Identifier) return;

        const [first] = node.elements;

        if (
          first?.type === AST_NODE_TYPES.Identifier &&
          isLastIdent(first.name) &&
          !isLastIdent(node.parent.init.name)
        ) {
          context.report({ node: first, messageId: 'noLastFirst' });
        }
      },
    };
  },
});
