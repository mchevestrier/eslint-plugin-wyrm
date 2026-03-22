import path from 'node:path';

import { AST_NODE_TYPES, ASTUtils, TSESLint } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

const NAMESPACES = new Set(['jest', 'vi']);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid useless mocks in tests',
      strict: true,
    },
    schema: [],
    messages: {
      uselessMock:
        'This mock seems to be useless because it just uses the original implementation. Use spies if you want to keep the existing implementation.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return;
        if (node.callee.object.type !== AST_NODE_TYPES.Identifier) return;
        if (node.callee.property.type !== AST_NODE_TYPES.Identifier) return;

        if (!NAMESPACES.has(node.callee.object.name)) return;
        if (node.callee.property.name !== 'mock') return;

        const [arg1, arg2] = node.arguments;
        if (!arg1 || !arg2) return;
        const specifier = getMockSpecifier(arg1);
        if (!specifier) return;
        const fn = getFunctionNode(arg2);
        if (!fn) return;

        const expressions = getAllReturnExpressions(fn);
        const scope = context.sourceCode.getScope(fn);
        if (!expressions.length) return;
        const isUselessMock = expressions.every((expr) =>
          isUselessMockExpression(expr, fn, scope, specifier),
        );
        if (!isUselessMock) return;

        context.report({ node, messageId: 'uselessMock' });
      },
    };
  },
});

function isUselessMockExpression(
  expr: TSESTree.Expression,
  fn: FunctionNode,
  scope: TSESLint.Scope.Scope,
  specifier: string,
): boolean {
  if (expr.type === AST_NODE_TYPES.Identifier) {
    const variable = ASTUtils.findVariable(scope, expr.name);
    if (!variable) return false;
    const def = variable.defs.at(-1);
    if (!def) return false;
    if (!def.isVariableDefinition) return false;
    if (def.node.type !== AST_NODE_TYPES.VariableDeclarator) return false;
    if (!def.node.init) return false;
    const references = variable.references.filter(
      (ref) => ref.identifier !== expr && isPossibleMutation(ref.identifier),
    );
    if (references.length >= 1) {
      return false;
    }
    return isUselessMockExpression(def.node.init, fn, scope, specifier);
  }

  if (isJestRequireActual(expr, specifier)) return true;
  if (isVitestImportActual(expr, fn, scope)) return true;

  if (expr.type !== AST_NODE_TYPES.ObjectExpression) return false;

  if (!expr.properties.length) return false;

  return expr.properties.every((prop) => {
    if (prop.type === AST_NODE_TYPES.SpreadElement) {
      return isUselessMockExpression(prop.argument, fn, scope, specifier);
    }
    return isUselessMockProperty(prop, fn, scope, specifier);
  });
}

function isPossibleMutation(node: TSESTree.Node, child?: TSESTree.Node): boolean {
  if (!node.parent) return false;

  switch (node.type) {
    case AST_NODE_TYPES.CallExpression:
      if (child === undefined) return true;
      return !(node.arguments as TSESTree.Node[]).includes(child);

    case AST_NODE_TYPES.AssignmentExpression:
      return true;

    case AST_NODE_TYPES.ExpressionStatement:
    case AST_NODE_TYPES.Property:
      return false;

    default:
      return isPossibleMutation(node.parent, node);
  }
}

function isUselessMockProperty(
  prop: TSESTree.Property,
  fn: FunctionNode,
  scope: TSESLint.Scope.Scope,
  specifier: string,
): boolean {
  if (prop.key.type !== AST_NODE_TYPES.Identifier) return false;

  const unwrapped = unwrapFn(prop.value);
  const arg = unwrapped ?? prop.value;

  if (arg.type !== AST_NODE_TYPES.MemberExpression) return false;
  if (arg.property.type !== AST_NODE_TYPES.Identifier) return false;
  if (arg.property.name !== prop.key.name) return false;
  return isImportActual(arg.object, fn, scope, specifier);
}

function unwrapFn(expr: TSESTree.Node): TSESTree.Expression | null {
  if (expr.type !== AST_NODE_TYPES.CallExpression) return null;
  if (expr.callee.type !== AST_NODE_TYPES.MemberExpression) return null;
  if (expr.callee.object.type !== AST_NODE_TYPES.Identifier) return null;
  if (expr.callee.property.type !== AST_NODE_TYPES.Identifier) return null;
  if (!NAMESPACES.has(expr.callee.object.name)) return null;
  if (expr.callee.property.name !== 'fn') return null;

  const [arg] = expr.arguments;
  if (!arg) return null;
  if (arg.type === AST_NODE_TYPES.SpreadElement) return null;
  return arg;
}

function isImportActual(
  expr: TSESTree.Expression,
  fn: FunctionNode,
  scope: TSESLint.Scope.Scope,
  specifier: string,
) {
  if (expr.type === AST_NODE_TYPES.Identifier) {
    const variable = ASTUtils.findVariable(scope, expr.name);
    if (!variable) return false;
    const def = variable.defs.at(-1);
    if (!def) return false;
    if (!def.isVariableDefinition) return false;
    if (def.node.type !== AST_NODE_TYPES.VariableDeclarator) return false;
    if (!def.node.init) return false;
    return isImportActual(def.node.init, fn, scope, specifier);
  }

  if (isJestRequireActual(expr, specifier)) return true;
  if (isVitestImportActual(expr, fn, scope)) return true;
  return false;
}

function isJestRequireActual(expr: TSESTree.Expression, specifier: string): boolean {
  if (expr.type !== AST_NODE_TYPES.CallExpression) return false;
  if (expr.callee.type !== AST_NODE_TYPES.MemberExpression) return false;
  if (expr.callee.object.type !== AST_NODE_TYPES.Identifier) return false;
  if (expr.callee.property.type !== AST_NODE_TYPES.Identifier) return false;
  if (expr.callee.object.name !== 'jest') return false;
  if (expr.callee.property.name !== 'requireActual') return false;

  const [arg] = expr.arguments;
  if (!arg) return false;
  if (arg.type !== AST_NODE_TYPES.Literal) return false;
  if (typeof arg.value !== 'string') return false;
  if (arg.value !== specifier) return false;

  return true;
}

function isVitestImportActual(
  expr: TSESTree.Expression,
  fn: FunctionNode,
  scope: TSESLint.Scope.Scope,
): boolean {
  if (expr.type === AST_NODE_TYPES.AwaitExpression) {
    return isVitestImportActual(expr.argument, fn, scope);
  }
  if (expr.type !== AST_NODE_TYPES.CallExpression) return false;
  if (expr.callee.type !== AST_NODE_TYPES.Identifier) return false;
  const variable = ASTUtils.findVariable(scope, expr.callee);
  if (!variable) return false;
  const def = variable.defs.at(-1);
  if (!def) return false;
  if (def.type !== TSESLint.Scope.DefinitionType.Parameter) return false;
  return def.name === fn.params.at(0);
}

function getMockSpecifier(node: TSESTree.CallExpressionArgument): string | null {
  if (node.type === AST_NODE_TYPES.Literal && typeof node.value === 'string') {
    return node.value;
  }

  if (node.type !== AST_NODE_TYPES.ImportExpression) return null;
  if (node.source.type !== AST_NODE_TYPES.Literal) return null;
  if (typeof node.source.value !== 'string') return null;
  return node.source.value;
}

type FunctionNode = TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression;

function getFunctionNode(node: TSESTree.CallExpressionArgument): FunctionNode | null {
  switch (node.type) {
    case AST_NODE_TYPES.FunctionExpression:
    case AST_NODE_TYPES.ArrowFunctionExpression:
      return node;

    case AST_NODE_TYPES.TSAsExpression:
    case AST_NODE_TYPES.TSNonNullExpression:
    case AST_NODE_TYPES.TSSatisfiesExpression:
      return getFunctionNode(node.expression);

    default:
      return null;
  }
}

function getAllReturnExpressions(fn: FunctionNode): TSESTree.Expression[] {
  if (fn.body.type !== AST_NODE_TYPES.BlockStatement) {
    return [fn.body];
  }
  return getAllReturnStatements(fn.body)
    .map((ret) => ret.argument)
    .filter((arg) => arg !== null);
}

function getAllReturnStatements(node: TSESTree.Node | null): TSESTree.ReturnStatement[] {
  if (!node) return [];

  switch (node.type) {
    case AST_NODE_TYPES.ReturnStatement:
      return [node];

    case AST_NODE_TYPES.BlockStatement:
      return node.body.flatMap((stmt) => getAllReturnStatements(stmt));

    case AST_NODE_TYPES.IfStatement:
      return [
        ...getAllReturnStatements(node.consequent),
        ...getAllReturnStatements(node.alternate),
      ].flat();

    case AST_NODE_TYPES.CatchClause:
      return getAllReturnStatements(node.body);

    case AST_NODE_TYPES.TryStatement:
      return [
        ...getAllReturnStatements(node.block),
        ...getAllReturnStatements(node.handler),
        ...getAllReturnStatements(node.finalizer),
      ].flat();

    case AST_NODE_TYPES.DoWhileStatement:
    case AST_NODE_TYPES.WhileStatement:
    case AST_NODE_TYPES.ForStatement:
    case AST_NODE_TYPES.ForInStatement:
    case AST_NODE_TYPES.ForOfStatement:
      return getAllReturnStatements(node.body);

    case AST_NODE_TYPES.SwitchCase:
      return node.consequent.flatMap((stmt) => getAllReturnStatements(stmt));

    case AST_NODE_TYPES.SwitchStatement:
      return node.cases.flatMap((c) => getAllReturnStatements(c));

    default:
      return [];
  }
}
