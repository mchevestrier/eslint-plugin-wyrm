/**
 * @fileoverview
 *
 * If two functions both reference each other but are not used anywhere else,
 * tools like TypeScript or ESLint will not mark them as unused.
 *
 * This rule forbids all unused functions, even if they mutually reference each other.
 */

import path from 'node:path';

import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ASTUtils } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';
import { None, type Option, Some } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid unused functions, even if mutually referential',
      strict: true,
    },
    schema: [],
    messages: {
      noUnusedMutuallyReferential: 'This function `{{id}}` is probably unused',
    },
  },
  defaultOptions: [],
  create(context) {
    function getScope(node: TSESTree.Node) {
      return context.sourceCode.getScope(node);
    }

    function checkFunctionNode(node: FunctionNode) {
      const maybeFn = getIdentifiedFunction(node);
      if (!maybeFn.value) return;
      const fn = maybeFn.value;

      if (!isFunctionUnused(fn, getScope)) return;

      context.report({
        node,
        messageId: 'noUnusedMutuallyReferential',
        data: { id: fn.id.name },
      });
    }

    return {
      FunctionDeclaration: checkFunctionNode,
      FunctionExpression: checkFunctionNode,
      ArrowFunctionExpression: checkFunctionNode,
    };
  },
});

enum UsageKind {
  DEFINITELY_USED = 'DEFINITELY_USED',
  DEFINITELY_UNUSED = 'DEFINITELY_UNUSED',
  IT_DEPENDS = 'IT_DEPENDS',
}

const DEFINITELY_USED = { kind: UsageKind.DEFINITELY_USED, isUnused: false } as const;
const DEFINITELY_UNUSED = { kind: UsageKind.DEFINITELY_UNUSED, isUnused: true } as const;
function itDepends(usedIn: Map<TSESTree.Identifier, FunctionNode>): ItDepends {
  return { kind: UsageKind.IT_DEPENDS, usedIn };
}

type DefinitelyUsed = typeof DEFINITELY_USED;
type DefinitelyUnused = typeof DEFINITELY_UNUSED;
type ItDepends = {
  kind: UsageKind.IT_DEPENDS;
  usedIn: Map<TSESTree.Identifier, FunctionNode>;
};
type Usage = DefinitelyUsed | DefinitelyUnused | ItDepends;

function getFunctionUsage(
  fn: IdentifiedFunction,
  getScope: (node: TSESTree.Node) => TSESLint.Scope.Scope,
  cache: Map<TSESTree.Identifier, Usage>,
): Usage {
  const cached = cache.get(fn.id);
  if (cached !== undefined) return cached;

  if (isExported(fn)) {
    return DEFINITELY_USED;
  }

  const variable = ASTUtils.findVariable(getScope(fn.id), fn.id);
  /* v8 ignore if -- @preserve */
  if (!variable) {
    return DEFINITELY_UNUSED;
  }

  const readReferences = variable.references.filter((ref) => ref.isRead());

  const usedIn = new Map<TSESTree.Identifier, FunctionNode>();

  for (const ref of readReferences) {
    const maybeParentFn = getParentFunction(ref.identifier);

    if (!maybeParentFn.some) {
      // This reference is not in a function
      const identUsage = getIdentUsage(ref.identifier, getScope);

      if (identUsage.kind === UsageKind.DEFINITELY_USED) return DEFINITELY_USED; // Reference is used
      continue; // Reference is unused
    }

    // This reference is in a function
    const parentFn = maybeParentFn.value;

    // Direct recursive calls do not count as external use
    if (parentFn.node === fn.node) continue;

    // Otherwise, add the function to the set of dependencies
    usedIn.set(parentFn.id, parentFn.node);
  }

  if (!usedIn.size) return DEFINITELY_UNUSED;
  return itDepends(usedIn);
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function isFunctionUnused(
  fn: IdentifiedFunction,
  getScope: (node: TSESTree.Node) => TSESLint.Scope.Scope,
): boolean {
  const cache = new Map<TSESTree.Identifier, Usage>();

  const usage = getFunctionUsage(fn, getScope, cache);

  if (usage.kind !== UsageKind.IT_DEPENDS) {
    return usage.isUnused;
  }

  const usedIn = new Map(usage.usedIn);

  // Without this we risk looping forever
  const unusedFunctions = new Set<FunctionNode>();

  // Cap iterations to make sure we never loop forever
  let gas = 1000;

  while (usedIn.size && gas > 0) {
    gas--;

    let newFuncsAdded = false;

    for (const [id, func] of usedIn) {
      const funcUsage = getFunctionUsage({ id, node: func }, getScope, cache);
      cache.set(id, funcUsage);

      const { kind } = funcUsage;

      switch (kind) {
        case UsageKind.DEFINITELY_USED:
          return false;

        case UsageKind.DEFINITELY_UNUSED:
          usedIn.delete(id);
          unusedFunctions.add(func);
          continue;

        case UsageKind.IT_DEPENDS:
          for (const [newId, newFunc] of funcUsage.usedIn) {
            if (usedIn.has(newId)) continue;
            if (unusedFunctions.has(newFunc)) continue;

            usedIn.set(newId, newFunc);
            newFuncsAdded = true;
          }
          continue;

        /* v8 ignore next -- @preserve */
        default: {
          const check = kind;
          console.error(
            `[wyrm] Unexpected UsageKind: ${check} (wyrm/no-unused-mutually-referential rule)`,
          );
          return false;
        }
      }
    }

    if (!newFuncsAdded) break;
  }

  /* v8 ignore if -- @preserve */
  if (gas === 0) {
    const msg =
      '[wyrm] Ran out of gas, which should probably never happen. This is probably an infinite loop bug in eslint-plugin-wyrm (wyrm/no-unused-mutually-referential rule)';
    console.error(msg);
  }

  return true;
}

function getIdentUsage(
  node: TSESTree.Identifier | TSESTree.JSXIdentifier,
  getScope: (node: TSESTree.Node) => TSESLint.Scope.Scope,
): DefinitelyUsed | DefinitelyUnused {
  if (node.type === AST_NODE_TYPES.JSXIdentifier) {
    return DEFINITELY_USED;
  }

  switch (node.parent.type) {
    case AST_NODE_TYPES.ExportSpecifier:
    case AST_NODE_TYPES.ExportDefaultDeclaration:
      return DEFINITELY_USED;

    case AST_NODE_TYPES.ExpressionStatement:
      return DEFINITELY_UNUSED;

    case AST_NODE_TYPES.CallExpression:
      return DEFINITELY_USED;

    case AST_NODE_TYPES.VariableDeclarator:
      if (node.parent.id === node) {
        const scope = getScope(node);
        const variable = ASTUtils.findVariable(scope, node);
        /* v8 ignore if -- @preserve */
        if (!variable) {
          return DEFINITELY_UNUSED;
        }

        const isUnused = !variable.references.some((ref) => ref.isRead());
        if (isUnused) return DEFINITELY_UNUSED;
        return DEFINITELY_USED;
      }

      if (node.parent.id.type === AST_NODE_TYPES.Identifier) {
        return getIdentUsage(node.parent.id, getScope);
      }

      return DEFINITELY_USED;

    default: {
      return DEFINITELY_USED;
    }
  }
}

type FunctionNode =
  | TSESTree.FunctionDeclaration
  | TSESTree.FunctionExpression
  | TSESTree.ArrowFunctionExpression;

type IdentifiedFunction = {
  id: TSESTree.Identifier;
  node: FunctionNode;
};

function getIdentifiedFunction(node: FunctionNode): Option<IdentifiedFunction> {
  const { type } = node;

  switch (type) {
    case AST_NODE_TYPES.FunctionDeclaration:
      return getIdentifiedFunctionDecl(node);

    case AST_NODE_TYPES.FunctionExpression:
    case AST_NODE_TYPES.ArrowFunctionExpression:
      return getIdentifiedFunctionExpr(node);

    /* v8 ignore next -- @preserve */
    default: {
      const check: never = type;
      console.error(
        `[wyrm] Unexpected type: ${check} (wyrm/no-unused-mutually-referential rule)`,
      );
      return None;
    }
  }
}

function getIdentifiedFunctionDecl(
  decl: TSESTree.FunctionDeclaration,
): Option<IdentifiedFunction> {
  if (!decl.id) return None;
  return Some({ id: decl.id, node: decl });
}

function getIdentifiedFunctionExpr(
  expr: TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression,
) {
  if (expr.parent.type !== AST_NODE_TYPES.VariableDeclarator) return None;
  if (expr.parent.id.type !== AST_NODE_TYPES.Identifier) return None;
  return Some({ id: expr.parent.id, node: expr });
}

function isExported(fn: IdentifiedFunction): boolean {
  const { type } = fn.node;

  switch (type) {
    case AST_NODE_TYPES.FunctionDeclaration:
      return (
        fn.node.parent.type === AST_NODE_TYPES.ExportNamedDeclaration ||
        fn.node.parent.type === AST_NODE_TYPES.ExportDefaultDeclaration
      );

    case AST_NODE_TYPES.FunctionExpression:
    case AST_NODE_TYPES.ArrowFunctionExpression: {
      let node: TSESTree.Node | undefined = fn.node;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      while (node) {
        if (node.type === AST_NODE_TYPES.ExportNamedDeclaration) return true;
        node = node.parent;
      }
      return false;
    }

    /* v8 ignore next -- @preserve */
    default: {
      const check: never = type;
      console.error(
        `[wyrm] Unexpected type: ${check} (wyrm/no-unused-mutually-referential rule)`,
      );
      return false;
    }
  }
}

function getParentFunction(node: TSESTree.Node | undefined): Option<IdentifiedFunction> {
  let currentNode = node;

  // Cap iterations to make sure we never loop forever
  let gas = 1000;

  while (currentNode && gas > 0) {
    gas--;

    if (
      currentNode.type === AST_NODE_TYPES.FunctionDeclaration ||
      currentNode.type === AST_NODE_TYPES.FunctionExpression ||
      currentNode.type === AST_NODE_TYPES.ArrowFunctionExpression
    ) {
      return getIdentifiedFunction(currentNode);
    }

    currentNode = currentNode.parent;
  }

  /* v8 ignore if -- @preserve */
  if (gas === 0) {
    const msg =
      '[wyrm] Ran out of gas while climbing up the parent chain. Unless your AST is extremely nested, this is probably an infinite loop bug in eslint-plugin-wyrm (wyrm/no-unused-mutually-referential rule)';
    console.error(msg);
  }

  return None;
}
