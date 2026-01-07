/**
 * @fileoverview
 *
 * This rule is similar to the base `no-else-return` rule, except it also checks `else if` statements by default (just like with the `allowElseIf: false` option enabled in the base rule).
 *
 * @example
 * ```ts
 * function fun(n: number) {
 *   if (!n) return;
 *   else if (n === 3) console.log('foo'); // Unnecessary `else` here
 * }
 * ```
 */

import path from 'node:path';

import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid unnecessary `else` block after a `return` statement',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noElseReturn: 'Remove this unnecessary else',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      IfStatement(node) {
        const { alternate } = node;
        if (!alternate) return;
        if (!alwaysReturns(node.consequent)) return;

        context.report({
          node: alternate,
          messageId: 'noElseReturn',
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
