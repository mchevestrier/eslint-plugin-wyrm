import path from 'node:path';

import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid unnecessary `else` block after a `break` statement',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noElseBreak: 'Remove this unnecessary else',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      IfStatement(node) {
        const { alternate } = node;
        if (!alternate) return;
        const lastConsequentStatement = getLastStatement(node.consequent);
        if (!lastConsequentStatement) return;

        if (lastConsequentStatement.type === AST_NODE_TYPES.BreakStatement) {
          context.report({
            node: alternate,
            messageId: 'noElseBreak',
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
        }
      },
    };
  },
});

function getLastStatement(stmt: TSESTree.Statement) {
  if (stmt.type === AST_NODE_TYPES.BlockStatement) {
    return stmt.body.at(-1);
  }
  return stmt;
}
