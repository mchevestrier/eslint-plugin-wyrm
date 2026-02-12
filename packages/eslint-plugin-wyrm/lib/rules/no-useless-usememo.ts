import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';
import type { Option } from '../utils/option.js';
import { None, Some } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid useless `useMemo()`',
      strict: true,
    },
    schema: [],
    messages: {
      noSingleReturnedIdentifier:
        'Using `useMemo()` to only return an identifier is probably pointless',
      noUselessUseMemo:
        'You can probably remove the `useMemo()` as it does not look like this function is very expensive',
    },
  },
  defaultOptions: [],
  create(context) {
    function checkFunctionExpression(
      fn: TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression,
      deps: TSESTree.ArrayExpression,
    ) {
      const singleReturnedNode = extractSingleReturnedNode(fn);
      if (
        singleReturnedNode.some &&
        singleReturnedNode.value.type === AST_NODE_TYPES.Identifier
      ) {
        context.report({
          node: singleReturnedNode.value,
          messageId: 'noSingleReturnedIdentifier',
        });
        return;
      }

      if (
        singleReturnedNode.some &&
        singleReturnedNode.value.type === AST_NODE_TYPES.ObjectExpression
      ) {
        return;
      }

      if (deps.elements.length) return;

      if (functionHasActualWork(fn)) return;

      context.report({ node: fn, messageId: 'noUselessUseMemo' });
    }

    return {
      CallExpression(node) {
        if (!isUseMemo(node.callee)) return;

        const [callback, deps] = node.arguments;
        if (!callback) return;
        if (!deps) return;

        if (
          callback.type !== AST_NODE_TYPES.FunctionExpression &&
          callback.type !== AST_NODE_TYPES.ArrowFunctionExpression
        ) {
          return;
        }

        if (deps.type !== AST_NODE_TYPES.ArrayExpression) return;

        checkFunctionExpression(callback, deps);
      },
    };
  },
});

function isUseMemo(node: TSESTree.Expression) {
  const useMemoName = 'useMemo';
  if (node.type === AST_NODE_TYPES.Identifier) {
    return node.name === useMemoName;
  }

  // Stryker disable BooleanLiteral
  if (node.type !== AST_NODE_TYPES.MemberExpression) return false;

  if (node.object.type !== AST_NODE_TYPES.Identifier) return false;
  if (node.property.type !== AST_NODE_TYPES.Identifier) return false;

  if (node.object.name !== 'React') return false;
  if (node.property.name !== useMemoName) return false;

  return true;
}

function functionHasActualWork(
  fn: TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression,
) {
  if (fn.body.type !== AST_NODE_TYPES.BlockStatement) {
    return isActualWork(fn.body);
  }

  return fn.body.body.some((stmt) => isActualWork(stmt));
}

function isActualWork(node: TSESTree.Node): boolean {
  switch (node.type) {
    case AST_NODE_TYPES.Identifier:
    case AST_NODE_TYPES.Literal:
      return false;

    case AST_NODE_TYPES.CallExpression:
    case AST_NODE_TYPES.AwaitExpression:
    // Loops:
    case AST_NODE_TYPES.ForStatement:
    case AST_NODE_TYPES.ForInStatement:
    case AST_NODE_TYPES.ForOfStatement:
    case AST_NODE_TYPES.WhileStatement:
    case AST_NODE_TYPES.DoWhileStatement:
    // JSX:
    case AST_NODE_TYPES.JSXElement:
    case AST_NODE_TYPES.JSXAttribute:
    case AST_NODE_TYPES.JSXClosingElement:
    case AST_NODE_TYPES.JSXClosingFragment:
    case AST_NODE_TYPES.JSXEmptyExpression:
    case AST_NODE_TYPES.JSXExpressionContainer:
    case AST_NODE_TYPES.JSXFragment:
    case AST_NODE_TYPES.JSXIdentifier:
    case AST_NODE_TYPES.JSXMemberExpression:
    case AST_NODE_TYPES.JSXNamespacedName:
    case AST_NODE_TYPES.JSXOpeningElement:
    case AST_NODE_TYPES.JSXOpeningFragment:
    case AST_NODE_TYPES.JSXSpreadAttribute:
    case AST_NODE_TYPES.JSXSpreadChild:
    case AST_NODE_TYPES.JSXText:
      return true;

    case AST_NODE_TYPES.ReturnStatement:
    case AST_NODE_TYPES.YieldExpression:
      if (!node.argument) return false;
      return isActualWork(node.argument);

    case AST_NODE_TYPES.LogicalExpression:
    case AST_NODE_TYPES.BinaryExpression:
      if (node.operator === '**') return true;
      return isActualWork(node.left) || isActualWork(node.right);

    case AST_NODE_TYPES.AssignmentExpression:
      return isActualWork(node.right);

    case AST_NODE_TYPES.BlockStatement:
      return node.body.some((stmt) => isActualWork(stmt));

    case AST_NODE_TYPES.VariableDeclaration:
      return node.declarations.some((decl) => isActualWork(decl));

    case AST_NODE_TYPES.VariableDeclarator:
      if (!node.init) return false;
      return isActualWork(node.init);

    case AST_NODE_TYPES.IfStatement:
      return (
        isActualWork(node.test) ||
        isActualWork(node.consequent) ||
        (!!node.alternate && isActualWork(node.alternate))
      );

    case AST_NODE_TYPES.ArrayExpression:
      return node.elements.some((elt) => elt && isActualWork(elt));

    case AST_NODE_TYPES.SpreadElement:
      return isActualWork(node.argument);

    case AST_NODE_TYPES.TSAsExpression:
    case AST_NODE_TYPES.TSNonNullExpression:
    case AST_NODE_TYPES.TSSatisfiesExpression:
    case AST_NODE_TYPES.ExpressionStatement:
      return isActualWork(node.expression);

    default:
      return true;
  }
}

/**
 * If all a function does is return something, return the returned node.
 * Otherwise return None.
 */
function extractSingleReturnedNode(
  fn: TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression,
): Option<TSESTree.Node> {
  if (fn.body.type !== AST_NODE_TYPES.BlockStatement) {
    return Some(fn.body);
  }

  if (fn.body.body.length > 1) return None;
  const [stmt] = fn.body.body;
  if (!stmt) return None;
  if (stmt.type !== AST_NODE_TYPES.ReturnStatement) return None;
  if (!stmt.argument) return None;
  return Some(stmt.argument);
}
