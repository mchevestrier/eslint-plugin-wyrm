import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce directly returning a value instead of conditionally assigning it first to a variable',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferDirectReturn:
        'Directly return the value instead of conditionally assigning it',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      IfStatement(node) {
        if (node.parent.type !== AST_NODE_TYPES.BlockStatement) return;
        const idx = node.parent.body.indexOf(node);
        const nextNeighbor = node.parent.body.at(idx + 1);
        if (!nextNeighbor) return;
        if (nextNeighbor.type !== AST_NODE_TYPES.ReturnStatement) return;
        if (!nextNeighbor.argument) return;
        if (nextNeighbor.argument.type !== AST_NODE_TYPES.Identifier) return;
        const ident = nextNeighbor.argument;

        for (const branch of getAllIfBranches(node)) {
          checkBranch(ident, branch);
        }
      },
    };

    function checkBranch(ident: TSESTree.Identifier, branch: TSESTree.Statement) {
      const stmt =
        branch.type === AST_NODE_TYPES.BlockStatement ? branch.body.at(-1) : branch;
      if (!stmt) return;
      if (stmt.type !== AST_NODE_TYPES.ExpressionStatement) return;
      if (stmt.expression.type !== AST_NODE_TYPES.AssignmentExpression) return;
      if (stmt.expression.operator !== '=') return;
      if (stmt.expression.left.type !== AST_NODE_TYPES.Identifier) return;
      if (stmt.expression.left.name !== ident.name) return;

      const value = stmt.expression.right;

      context.report({
        node: stmt,
        messageId: 'preferDirectReturn',
        fix(fixer) {
          const txt = context.sourceCode.getText(value);
          return fixer.replaceText(stmt, `return ${txt};`);
        },
      });
    }
  },
});

function* getAllIfBranches(
  ifStatement: TSESTree.IfStatement,
): Generator<TSESTree.Statement, void, void> {
  yield ifStatement.consequent;
  if (!ifStatement.alternate) return;

  if (ifStatement.alternate.type === AST_NODE_TYPES.IfStatement) {
    yield* getAllIfBranches(ifStatement.alternate);
  } else {
    yield ifStatement.alternate;
  }
}
