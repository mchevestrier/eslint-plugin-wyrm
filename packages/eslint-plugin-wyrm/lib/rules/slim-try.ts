/**
 * @fileoverview
 *
 * This rule warns when the first statement in a `try` block is unlikely to raise any exception.
 *
 * The intention is to reduce the size of `try` blocks that can sometimes be unnecessarily huge.
 */

import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce moving safe statements out of `try` blocks',
      strict: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noSafeLine: 'It looks like this statement can safely be moved before the try block',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      TryStatement(node) {
        const [stmt] = node.block.body;
        if (!stmt) return;
        if (!isSafeStatement(stmt)) return;
        context.report({
          node: stmt,
          messageId: 'noSafeLine',
          *fix(fixer) {
            const txt = context.sourceCode.getText(stmt);
            yield fixer.remove(stmt);
            yield fixer.insertTextBefore(node, `${txt}\n`);
          },
        });
      },
    };
  },
});

function isSafeStatement(stmt: TSESTree.Statement): boolean {
  const stmtType = stmt.type;

  switch (stmtType) {
    case AST_NODE_TYPES.BlockStatement:
      return stmt.body.every((statement) => isSafeStatement(statement));

    case AST_NODE_TYPES.BreakStatement:
    case AST_NODE_TYPES.ClassDeclaration:
    case AST_NODE_TYPES.ContinueStatement:
    case AST_NODE_TYPES.DebuggerStatement:
      return true;

    case AST_NODE_TYPES.DoWhileStatement:
      return isSafeStatement(stmt.body);

    case AST_NODE_TYPES.EmptyStatement:
      return true;

    case AST_NODE_TYPES.ExportAllDeclaration:
    case AST_NODE_TYPES.ExportDefaultDeclaration:
    case AST_NODE_TYPES.ExportNamedDeclaration:
      return false;

    case AST_NODE_TYPES.ExpressionStatement:
      return isSafeExpression(stmt.expression);

    case AST_NODE_TYPES.ForInStatement:
    case AST_NODE_TYPES.ForOfStatement:
      return (
        isSafeInitialiser(stmt.left) &&
        isSafeExpression(stmt.right) &&
        isSafeStatement(stmt.body)
      );

    case AST_NODE_TYPES.ForStatement:
      return (
        isSafeInitialiser(stmt.init) &&
        isSafeInitialiser(stmt.test) &&
        isSafeInitialiser(stmt.update) &&
        isSafeStatement(stmt.body)
      );

    case AST_NODE_TYPES.FunctionDeclaration:
      return true;

    case AST_NODE_TYPES.IfStatement:
      return (
        isSafeStatement(stmt.consequent) &&
        (!stmt.alternate || isSafeStatement(stmt.alternate))
      );

    case AST_NODE_TYPES.ImportDeclaration:
      return false;

    case AST_NODE_TYPES.LabeledStatement:
      return isSafeStatement(stmt.body);

    case AST_NODE_TYPES.ReturnStatement:
      return !stmt.argument || isSafeExpression(stmt.argument);

    case AST_NODE_TYPES.SwitchStatement:
      return (
        isSafeExpression(stmt.discriminant) &&
        stmt.cases.every(
          (c) =>
            (!c.test || isSafeExpression(c.test)) &&
            c.consequent.every((statement) => isSafeStatement(statement)),
        )
      );

    case AST_NODE_TYPES.ThrowStatement:
    case AST_NODE_TYPES.TryStatement:
      return false;

    case AST_NODE_TYPES.TSDeclareFunction:
    case AST_NODE_TYPES.TSEnumDeclaration:
    case AST_NODE_TYPES.TSExportAssignment:
    case AST_NODE_TYPES.TSImportEqualsDeclaration:
    case AST_NODE_TYPES.TSInterfaceDeclaration:
    case AST_NODE_TYPES.TSModuleDeclaration:
    case AST_NODE_TYPES.TSNamespaceExportDeclaration:
    case AST_NODE_TYPES.TSTypeAliasDeclaration:
      return true;

    case AST_NODE_TYPES.VariableDeclaration:
      return stmt.declarations.every(
        (decl) =>
          !decl.init || (isSafeExpression(decl.id) && isSafeExpression(decl.init)),
      );

    case AST_NODE_TYPES.WhileStatement:
      return isSafeExpression(stmt.test) && isSafeStatement(stmt.body);

    case AST_NODE_TYPES.WithStatement:
      return isSafeExpression(stmt.object) && isSafeStatement(stmt.body);

    /* v8 ignore next -- @preserve */
    default: {
      const check: never = stmtType;
      console.error(`[wyrm] Unexpected statement type: ${check}`);
      return false;
    }
  }
}

function isSafeExpression(
  expr:
    | TSESTree.Expression
    | TSESTree.DestructuringPattern
    | TSESTree.Property
    | TSESTree.TSEmptyBodyFunctionExpression,
): boolean {
  const exprType = expr.type;

  switch (exprType) {
    case AST_NODE_TYPES.ArrayExpression:
      return expr.elements.every((elt) => {
        if (!elt) return true;

        if (elt.type === AST_NODE_TYPES.SpreadElement) {
          return isSafeExpression(elt.argument);
        }

        return isSafeExpression(elt);
      });

    case AST_NODE_TYPES.ArrayPattern:
      return expr.elements.every((elt) => !elt || isSafeExpression(elt));

    case AST_NODE_TYPES.ArrowFunctionExpression:
      return true;

    case AST_NODE_TYPES.AssignmentPattern:
    case AST_NODE_TYPES.AssignmentExpression:
      return isSafeExpression(expr.right);

    case AST_NODE_TYPES.AwaitExpression:
      return false;

    case AST_NODE_TYPES.BinaryExpression:
      if (expr.operator === 'in' || expr.operator === 'instanceof') {
        return false;
      }

      return isSafeExpression(expr.left) && isSafeExpression(expr.right);

    case AST_NODE_TYPES.CallExpression:
      return false;

    case AST_NODE_TYPES.ChainExpression:
      return isSafeExpression(expr.expression);

    case AST_NODE_TYPES.ClassExpression:
      return true;

    case AST_NODE_TYPES.ConditionalExpression:
      return (
        isSafeExpression(expr.test) &&
        isSafeExpression(expr.consequent) &&
        isSafeExpression(expr.alternate)
      );

    case AST_NODE_TYPES.FunctionExpression:
    case AST_NODE_TYPES.Identifier:
      return true;

    case AST_NODE_TYPES.ImportExpression:
    case AST_NODE_TYPES.JSXElement:
    case AST_NODE_TYPES.JSXFragment:
      return false;

    case AST_NODE_TYPES.Literal:
      return true;

    case AST_NODE_TYPES.LogicalExpression:
      return isSafeExpression(expr.left) && isSafeExpression(expr.right);

    case AST_NODE_TYPES.MemberExpression:
      return false;

    case AST_NODE_TYPES.MetaProperty:
      return true;

    case AST_NODE_TYPES.NewExpression:
      return false;

    case AST_NODE_TYPES.ObjectExpression:
      return expr.properties.every((prop) => {
        if (prop.type === AST_NODE_TYPES.SpreadElement) {
          return isSafeExpression(prop.argument);
        }

        return isSafeExpression(prop.key) && isSafeExpression(prop.value);
      });

    case AST_NODE_TYPES.ObjectPattern:
      return expr.properties.every((prop) => isSafeExpression(prop));

    case AST_NODE_TYPES.Property:
      return isSafeExpression(expr.key) && isSafeExpression(expr.value);

    case AST_NODE_TYPES.RestElement:
      return isSafeExpression(expr.argument);

    case AST_NODE_TYPES.SequenceExpression:
      return expr.expressions.every((expression) => isSafeExpression(expression));

    /* v8 ignore next -- @preserve */
    case AST_NODE_TYPES.Super:
    case AST_NODE_TYPES.TaggedTemplateExpression:
      return false;

    case AST_NODE_TYPES.TemplateLiteral:
      return expr.expressions.every((expression) => isSafeExpression(expression));

    case AST_NODE_TYPES.ThisExpression:
      return true;

    case AST_NODE_TYPES.TSAsExpression:
      return isSafeExpression(expr.expression);

    /* v8 ignore next -- @preserve */
    case AST_NODE_TYPES.TSEmptyBodyFunctionExpression:
    case AST_NODE_TYPES.TSInstantiationExpression:
      return true;

    case AST_NODE_TYPES.TSNonNullExpression:
    case AST_NODE_TYPES.TSSatisfiesExpression:
    case AST_NODE_TYPES.TSTypeAssertion:
      return isSafeExpression(expr.expression);

    case AST_NODE_TYPES.UnaryExpression:
    case AST_NODE_TYPES.UpdateExpression:
    case AST_NODE_TYPES.YieldExpression:
      return !expr.argument || isSafeExpression(expr.argument);

    /* v8 ignore next -- @preserve */
    default: {
      const check: never = exprType;
      console.error(`[wyrm] Unexpected expression type: ${check}`);
      return false;
    }
  }
}

type Initialiser =
  | TSESTree.Expression
  | TSESTree.ForInitialiser
  | TSESTree.UsingInForOfDeclaration
  | null;

function isSafeInitialiser(initialiser: Initialiser): boolean {
  if (!initialiser) return true;
  if (initialiser.type === AST_NODE_TYPES.VariableDeclaration) {
    return isSafeStatement(initialiser);
  }
  return isSafeExpression(initialiser);
}
