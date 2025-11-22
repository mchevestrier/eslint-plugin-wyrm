import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import type * as ts from 'typescript';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid returning values in void-returning callbacks',
      strict: true,
      requiresTypeChecking: true,
    },
    schema: [],
    messages: {
      noReturnToVoid: 'Maybe you do not need to return a value here',
    },
  },
  defaultOptions: [],
  create(context) {
    function checkVoidOnlyFunction(
      fn: TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression,
    ): void {
      if (fn.body.type !== AST_NODE_TYPES.BlockStatement) {
        context.report({ node: fn.body, messageId: 'noReturnToVoid' });
        return;
      }

      const stmts = getAllReturnStatements(fn.body);

      for (const stmt of stmts) {
        if (stmt.argument === null) continue;

        context.report({ node: stmt, messageId: 'noReturnToVoid' });
      }
    }

    return {
      CallExpression(node) {
        const [arg] = node.arguments;
        if (!arg) return;

        if (!isFunctionExpression(arg)) return;

        const services = ESLintUtils.getParserServices(context);
        const checker = services.program.getTypeChecker();

        if (calleeOnlyAcceptsVoidReturningCallback(node.callee)) {
          checkVoidOnlyFunction(arg);
        }

        function isVoidReturningCallback(callbackType: ts.Type): boolean {
          const callbackSignatures = callbackType.getCallSignatures();
          const [sig] = callbackSignatures;
          if (!sig) return false;

          const callbackReturnType = sig.getReturnType();

          const voidType = checker.getVoidType();

          return callbackReturnType === voidType;
        }

        function signatureOnlyHasVoidReturningCallback(sig: ts.Signature): boolean {
          const params = sig.getParameters();

          const [callbackParam] = params;
          if (!callbackParam) return false;

          const callbackType = checker.getTypeOfSymbol(callbackParam);
          return isVoidReturningCallback(callbackType);
        }

        function calleeOnlyAcceptsVoidReturningCallback(
          callee: TSESTree.Expression,
        ): boolean {
          const type = services.getTypeAtLocation(callee);
          const signatures = getCallSignatures(type);
          if (!signatures.length) return false;

          return signatures.every((sig) => signatureOnlyHasVoidReturningCallback(sig));
        }
      },
    };
  },
});

function getCallSignatures(type: ts.Type): readonly ts.Signature[] {
  if (!type.isUnion()) return type.getCallSignatures();
  return type.types.flatMap((t) => getCallSignatures(t));
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

    case AST_NODE_TYPES.TryStatement:
      return [
        ...getAllReturnStatements(node.block),
        ...getAllReturnStatements(node.handler),
        ...getAllReturnStatements(node.finalizer),
      ].flat();

    case AST_NODE_TYPES.CatchClause:
      return getAllReturnStatements(node.body);

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

function isFunctionExpression(
  node: TSESTree.Node,
): node is TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression {
  if (node.type === AST_NODE_TYPES.FunctionExpression) return true;
  if (node.type === AST_NODE_TYPES.ArrowFunctionExpression) return true;
  return false;
}
