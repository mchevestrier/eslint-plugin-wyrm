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
      description: 'Require early returns when possible',
      strict: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferEarlyReturn:
        'Reverse this condition and use an early return to avoid nesting code',
    },
  },
  defaultOptions: [],
  create(context) {
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

      if (body.length === 1 && !ifStatement.alternate) {
        const MAXIMUM_CONSEQUENT_VOLUME = 1;
        const consequentVolume = computeStatementVolume(ifStatement.consequent);
        if (consequentVolume <= MAXIMUM_CONSEQUENT_VOLUME) return;

        context.report({
          node: ifStatement,
          messageId: 'preferEarlyReturn',
          *fix(fixer) {
            const testText = context.sourceCode.getText(ifStatement.test);
            yield fixer.replaceText(ifStatement.test, `!(${testText})`);

            yield fixer.replaceText(ifStatement.consequent, '{ return; } else ');

            const consequentText = context.sourceCode.getText(ifStatement.consequent);
            yield fixer.insertTextAfter(ifStatement, consequentText);
          },
        });
        return;
      }

      const consequentAlwaysReturn = alwaysReturns(ifStatement.consequent);
      const alternateAlwaysReturn = alwaysReturns(ifStatement.alternate);

      const VOLUME_RATIO_THRESHOLD = 2;
      const consequentVolume = computeStatementVolume(ifStatement.consequent);
      const alternateVolume = computeStatementVolume(ifStatement.alternate);

      const shouldSwitchConsequentAndAlternate =
        // Alternate statement always returns,
        alternateAlwaysReturn &&
        // But not the consequent statement
        (!consequentAlwaysReturn ||
          // Or the consequent statement contains much more nested code than the alternate
          (consequentVolume / alternateVolume >= VOLUME_RATIO_THRESHOLD &&
            consequentVolume > 4));

      const { alternate } = ifStatement;

      if (alternate && shouldSwitchConsequentAndAlternate) {
        context.report({
          node: ifStatement,
          messageId: 'preferEarlyReturn',
          *fix(fixer) {
            const testText = context.sourceCode.getText(ifStatement.test);
            yield fixer.replaceText(ifStatement.test, `!(${testText})`);

            const alternateText = context.sourceCode.getText(alternate);
            yield fixer.replaceText(ifStatement.consequent, alternateText);
            yield fixer.remove(alternate);

            const consequentText = context.sourceCode.getText(ifStatement.consequent);
            yield fixer.insertTextAfter(ifStatement, consequentText);
          },
        });
        return;
      }

      const returnStatement = body.findLast(
        (stmt) => stmt.type === AST_NODE_TYPES.ReturnStatement,
      );

      if (!returnStatement) return;

      const ifStatementIndex = body.indexOf(ifStatement);
      const returnStatementIndex = body.indexOf(returnStatement);
      const subsequentStatements = body.slice(
        ifStatementIndex + 1,
        returnStatementIndex + 1,
      );

      const firstSubsequentStatement = subsequentStatements.at(0);
      const lastSubsequentStatement = subsequentStatements.at(-1);
      /* v8 ignore if -- @preserve */
      if (!firstSubsequentStatement || !lastSubsequentStatement) return;

      const subsequentVolume = subsequentStatements.reduce(
        (acc, s) => acc + computeStatementVolume(s),
        0,
      );

      // The consequent statement contains much more nested code than the subsequent statements
      const shouldSwitchConsequentAndSubsequent =
        consequentVolume / subsequentVolume >= VOLUME_RATIO_THRESHOLD &&
        consequentVolume > 4;

      if (shouldSwitchConsequentAndSubsequent && !ifStatement.alternate) {
        context.report({
          node: ifStatement,
          messageId: 'preferEarlyReturn',
          *fix(fixer) {
            yield fixer.removeRange([
              firstSubsequentStatement.range[0],
              lastSubsequentStatement.range[1],
            ]);

            const indent = ' '.repeat(ifStatement.loc.start.column);
            const indent2 = `${indent}${' '.repeat(2)}`;

            const subsequentText = subsequentStatements
              .map((stmt) => context.sourceCode.getText(stmt))
              .join(`\n${indent2}`);
            yield fixer.replaceText(
              ifStatement.consequent,
              `{\n${indent2}${subsequentText}\n${indent}}`,
            );

            const consequentText = context.sourceCode.getText(ifStatement.consequent);
            yield fixer.insertTextAfter(ifStatement, ` else ${consequentText}`);

            const testText = context.sourceCode.getText(ifStatement.test);
            yield fixer.replaceText(ifStatement.test, `!(${testText})`);
          },
        });
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

  if (stmt.type !== AST_NODE_TYPES.TryStatement) return false;

  if (!stmt.finalizer) {
    return alwaysReturns(stmt.block) && alwaysReturns(stmt.handler?.body);
  }

  if (alwaysReturns(stmt.finalizer)) return true;

  return alwaysReturns(stmt.block) && alwaysReturns(stmt.handler?.body);
}

/** A subjective indicator of how nested some code is */
function computeStatementVolume(stmt: TSESTree.Statement | null): number {
  if (stmt === null) return 0;

  switch (stmt.type) {
    case AST_NODE_TYPES.BlockStatement:
      return stmt.body.reduce((acc, s) => acc + computeStatementVolume(s), 0);

    case AST_NODE_TYPES.IfStatement:
      return (
        3 +
        computeStatementVolume(stmt.consequent) +
        computeStatementVolume(stmt.alternate)
      );

    case AST_NODE_TYPES.TryStatement:
      return (
        3 +
        computeStatementVolume(stmt.block) +
        computeStatementVolume(stmt.handler?.body ?? null) +
        computeStatementVolume(stmt.finalizer)
      );

    case AST_NODE_TYPES.DoWhileStatement:
    case AST_NODE_TYPES.WhileStatement:
    case AST_NODE_TYPES.ForStatement:
    case AST_NODE_TYPES.ForInStatement:
    case AST_NODE_TYPES.ForOfStatement:
      return 3 + computeStatementVolume(stmt.body);

    default:
      return 1;
  }
}
