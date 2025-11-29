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
      description: 'Forbid returning `undefined` in void-returning callbacks',
      strict: true,
      requiresTypeChecking: true,
    },
    schema: [],
    messages: {
      noArrowReturnToVoid:
        'Make sure that this arrow function cannot just use an empty body (`{}`) instead of returning `undefined`',
      noUselessReturnUndefined:
        'Maybe you can omit the returned value and just use an empty return statement here',
    },
  },
  defaultOptions: [],
  create(context) {
    function checkFunction(
      fn: TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression,
    ): void {
      if (fn.body.type !== AST_NODE_TYPES.BlockStatement) {
        if (fn.body.type !== AST_NODE_TYPES.Identifier) return;

        if (isUndefinedLiteral(fn.body)) {
          context.report({ node: fn.body, messageId: 'noArrowReturnToVoid' });
        }

        return;
      }

      const stmts = getAllReturnStatements(fn.body);

      if (stmts.some((stmt) => !isVoidLikeReturnArgument(stmt.argument))) return;

      for (const stmt of stmts) {
        if (stmt.argument === null) continue;

        context.report({ node: stmt, messageId: 'noUselessReturnUndefined' });
      }
    }

    return {
      CallExpression(node) {
        const [arg] = node.arguments;
        if (!arg) return;

        if (!isFunctionExpression(arg)) return;

        const services = ESLintUtils.getParserServices(context);
        const checker = services.program.getTypeChecker();

        if (!calleeAcceptsVoidReturningCallback(node.callee)) return;

        checkFunction(arg);

        function hasVoidReturningCallback(callbackType: ts.Type): boolean {
          const callbackSignatures = callbackType.getCallSignatures();
          const [sig] = callbackSignatures;
          if (!sig) return false;

          const callbackReturnType = sig.getReturnType();
          return hasVoid(callbackReturnType);

          function hasVoid(type: ts.Type): boolean {
            const voidType = checker.getVoidType();

            if (type.isUnion()) {
              return type.types.includes(voidType);
            }
            return type === voidType;
          }
        }

        function signatureAcceptsVoidReturningCallback(sig: ts.Signature): boolean {
          const params = sig.getParameters();

          const [callbackParam] = params;
          if (!callbackParam) return false;

          const callbackType = checker.getTypeOfSymbol(callbackParam);
          return hasVoidReturningCallback(callbackType);
        }

        function calleeAcceptsVoidReturningCallback(
          callee: TSESTree.Expression,
        ): boolean {
          const type = services.getTypeAtLocation(callee);
          const signatures = type.getCallSignatures();

          return signatures.some((sig) => signatureAcceptsVoidReturningCallback(sig));
        }
      },
    };
  },
});

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

    default:
      return [];
  }
}

function isUndefinedLiteral(node: TSESTree.Node): boolean {
  return node.type === AST_NODE_TYPES.Identifier && node.name === 'undefined';
}

function isVoidLikeReturnArgument(expr: TSESTree.Expression | null) {
  if (expr === null) return true;
  return isUndefinedLiteral(expr);
}

function isFunctionExpression(
  node: TSESTree.Node,
): node is TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression {
  if (node.type === AST_NODE_TYPES.FunctionExpression) return true;
  if (node.type === AST_NODE_TYPES.ArrowFunctionExpression) return true;
  return false;
}
