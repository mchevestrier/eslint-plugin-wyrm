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
        const maybeArarayPush = getArrayPush(node.body);
        if (!maybeArarayPush.some) return;
        const { arr, arg } = maybeArarayPush.value;

        const elementReference = context.sourceCode
          .getScope(arg)
          .references.find((ref) => ref.resolved?.defs.at(-1)?.node.parent === node.left);
        if (!elementReference) return;

        const scope = context.sourceCode.getScope(node);

        const leftDef = findDef(scope, arr);
        if (!leftDef) return;
        if (leftDef.node.type !== AST_NODE_TYPES.VariableDeclarator) return;
        const { init } = leftDef.node;
        if (!init) return;
        if (init.type !== AST_NODE_TYPES.ArrayExpression) return;

        if (node.parent.type !== AST_NODE_TYPES.BlockStatement) return;
        const { body } = node.parent;
        if (body.at(body.indexOf(node) - 1) !== leftDef.node.parent) return;

        if (node.left.type !== AST_NODE_TYPES.VariableDeclaration) return;
        if (node.left.declarations.length > 1) return;
        const [decl] = node.left.declarations;

        const iteratorTxt = context.sourceCode.getText(node.right);
        const initTxt = context.sourceCode.getText(init);

        const argTxt = context.sourceCode.getText(arg);
        const declTxt = context.sourceCode.getText(decl);
        const mapTxt =
          arg.type === AST_NODE_TYPES.Identifier ? '' : `, (${declTxt}) => (${argTxt})`;

        const func = node.await ? 'Array.fromAsync' : 'Array.from';
        const fixed = `${func}(${iteratorTxt}${mapTxt})`;

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

/** If the loop body only contains `arr.push(arg)`, return arr and arg. */
function getArrayPush(body: TSESTree.Statement) {
  const maybeStmt = getUniqueStatement(body);
  if (!maybeStmt.some) return None;
  const stmt = maybeStmt.value;
  if (stmt.type !== AST_NODE_TYPES.ExpressionStatement) return None;
  if (stmt.expression.type !== AST_NODE_TYPES.CallExpression) return None;
  if (stmt.expression.callee.type !== AST_NODE_TYPES.MemberExpression) return None;
  const arr = stmt.expression.callee.object;
  if (arr.type !== AST_NODE_TYPES.Identifier) return None;
  if (stmt.expression.callee.property.type !== AST_NODE_TYPES.Identifier) return None;
  if (stmt.expression.callee.property.name !== 'push') return None;
  if (stmt.expression.arguments.length > 1) return None;
  const [arg] = stmt.expression.arguments;
  if (!arg) return None;
  return Some({ arr, arg });
}

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
