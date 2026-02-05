import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { compareTokens } from '../utils/compareTokens.js';
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
    function getTokensForStatements(stmts: TSESTree.Statement[]): TSESTree.Token[] {
      const normalized = normalizeStatements(stmts);
      return normalized.flatMap((stmt) => context.sourceCode.getTokens(stmt));
    }

    function compareStatementLists(
      a: TSESTree.Statement[],
      b: TSESTree.Statement[],
    ): boolean {
      return compareTokens(getTokensForStatements(a), getTokensForStatements(b));
    }

    function compareStatements(
      a: TSESTree.Statement[] | TSESTree.Statement,
      b: TSESTree.Statement[] | TSESTree.Statement,
    ): boolean {
      return compareStatementLists(getStatements(a), getStatements(b));
    }

    function checkStatements(
      ifStatement: TSESTree.IfStatement,
      subsequentStatements: TSESTree.Statement[],
    ) {
      if (ifStatement.alternate) return;

      if (!alwaysReturns(ifStatement.consequent)) return;

      const same = compareStatements(ifStatement.consequent, subsequentStatements);
      if (!same) return;

      context.report({ node: ifStatement, messageId: 'noDuplicatedReturn' });

      const lastStatement = subsequentStatements.at(-1);
      /* v8 ignore else -- @preserve */
      if (lastStatement) {
        context.report({ node: lastStatement, messageId: 'noDuplicatedReturn' });
      }
    }

    function checkBody(
      node:
        | TSESTree.FunctionDeclaration
        | TSESTree.FunctionExpression
        | TSESTree.ArrowFunctionExpression,
    ) {
      if (node.body.type !== AST_NODE_TYPES.BlockStatement) return;
      const { body } = node.body;

      for (const stmt of body) {
        if (stmt.type !== AST_NODE_TYPES.IfStatement) continue;
        const subsequentStatements = body.slice(body.indexOf(stmt) + 1);

        checkStatements(stmt, subsequentStatements);
      }
    }

    return {
      FunctionDeclaration: checkBody,
      FunctionExpression: checkBody,
      ArrowFunctionExpression: checkBody,
    };
  },
});

function normalizeStatements(stmts: TSESTree.Statement[]): TSESTree.Statement[] {
  return stmts.flatMap((stmt) => {
    if (stmt.type === AST_NODE_TYPES.ReturnStatement && stmt.argument === null) {
      return [];
    }
    return [stmt];
  });
}

function getStatements(stmt: TSESTree.Statement[] | TSESTree.Statement) {
  if (Array.isArray(stmt)) return stmt;
  if (stmt.type === AST_NODE_TYPES.BlockStatement) return stmt.body;
  return [stmt];
}

function alwaysReturns(stmt: TSESTree.Statement | null | undefined): boolean {
  if (stmt == null) return false;

  switch (stmt.type) {
    case AST_NODE_TYPES.ReturnStatement:
      return true;

    case AST_NODE_TYPES.BlockStatement:
      return stmt.body.some((s) => alwaysReturns(s));

    case AST_NODE_TYPES.IfStatement:
      if (stmt.alternate && !alwaysReturns(stmt.alternate)) return false;
      return alwaysReturns(stmt.consequent);

    case AST_NODE_TYPES.SwitchStatement:
      return stmt.cases.flatMap((c) => c.consequent).every((c) => alwaysReturns(c));

    case AST_NODE_TYPES.ForInStatement:
    case AST_NODE_TYPES.ForOfStatement:
    case AST_NODE_TYPES.ForStatement:
    case AST_NODE_TYPES.WhileStatement:
    case AST_NODE_TYPES.DoWhileStatement:
      return alwaysReturns(stmt.body);

    case AST_NODE_TYPES.TryStatement: {
      if (alwaysReturns(stmt.finalizer)) {
        return true;
      }
      if (stmt.handler && !alwaysReturns(stmt.handler.body)) return false;
      return alwaysReturns(stmt.block);
    }

    default:
      return false;
  }
}
