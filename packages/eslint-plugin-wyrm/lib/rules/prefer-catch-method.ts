import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ASTUtils } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce usage of `Promise.prototype.catch()` when it improves readability',
      recommended: true,
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      preferCatchMethod:
        'Prefer the `Promise.prototype.catch()` method to avoid imperative patterns',
      useCatchMethod: 'Replace by `.catch()`',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      TryStatement(node) {
        const { block, handler, finalizer } = node;

        if (!handler) return;

        function hasReturnStatement(body: TSESTree.Statement[]) {
          return body.some((stmt) => stmt.type === AST_NODE_TYPES.ReturnStatement);
        }

        function getAssignments(body: TSESTree.Statement[]) {
          const assignments: TSESTree.AssignmentExpression[] = [];
          for (const stmt of body) {
            if (stmt.type !== AST_NODE_TYPES.ExpressionStatement) continue;
            if (stmt.expression.type !== AST_NODE_TYPES.AssignmentExpression) continue;
            assignments.push(stmt.expression);
          }
          return assignments;
        }

        if (hasReturnStatement(handler.body.body)) return;
        if (finalizer && hasReturnStatement(finalizer.body)) return;

        const blockAssignments = getAssignments(block.body);

        const [firstBlockAssignment, ...otherBlockAssignments] = blockAssignments;
        if (!firstBlockAssignment) return;
        if (firstBlockAssignment.right.type !== AST_NODE_TYPES.AwaitExpression) return;

        if (
          otherBlockAssignments.some(
            (assignment) => assignment.right.type === AST_NODE_TYPES.AwaitExpression,
          )
        ) {
          return;
        }

        if (firstBlockAssignment.left.type !== AST_NODE_TYPES.Identifier) return;
        const variableName = firstBlockAssignment.left.name;

        const handlerAssignments = getAssignments(handler.body.body);

        const handlerAssignment = handlerAssignments.find(
          (assignment) =>
            assignment.left.type === AST_NODE_TYPES.Identifier &&
            assignment.left.name === variableName,
        );
        if (!handlerAssignment) return;

        const scope = context.sourceCode.getScope(node);
        const variable = ASTUtils.findVariable(scope, variableName);
        if (!variable) return;
        if (variable.scope !== scope) return;

        const def = variable.defs.at(-1);
        if (!def) return;
        if (def.node.type !== AST_NODE_TYPES.VariableDeclarator) return;
        if (def.node.parent.kind !== 'let') return;
        const decl = def.node;

        if (
          variable.references.some(
            (ref) => ref.isRead() && ref.identifier.range[1] < node.range[0],
          )
        ) {
          return;
        }

        const indent = ' '.repeat(node.loc.start.column + 2);
        const indent2 = `${indent}${' '.repeat(2)}`;

        function isNameInScope(
          identifierName: string,
          currentScope = context.sourceCode.getScope(block),
        ) {
          if (currentScope.variables.some((v) => v.name === identifierName)) return true;
          if (!currentScope.upper) return false;
          return isNameInScope(identifierName, currentScope.upper);
        }

        function getFreeVariableName(n = 0) {
          const identifierName = `val${n}`;
          if (isNameInScope(identifierName)) return getFreeVariableName(n + 1);
          return identifierName;
        }

        function getAwaitThenExpression() {
          if (!firstBlockAssignment) return '';
          const awaitExpression = context.sourceCode.getText(firstBlockAssignment.right);
          const otherStatements = block.body.filter(
            (stmt) =>
              stmt.type !== AST_NODE_TYPES.ExpressionStatement ||
              stmt.expression !== firstBlockAssignment,
          );
          if (!otherStatements.length) return awaitExpression;
          const statementsText = otherStatements
            .map((stmt) => context.sourceCode.getText(stmt))
            .join(`\n${indent2}`);

          const resultParamName = getFreeVariableName();

          return `${awaitExpression}
${indent}.then((${resultParamName}) => {
${indent2}${statementsText}
${indent2}return ${resultParamName};
${indent}})`;
        }

        function getErrorParameter() {
          if (!handler) return '';
          const { param } = handler;
          if (!param) return '';

          const paramText = context.sourceCode.getText(param);
          if (param.typeAnnotation) return paramText;
          return `${paramText}: unknown`;
        }

        function getHandlerText() {
          if (!handler) return '';
          if (!handlerAssignment) return '';

          const handlerAssignmentValue = context.sourceCode.getText(
            handlerAssignment.right,
          );
          const handlerAssignmentText = `${indent}return ${handlerAssignmentValue};`;

          const statements = handler.body.body.filter(
            (stmt) =>
              stmt.type !== AST_NODE_TYPES.ExpressionStatement ||
              stmt.expression !== handlerAssignment,
          );

          if (!statements.length) return handlerAssignmentText;

          const statementsText = statements
            .map((stmt) => context.sourceCode.getText(stmt))
            .join(`\n${indent2}`);

          return `${indent}${statementsText}\n${indent}${handlerAssignmentText}`;
        }

        context.report({
          node,
          messageId: 'preferCatchMethod',
          suggest: [
            {
              messageId: 'useCatchMethod',
              *fix(fixer) {
                if (decl.parent.declarations.length > 1) {
                  yield fixer.remove(decl);
                } else {
                  yield fixer.remove(decl.parent);
                }

                const errorParam = getErrorParameter();
                const handlerText = getHandlerText();
                const awaitThenExpression = getAwaitThenExpression();

                yield fixer.remove(node);
                yield fixer.insertTextBefore(
                  node,
                  `let ${variableName} = ${awaitThenExpression}\n${indent}.catch((${errorParam}) => {\n  ${handlerText}\n  });`,
                );
              },
            },
          ],
        });
      },
    };
  },
});
