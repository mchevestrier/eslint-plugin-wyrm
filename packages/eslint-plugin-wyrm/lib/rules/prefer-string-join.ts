import path from 'node:path';

import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ASTUtils } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';
import { None, Option, Some } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce usage of `String.prototype.join`',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferJoin: 'This could be simplified as `{{fixed}}`',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ForOfStatement(node) {
        const maybeStmt = getUniqueStatement(node.body);
        if (!maybeStmt.some) return;
        const stmt = maybeStmt.value;
        if (stmt.type !== AST_NODE_TYPES.ExpressionStatement) return;
        if (stmt.expression.type !== AST_NODE_TYPES.AssignmentExpression) return;
        if (stmt.expression.operator !== '+=') return;

        if (stmt.expression.left.type !== AST_NODE_TYPES.Identifier) return;
        if (stmt.expression.right.type !== AST_NODE_TYPES.Identifier) return;

        const scope = context.sourceCode.getScope(node);

        const leftDef = findDef(scope, stmt.expression.left);
        if (!leftDef) return;
        if (leftDef.node.type !== AST_NODE_TYPES.VariableDeclarator) return;
        const { init } = leftDef.node;
        if (!init) return;
        if (init.type !== AST_NODE_TYPES.Literal) return;
        const initValue = init.value;
        if (typeof initValue !== 'string') return;

        const rightDef = findDef(scope, stmt.expression.right);
        if (!rightDef) return;
        if (rightDef.node.parent !== node.left) return;

        const stringsTxt = context.sourceCode.getText(node.right);
        const initTxt = context.sourceCode.getText(init);
        const fixed = `${stringsTxt}.join()`;
        const txt = initValue ? `${initTxt}.concat(${fixed})` : fixed;

        context.report({
          node,
          messageId: 'preferJoin',
          data: { fixed },
          *fix(fixer) {
            yield fixer.replaceText(init, txt);
            yield fixer.remove(node);
          },
        });
      },
    };
  },
});

function findDef(scope: TSESLint.Scope.Scope, ident: TSESTree.Identifier) {
  const variable = ASTUtils.findVariable(scope, ident);
  return variable?.defs.at(-1);
}

function getUniqueStatement(stmt: TSESTree.Statement) {
  if (stmt.type !== AST_NODE_TYPES.BlockStatement) {
    return Some(stmt);
  }

  if (stmt.body.length !== 1) return None;

  return Option.fromUndef(stmt.body[0]);
}
