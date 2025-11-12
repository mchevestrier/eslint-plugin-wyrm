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
      description: 'Forbid duplicated branches with early returns',
      recommended: true,
    },
    schema: [],
    messages: {
      noDuplicatedReturn: 'Both branches do the same thing',
    },
  },
  defaultOptions: [],
  create(context) {
    function getNormalizedStatement(stmt: TSESTree.Statement): string {
      if (stmt.type === AST_NODE_TYPES.ReturnStatement && stmt.argument === null) {
        return '';
      }

      if (stmt.type !== AST_NODE_TYPES.BlockStatement) {
        return context.sourceCode.getText(stmt).trim();
      }

      return getNormalizedStatements(stmt.body);
    }

    function getNormalizedStatements(stmts: TSESTree.Statement[]): string {
      return stmts
        .map((stmt) => getNormalizedStatement(stmt))
        .join('\n')
        .trim();
    }

    function checkBody(
      node:
        | TSESTree.FunctionDeclaration
        | TSESTree.FunctionExpression
        | TSESTree.ArrowFunctionExpression,
    ) {
      if (node.body.type !== AST_NODE_TYPES.BlockStatement) return;
      const { body } = node.body;

      const ifStatement = body.findLast(
        (stmt) => stmt.type === AST_NODE_TYPES.IfStatement,
      );

      if (!ifStatement) return;
      if (ifStatement.alternate) return;
      const ifStatementIndex = body.indexOf(ifStatement);

      if (!alwaysReturns(ifStatement.consequent)) return;

      const normalizedConsequentStatements = getNormalizedStatement(
        ifStatement.consequent,
      );

      const subsequentStatements = body.slice(ifStatementIndex + 1);
      const normalizedSubsequentStatements =
        getNormalizedStatements(subsequentStatements);

      if (normalizedConsequentStatements !== normalizedSubsequentStatements) return;

      context.report({ node: ifStatement, messageId: 'noDuplicatedReturn' });

      const lastStatement = subsequentStatements.at(-1);
      /* v8 ignore else -- @preserve */
      if (lastStatement) {
        context.report({ node: lastStatement, messageId: 'noDuplicatedReturn' });
      }
    }

    return {
      FunctionDeclaration: checkBody,
      FunctionExpression: checkBody,
      ArrowFunctionExpression: checkBody,
    };
  },
});

function alwaysReturns(stmt: TSESTree.Statement | null | undefined): boolean {
  if (stmt == null) return false;

  if (stmt.type === AST_NODE_TYPES.ReturnStatement) return true;

  if (stmt.type === AST_NODE_TYPES.BlockStatement) {
    return stmt.body.some((s) => alwaysReturns(s));
  }

  if (stmt.type === AST_NODE_TYPES.IfStatement) {
    return alwaysReturns(stmt.consequent) && alwaysReturns(stmt.alternate);
  }

  if (stmt.type === AST_NODE_TYPES.TryStatement) {
    if (!stmt.finalizer) {
      return alwaysReturns(stmt.block) && alwaysReturns(stmt.handler?.body);
    }

    if (alwaysReturns(stmt.finalizer)) return true;

    return alwaysReturns(stmt.block) && alwaysReturns(stmt.handler?.body);
  }

  return false;
}
