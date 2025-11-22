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

        const scope = context.sourceCode.getScope(node);
        const variable = ASTUtils.findVariable(scope, variableName);
        if (!variable) return;
        if (variable.scope !== scope) return;

        const def = variable.defs.at(-1);
        /** v8 ignore if -- @preserve */
        if (!def) return;
        if (def.node.type !== AST_NODE_TYPES.VariableDeclarator) return;
        if (def.node.parent.kind !== 'let') return;
        const decl = def.node;

        const typeAnnotation = def.node.id.typeAnnotation
          ? context.sourceCode.getText(def.node.id.typeAnnotation)
          : '';

        if (
          variable.references.some(
            (ref) => ref.isRead() && ref.identifier.range[1] < node.range[0],
          )
        ) {
          return;
        }

        const fallbackValue = handlerAssignment?.right ?? decl.init ?? undefined;

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
          /* v8 ignore if -- @preserve */
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
          /* v8 ignore if -- @preserve */
          if (!handler) return '';
          const { param } = handler;
          if (!param) return '';

          const paramText = context.sourceCode.getText(param);
          if (param.typeAnnotation) return paramText;
          return `${paramText}: unknown`;
        }

        function getHandlerText() {
          const fallbackValueText = fallbackValue
            ? context.sourceCode.getText(fallbackValue)
            : 'undefined';
          const handlerAssignmentText = `${indent}return ${fallbackValueText};`;

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const statements = handler!.body.body.filter(
            (stmt) =>
              stmt.type !== AST_NODE_TYPES.ExpressionStatement ||
              !handlerAssignment ||
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
                  // Preserve multiple inline declarations
                  yield fixer.remove(decl);

                  const declIndex = decl.parent.declarations.findIndex(
                    (d) => d.id === decl.id,
                  );
                  if (declIndex === 0) {
                    const commaToken = context.sourceCode.getTokenAfter(decl);
                    /* v8 ignore else -- @preserve */
                    if (commaToken) yield fixer.remove(commaToken);
                  } else {
                    const commaToken = context.sourceCode.getTokenBefore(decl);
                    /* v8 ignore else -- @preserve */
                    if (commaToken) yield fixer.remove(commaToken);
                  }
                } else {
                  yield fixer.remove(decl.parent);
                }

                const errorParam = getErrorParameter();
                const handlerText = getHandlerText();
                const awaitThenExpression = getAwaitThenExpression();

                const declarationText = `let ${variableName}${typeAnnotation}`;

                yield fixer.remove(node);
                yield fixer.insertTextBefore(
                  node,
                  `${declarationText} = ${awaitThenExpression}\n${indent}.catch((${errorParam}) => {\n  ${handlerText}\n  });`,
                );
              },
            },
          ],
        });
      },
    };
  },
});
