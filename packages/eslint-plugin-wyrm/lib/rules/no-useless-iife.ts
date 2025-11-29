import path from 'node:path';

import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';
import { None, Some, type Option } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid useless IIFEs',
      recommended: true,
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      noUselessIIFE: 'An IIFE is unnecessary here',
      removeIIFE: 'Remove this IIFE',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        const { callee } = node;
        if (
          callee.type !== AST_NODE_TYPES.FunctionExpression &&
          callee.type !== AST_NODE_TYPES.ArrowFunctionExpression
        ) {
          return;
        }

        if (callee.body.type !== AST_NODE_TYPES.BlockStatement) {
          context.report({
            node,
            messageId: 'noUselessIIFE',
            suggest: [
              {
                messageId: 'removeIIFE',
                fix(fixer) {
                  return fixer.replaceText(node, context.sourceCode.getText(callee.body));
                },
              },
            ],
          });
          return;
        }

        const { body } = callee.body;

        const [firstStatement] = body;
        if (!firstStatement) return;

        if (body.length === 1 && firstStatement.type === AST_NODE_TYPES.ReturnStatement) {
          context.report({
            node,
            messageId: 'noUselessIIFE',
            suggest: [
              {
                messageId: 'removeIIFE',
                fix(fixer) {
                  const txt = firstStatement.argument
                    ? context.sourceCode.getText(firstStatement.argument)
                    : 'undefined';
                  return fixer.replaceText(node, txt);
                },
              },
            ],
          });
          return;
        }

        const maybeParent = getCallExprParentStatement(node);
        if (!maybeParent.some) return;
        const parent = maybeParent.value;

        if (!hasAwait(body)) {
          context.report({
            node,
            messageId: 'noUselessIIFE',
            suggest: [
              {
                messageId: 'removeIIFE',
                fix(fixer) {
                  const txt = context.sourceCode.getText(callee.body);
                  return fixer.replaceText(parent, txt);
                },
              },
            ],
          });
          return;
        }

        if (isStatementInAsyncFunction(parent)) {
          context.report({
            node,
            messageId: 'noUselessIIFE',
            suggest: [
              {
                messageId: 'removeIIFE',
                fix(fixer) {
                  const txt = context.sourceCode.getText(callee.body);
                  return fixer.replaceText(parent, txt);
                },
              },
            ],
          });
        }
      },
    };
  },
});

function getCallExprParentStatement(
  node: TSESTree.CallExpression | TSESTree.AwaitExpression,
): Option<TSESTree.ExpressionStatement> {
  if (node.parent.type === AST_NODE_TYPES.ExpressionStatement) return Some(node.parent);
  if (node.parent.type === AST_NODE_TYPES.AwaitExpression) {
    return getCallExprParentStatement(node.parent);
  }
  return None;
}

function isStatementInAsyncFunction(stmt: TSESTree.ExpressionStatement): boolean {
  if (stmt.parent.type !== AST_NODE_TYPES.BlockStatement) return false;

  if (
    stmt.parent.parent.type === AST_NODE_TYPES.FunctionDeclaration ||
    stmt.parent.parent.type === AST_NODE_TYPES.ArrowFunctionExpression ||
    stmt.parent.parent.type === AST_NODE_TYPES.FunctionExpression
  ) {
    return stmt.parent.parent.async;
  }

  return false;
}

function hasAwait(node: TSESTree.Node | TSESTree.Node[] | null | undefined): boolean {
  if (!node) return false;

  if (Array.isArray(node)) {
    return node.some((s) => hasAwait(s));
  }

  return nodeHasAwait(node);
}

function nodeHasAwait(node: TSESTree.Node): boolean {
  switch (node.type) {
    case AST_NODE_TYPES.AwaitExpression:
      return true;

    case AST_NODE_TYPES.BlockStatement:
    case AST_NODE_TYPES.CatchClause:
      return hasAwait(node.body);

    case AST_NODE_TYPES.WhileStatement:
    case AST_NODE_TYPES.DoWhileStatement:
      return hasAwait(node.test) || hasAwait(node.body);

    case AST_NODE_TYPES.IfStatement:
    case AST_NODE_TYPES.ConditionalExpression:
      return hasAwait(node.test) || hasAwait(node.consequent) || hasAwait(node.alternate);

    case AST_NODE_TYPES.SwitchStatement:
      return hasAwait(node.discriminant) || node.cases.some((c) => hasAwait(c));

    case AST_NODE_TYPES.SwitchCase:
      return hasAwait(node.test) || hasAwait(node.consequent);

    case AST_NODE_TYPES.TryStatement:
      return hasAwait(node.block) || hasAwait(node.handler) || hasAwait(node.finalizer);

    case AST_NODE_TYPES.ForOfStatement:
      if (node.await) return true;
      return hasAwait(node.left) || hasAwait(node.right) || hasAwait(node.body);

    case AST_NODE_TYPES.ForInStatement:
      return hasAwait(node.right) || hasAwait(node.body);

    case AST_NODE_TYPES.ForStatement:
      return (
        hasAwait(node.init) ||
        hasAwait(node.test) ||
        hasAwait(node.update) ||
        hasAwait(node.body)
      );

    case AST_NODE_TYPES.TSSatisfiesExpression:
    case AST_NODE_TYPES.TSAsExpression:
    case AST_NODE_TYPES.TSNonNullExpression:
    case AST_NODE_TYPES.ChainExpression:
    case AST_NODE_TYPES.ExpressionStatement:
      return hasAwait(node.expression);

    case AST_NODE_TYPES.CallExpression:
      return hasAwait(node.callee) || node.arguments.some((arg) => hasAwait(arg));

    case AST_NODE_TYPES.SpreadElement:
    case AST_NODE_TYPES.ReturnStatement:
    case AST_NODE_TYPES.YieldExpression:
      return hasAwait(node.argument);

    case AST_NODE_TYPES.TSEnumBody:
      return node.members.some((mem) => hasAwait(mem));
    case AST_NODE_TYPES.TSEnumDeclaration:
      return hasAwait(node.body);
    case AST_NODE_TYPES.TSEnumMember:
      return hasAwait(node.initializer);

    case AST_NODE_TYPES.ArrayExpression:
      return node.elements.some((elt) => hasAwait(elt));

    case AST_NODE_TYPES.BinaryExpression:
      return hasAwait(node.left) || hasAwait(node.right);

    case AST_NODE_TYPES.UpdateExpression:
      return hasAwait(node.argument);

    case AST_NODE_TYPES.Property:
      return hasAwait(node.key) || hasAwait(node.value);

    case AST_NODE_TYPES.ObjectExpression:
      return node.properties.some((prop) => hasAwait(prop));

    case AST_NODE_TYPES.VariableDeclaration:
      return node.declarations.some((decl) => hasAwait(decl));

    case AST_NODE_TYPES.AssignmentExpression:
      return hasAwait(node.right);

    case AST_NODE_TYPES.VariableDeclarator:
      return hasAwait(node.init);

    case AST_NODE_TYPES.MemberExpression:
      return hasAwait(node.object) || hasAwait(node.property);

    case AST_NODE_TYPES.ExportNamedDeclaration:
      return hasAwait(node.declaration);

    case AST_NODE_TYPES.Identifier:
    case AST_NODE_TYPES.Literal:
    case AST_NODE_TYPES.TSInterfaceDeclaration:
    case AST_NODE_TYPES.ClassBody:
    case AST_NODE_TYPES.ClassDeclaration:
    case AST_NODE_TYPES.ClassExpression:
    case AST_NODE_TYPES.MethodDefinition:
    case AST_NODE_TYPES.FunctionDeclaration:
    case AST_NODE_TYPES.FunctionExpression:
    case AST_NODE_TYPES.ArrowFunctionExpression:
    case AST_NODE_TYPES.BreakStatement:
    case AST_NODE_TYPES.ContinueStatement:
    case AST_NODE_TYPES.DebuggerStatement:
    case AST_NODE_TYPES.EmptyStatement:
    case AST_NODE_TYPES.ImportSpecifier:
    case AST_NODE_TYPES.ImportAttribute:
    case AST_NODE_TYPES.ImportDeclaration:
    case AST_NODE_TYPES.ImportDefaultSpecifier:
    case AST_NODE_TYPES.ImportNamespaceSpecifier:
    case AST_NODE_TYPES.ImportExpression:
    case AST_NODE_TYPES.ExportAllDeclaration:
    case AST_NODE_TYPES.ExportSpecifier:
    case AST_NODE_TYPES.ExportDefaultDeclaration:
      return false;

    /* v8 ignore next -- @preserve */
    default:
      if (process.env['NODE_ENV'] === 'test') {
        console.error(node.type);
      }
      return true;
  }
}
