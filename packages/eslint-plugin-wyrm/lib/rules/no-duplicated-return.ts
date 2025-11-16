import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, AST_TOKEN_TYPES } from '@typescript-eslint/utils';

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

function compareTokens(tokensA: TSESTree.Token[], tokensB: TSESTree.Token[]): boolean {
  const [a, ...restA] = tokensA;
  const [b, ...restB] = tokensB;

  if (a === undefined && b === undefined) return true;

  if (a === undefined) return false;
  if (b === undefined) return false;

  if (!areTokensEqual(a, b)) {
    return false;
  }

  return compareTokens(restA, restB);
}

function areTokensEqual(a: TSESTree.Token, b: TSESTree.Token): boolean {
  if (a.type !== b.type) return false;

  if (a.type === AST_TOKEN_TYPES.String) {
    return a.value.slice(1, -1) === b.value.slice(1, -1);
  }

  return a.value === b.value;
}

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
  if (stmt == null) return true;

  if (stmt.type === AST_NODE_TYPES.ReturnStatement) return true;

  if (stmt.type === AST_NODE_TYPES.BlockStatement) {
    return stmt.body.some((s) => alwaysReturns(s));
  }

  if (stmt.type === AST_NODE_TYPES.IfStatement) {
    return alwaysReturns(stmt.consequent) && alwaysReturns(stmt.alternate);
  }

  if (stmt.type !== AST_NODE_TYPES.TryStatement) return false;

  if (!stmt.finalizer) {
    return alwaysReturns(stmt.block) && alwaysReturns(stmt.handler?.body);
  }

  if (alwaysReturns(stmt.finalizer)) return true;

  return alwaysReturns(stmt.block) && alwaysReturns(stmt.handler?.body);
}
