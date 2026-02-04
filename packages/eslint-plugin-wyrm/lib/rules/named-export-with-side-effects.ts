import path from 'node:path';

import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

const DEFAULT_STRICT = false;

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid named exports in files with side effects',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          strict: {
            type: 'boolean',
            description: `Whether to consider call expressions as possible side effects. Default: \`${DEFAULT_STRICT}\``,
          },
        },
      },
    ],
    messages: {
      namedExportWithSideEffects:
        'When exports from this file are imported, this might also be executed. Make sure this is expected.',
    },
  },
  defaultOptions: [{ strict: DEFAULT_STRICT }],
  create(context, [options]) {
    return {
      Program(node) {
        let hasNamedExports = false;
        const sideEffects: TSESTree.Statement[] = [];

        for (const stmt of node.body) {
          if (stmt.type === AST_NODE_TYPES.ExportNamedDeclaration) {
            hasNamedExports = true;
            continue;
          }

          if (isSideEffect(stmt, options.strict)) {
            sideEffects.push(stmt);
          }
        }

        if (!hasNamedExports) return;

        for (const sideEffect of sideEffects) {
          context.report({ node: sideEffect, messageId: 'namedExportWithSideEffects' });
        }
      },
    };
  },
});

function isSideEffect(stmt: TSESTree.Statement, strict: boolean): boolean {
  switch (stmt.type) {
    case AST_NODE_TYPES.BreakStatement:
    case AST_NODE_TYPES.ContinueStatement:
    case AST_NODE_TYPES.DebuggerStatement:
    case AST_NODE_TYPES.DoWhileStatement:
    case AST_NODE_TYPES.SwitchStatement:
    case AST_NODE_TYPES.ForStatement:
    case AST_NODE_TYPES.ForInStatement:
    case AST_NODE_TYPES.ForOfStatement:
    case AST_NODE_TYPES.ThrowStatement:
    case AST_NODE_TYPES.TryStatement:
    case AST_NODE_TYPES.WhileStatement:
      return true;

    case AST_NODE_TYPES.BlockStatement:
      return stmt.body.some((s) => isSideEffect(s, strict));

    case AST_NODE_TYPES.IfStatement:
      if (stmt.alternate && isSideEffect(stmt.alternate, strict)) return true;
      return isSideEffect(stmt.consequent, strict);

    case AST_NODE_TYPES.ExpressionStatement:
      switch (stmt.expression.type) {
        case AST_NODE_TYPES.AwaitExpression:
        case AST_NODE_TYPES.UpdateExpression:
          return true;

        case AST_NODE_TYPES.CallExpression:
          return strict;

        default:
          return false;
      }

    default:
      return false;
  }
}
