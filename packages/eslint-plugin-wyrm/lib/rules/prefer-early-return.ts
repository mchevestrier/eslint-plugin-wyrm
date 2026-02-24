import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';
import { negateExpression } from '../utils/negateExpression.js';

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
        'Add an early return statement to avoid nesting code in the else branch',
      preferReversedEarlyReturn:
        'Reverse this condition and use an early return to avoid nesting code',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      FunctionDeclaration: checkBody,
      FunctionExpression: checkBody,
      ArrowFunctionExpression: checkBody,
    };

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

      const { consequent, alternate } = ifStatement;

      if (body.length === 1 && !alternate) {
        const MAXIMUM_CONSEQUENT_VOLUME = 1;
        const consequentVolume = computeStatementVolume(ifStatement.consequent);
        if (consequentVolume <= MAXIMUM_CONSEQUENT_VOLUME) return;

        context.report({
          node: ifStatement,
          messageId: 'preferReversedEarlyReturn',
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

      if (ifStatement === body.at(-1) && alternate && neverReturns(ifStatement)) {
        const MAXIMUM_VOLUME = 1;
        const consequentVolume = computeStatementVolume(ifStatement.consequent);
        const alternateVolume = computeStatementVolume(ifStatement.alternate);
        if (consequentVolume <= MAXIMUM_VOLUME && alternateVolume <= MAXIMUM_VOLUME) {
          return;
        }

        context.report({
          node: ifStatement,
          messageId: 'preferEarlyReturn',
          *fix(fixer) {
            if (consequent.type !== AST_NODE_TYPES.BlockStatement) {
              const baseIndent = ' '.repeat(ifStatement.loc.start.column);
              const indent = `${baseIndent}${' '.repeat(2)}`;

              yield fixer.replaceText(
                consequent,
                `{\n${indent}${context.sourceCode.getText(consequent)}\n${indent}return;\n${baseIndent}}`,
              );
              return;
            }

            const token = context.sourceCode.getLastToken(consequent);

            /* v8 ignore if -- @preserve */
            if (!token) {
              const msg = `[wyrm] No last token found for ${context.sourceCode.getText(consequent)}`;
              console.error(msg);
              return;
            }

            const baseIndent = ' '.repeat(ifStatement.loc.start.column);
            yield fixer.insertTextBefore(token, `  return;\n${baseIndent}`);
          },
        });
        return;
      }

      const consequentAlwaysReturn = alwaysReturns(consequent);
      const alternateAlwaysReturn = alwaysReturns(alternate);

      const VOLUME_RATIO_THRESHOLD = 2;
      const consequentVolume = computeStatementVolume(consequent);
      const alternateVolume = computeStatementVolume(alternate);

      const shouldSwitchConsequentAndAlternate =
        // Alternate statement always returns,
        alternateAlwaysReturn &&
        // But not the consequent statement
        (!consequentAlwaysReturn ||
          // Or the consequent statement contains much more nested code than the alternate
          (consequentVolume / alternateVolume >= VOLUME_RATIO_THRESHOLD &&
            consequentVolume > 4));

      if (alternate && shouldSwitchConsequentAndAlternate) {
        context.report({
          node: ifStatement,
          messageId: 'preferReversedEarlyReturn',
          *fix(fixer) {
            const testText = context.sourceCode.getText(ifStatement.test);
            yield fixer.replaceText(ifStatement.test, `!(${testText})`);

            const alternateText = context.sourceCode.getText(alternate);
            yield fixer.replaceText(consequent, alternateText);
            yield fixer.remove(alternate);

            const consequentText = context.sourceCode.getText(consequent);
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

      if (shouldSwitchConsequentAndSubsequent && !alternate) {
        context.report({
          node: ifStatement,
          messageId: 'preferReversedEarlyReturn',
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
              consequent,
              `{\n${indent2}${subsequentText}\n${indent}}`,
            );

            const consequentText = context.sourceCode.getText(consequent);
            yield fixer.insertTextAfter(ifStatement, ` else ${consequentText}`);

            const negatedTestText = negateExpression(ifStatement.test, context);
            yield fixer.replaceText(ifStatement.test, negatedTestText);
          },
        });
      }
    }
  },
});

function alwaysReturns(stmt: TSESTree.Statement | null | undefined): boolean {
  if (stmt == null) return false;

  switch (stmt.type) {
    case AST_NODE_TYPES.ReturnStatement:
      return true;

    case AST_NODE_TYPES.BlockStatement:
      return stmt.body.some((s) => alwaysReturns(s));

    case AST_NODE_TYPES.IfStatement:
      return alwaysReturns(stmt.consequent) && alwaysReturns(stmt.alternate);

    case AST_NODE_TYPES.SwitchStatement:
      return stmt.cases.flatMap((c) => c.consequent).every((c) => alwaysReturns(c));

    case AST_NODE_TYPES.ForInStatement:
    case AST_NODE_TYPES.ForOfStatement:
    case AST_NODE_TYPES.ForStatement:
    case AST_NODE_TYPES.WhileStatement:
    case AST_NODE_TYPES.DoWhileStatement:
      return alwaysReturns(stmt.body);

    case AST_NODE_TYPES.TryStatement: {
      if (stmt.finalizer && alwaysReturns(stmt.finalizer)) {
        return true;
      }
      return alwaysReturns(stmt.block) && alwaysReturns(stmt.handler?.body);
    }

    default:
      return false;
  }
}

function neverReturns(stmt: TSESTree.Statement | null | undefined): boolean {
  if (stmt == null) return true;

  switch (stmt.type) {
    case AST_NODE_TYPES.ReturnStatement:
      return false;

    case AST_NODE_TYPES.BlockStatement:
      return stmt.body.every((s) => neverReturns(s));

    case AST_NODE_TYPES.ForInStatement:
    case AST_NODE_TYPES.ForOfStatement:
    case AST_NODE_TYPES.ForStatement:
    case AST_NODE_TYPES.WhileStatement:
    case AST_NODE_TYPES.DoWhileStatement:
      return neverReturns(stmt.body);

    case AST_NODE_TYPES.IfStatement:
      return neverReturns(stmt.consequent) && neverReturns(stmt.alternate);

    case AST_NODE_TYPES.TryStatement:
      return (
        neverReturns(stmt.block) &&
        neverReturns(stmt.handler?.body) &&
        neverReturns(stmt.finalizer)
      );

    default:
      return true;
  }
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
