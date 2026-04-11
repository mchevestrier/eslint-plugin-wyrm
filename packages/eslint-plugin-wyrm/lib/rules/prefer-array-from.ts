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
      description:
        'Enforce using `Array.from` or `Array.fromAsync` over iterative accumulation',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferArrayFrom: 'Use `{{ func }}`',
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
        if (stmt.expression.type !== AST_NODE_TYPES.CallExpression) return;
        if (stmt.expression.callee.type !== AST_NODE_TYPES.MemberExpression) return;
        const arr = stmt.expression.callee.object;
        if (arr.type !== AST_NODE_TYPES.Identifier) return;
        if (stmt.expression.callee.property.type !== AST_NODE_TYPES.Identifier) return;
        if (stmt.expression.callee.property.name !== 'push') return;
        if (stmt.expression.arguments.length > 1) return;
        const [arg] = stmt.expression.arguments;
        if (!arg) return;
        if (arg.type !== AST_NODE_TYPES.Identifier) return;

        const scope = context.sourceCode.getScope(node);

        const leftDef = findDef(scope, arr);
        if (!leftDef) return;
        if (leftDef.node.type !== AST_NODE_TYPES.VariableDeclarator) return;
        const { init } = leftDef.node;
        if (!init) return;
        if (init.type !== AST_NODE_TYPES.ArrayExpression) return;

        const rightDef = findDef(scope, arg);
        if (!rightDef) return;
        if (rightDef.node.parent !== node.left) return;

        const iteratorTxt = context.sourceCode.getText(node.right);
        const initTxt = context.sourceCode.getText(init);

        const func = node.await ? 'Array.fromAsync' : 'Array.from';
        const fixed = `${func}(${iteratorTxt})`;
        const txt = init.elements.length ? `${initTxt}.concat(${fixed})` : fixed;

        context.report({
          node,
          messageId: 'preferArrayFrom',
          data: { func },
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
