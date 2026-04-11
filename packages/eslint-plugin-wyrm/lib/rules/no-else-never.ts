import path from 'node:path';

import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import type {
  ParserServicesWithTypeInformation,
  TSESTree,
} from '@typescript-eslint/utils';
import ts from 'typescript';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Forbid unnecessary `else` block after an expression that never returns',
      strict: true,
      requiresTypeChecking: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noElseNever: 'Remove this unnecessary else',
    },
  },
  defaultOptions: [],
  create(context) {
    let services: ParserServicesWithTypeInformation | undefined;
    function getServices() {
      services ??= ESLintUtils.getParserServices(context);
      return services;
    }

    return {
      IfStatement(node) {
        const { alternate } = node;
        if (!alternate) return;

        if (!alwaysReturnsNever(node.consequent)) return;

        context.report({
          node: alternate,
          messageId: 'noElseNever',
          *fix(fixer) {
            const firstToken = context.sourceCode.getTokenBefore(alternate);
            /* v8 ignore else -- @preserve */
            if (firstToken) yield fixer.remove(firstToken);
            yield fixer.remove(alternate);

            if (alternate.type === AST_NODE_TYPES.BlockStatement) {
              const indent = ' '.repeat(node.loc.start.column);
              const bodyText = alternate.body
                .map((stmt) => context.sourceCode.getText(stmt))
                .join(`\n${indent}`);
              yield fixer.insertTextAfter(node, `\n${indent}${bodyText}`);
              return;
            }

            const bodyText = context.sourceCode.getText(alternate);
            yield fixer.insertTextAfter(node, bodyText);
          },
        });
      },
    };

    function expressionReturnsNever(stmt: TSESTree.ExpressionStatement): boolean {
      const type = getServices().getTypeAtLocation(stmt.expression);
      return !!(type.flags & ts.TypeFlags.Never);
    }

    function alwaysReturnsNever(stmt: TSESTree.Statement | null | undefined): boolean {
      if (stmt == null) return false;

      switch (stmt.type) {
        case AST_NODE_TYPES.ExpressionStatement:
          return expressionReturnsNever(stmt);

        case AST_NODE_TYPES.ReturnStatement:
          return false;

        case AST_NODE_TYPES.BlockStatement:
          return stmt.body.some((s) => alwaysReturnsNever(s));

        case AST_NODE_TYPES.IfStatement:
          return (
            alwaysReturnsNever(stmt.consequent) && alwaysReturnsNever(stmt.alternate)
          );

        case AST_NODE_TYPES.SwitchStatement:
          return stmt.cases
            .flatMap((c) => c.consequent)
            .every((c) => alwaysReturnsNever(c));

        case AST_NODE_TYPES.ForInStatement:
        case AST_NODE_TYPES.ForOfStatement:
        case AST_NODE_TYPES.ForStatement:
        case AST_NODE_TYPES.WhileStatement:
        case AST_NODE_TYPES.DoWhileStatement:
          return alwaysReturnsNever(stmt.body);

        case AST_NODE_TYPES.TryStatement: {
          if (alwaysReturnsNever(stmt.finalizer)) {
            return true;
          }
          return alwaysReturnsNever(stmt.block) && alwaysReturnsNever(stmt.handler?.body);
        }

        default:
          return false;
      }
    }
  },
});
