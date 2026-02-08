import path from 'node:path';

import type {
  ParserServicesWithTypeInformation,
  TSESTree,
} from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import * as ts from 'typescript';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Forbid declaring function return types that are wider than the types of the actual return values',
      requiresTypeChecking: true,
      strict: true,
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      noLaxReturnType:
        'This type is never returned from the function, maybe you can remove it from the return type: {{unusedType}}',
      removeType: 'Remove {{unusedType}}',
    },
  },
  defaultOptions: [],
  create(context) {
    let services: ParserServicesWithTypeInformation | undefined;
    function getServices() {
      services ??= ESLintUtils.getParserServices(context);
      return services;
    }

    let checker: ts.TypeChecker | undefined;
    function getChecker() {
      checker ??= getServices().program.getTypeChecker();
      return checker;
    }

    type FunctionNode =
      | TSESTree.FunctionDeclaration
      | TSESTree.FunctionExpression
      | TSESTree.ArrowFunctionExpression;

    return {
      ArrowFunctionExpression: checkFunction,
      FunctionExpression: checkFunction,
      FunctionDeclaration: checkFunction,
    };

    function inferAllReturnTypes(body: FunctionNode['body'], async: boolean): ts.Type[] {
      // Inline arrow function
      if (body.type !== AST_NODE_TYPES.BlockStatement) {
        return [getServices().getTypeAtLocation(body)];
      }

      return getAllReturnStatements(body).map((stmt) => {
        if (!stmt.argument) return getChecker().getVoidType();
        const type = getServices().getTypeAtLocation(stmt.argument);
        if (!async) return type;
        return getChecker().getAwaitedType(type) ?? type;
      });
    }

    function isAssignableTo(source: ts.Type, target: ts.Type): boolean {
      if (source.isUnion()) {
        return source.types.some((t) => isAssignableTo(t, target));
      }

      return getChecker().isTypeAssignableTo(source, getChecker().getWidenedType(target));
    }

    function checkReturnTypeNode(
      returnTypeNode: ts.TypeNode,
      inferredReturnTypes: ts.Type[],
    ) {
      const returnType = getChecker().getTypeFromTypeNode(returnTypeNode);

      // Ignore conditional types
      if (returnType.flags & ts.TypeFlags.Conditional) return;

      if (
        inferredReturnTypes.some((inferredReturnType) =>
          isAssignableTo(inferredReturnType, returnType),
        )
      ) {
        return;
      }

      const estreeNode = getServices().tsNodeToESTreeNodeMap.get(returnTypeNode);
      const typeAsString = returnTypeNode.getText();

      context.report({
        node: estreeNode,
        messageId: 'noLaxReturnType',
        data: { unusedType: typeAsString },
        suggest: [
          {
            messageId: 'removeType',
            data: { unusedType: typeAsString },
            *fix(fixer) {
              if (
                estreeNode.parent?.type === AST_NODE_TYPES.TSUnionType &&
                (estreeNode.parent.types[0] as TSESTree.Node | undefined) === estreeNode
              ) {
                const nextToken = context.sourceCode.getTokenAfter(estreeNode);
                yield fixer.remove(estreeNode);
                /* v8 ignore else -- @preserve */
                if (nextToken) yield fixer.remove(nextToken);
                return;
              }

              const previousToken = context.sourceCode.getTokenBefore(estreeNode);
              yield fixer.remove(estreeNode);
              /* v8 ignore else -- @preserve */
              if (previousToken) yield fixer.remove(previousToken);
            },
          },
        ],
      });
    }

    function checkFunction(node: FunctionNode) {
      if (!node.returnType) return;

      // Ignore method definitions as the return type can be useful for child classes
      if (node.parent.type === AST_NODE_TYPES.MethodDefinition) {
        return;
      }

      const inferredReturnTypes = inferAllReturnTypes(node.body, node.async);
      if (!inferredReturnTypes.length) return;

      const fnType = getServices().getTypeAtLocation(node);
      const sigs = fnType.getCallSignatures();

      // Just bail out for multiple signatures with generics
      if (sigs.length > 1 && node.typeParameters) {
        return;
      }

      for (const sig of sigs) {
        const returnTypes = getUnionTypeNodes(sig.getDeclaration().type, node.async);

        for (const returnTypeNode of returnTypes) {
          checkReturnTypeNode(returnTypeNode, inferredReturnTypes);
        }
      }
    }
  },
});

function getUnionTypeNodes(type: ts.TypeNode | undefined, async: boolean): ts.TypeNode[] {
  /* v8 ignore if -- @preserve */
  if (!type) return [];
  if (async) {
    const promiseTypeNode = getPromiseTypeNode(type);
    if (!promiseTypeNode) return [];
    return getUnionTypeNodes(promiseTypeNode, false);
  }
  if (ts.isUnionTypeNode(type)) return [...type.types];
  return [type];
}

function getAllReturnStatements(
  stmt: TSESTree.Statement | null | undefined,
): TSESTree.ReturnStatement[] {
  if (stmt == null) return [];

  switch (stmt.type) {
    case AST_NODE_TYPES.ReturnStatement:
      return [stmt] as const;

    case AST_NODE_TYPES.BlockStatement:
      return stmt.body.flatMap((s) => getAllReturnStatements(s));

    case AST_NODE_TYPES.IfStatement:
      return [
        ...getAllReturnStatements(stmt.consequent),
        ...getAllReturnStatements(stmt.alternate),
      ];

    case AST_NODE_TYPES.SwitchStatement:
      return stmt.cases
        .flatMap((c) => c.consequent)
        .flatMap((c) => getAllReturnStatements(c));

    case AST_NODE_TYPES.ForInStatement:
    case AST_NODE_TYPES.ForOfStatement:
    case AST_NODE_TYPES.ForStatement:
    case AST_NODE_TYPES.WhileStatement:
    case AST_NODE_TYPES.DoWhileStatement:
      return getAllReturnStatements(stmt.body);

    case AST_NODE_TYPES.TryStatement: {
      return [
        ...getAllReturnStatements(stmt.block),
        ...getAllReturnStatements(stmt.handler?.body),
        ...getAllReturnStatements(stmt.finalizer),
      ];
    }

    default:
      return [];
  }
}

/** Extract the inner type node from a Promise type node */
function getPromiseTypeNode(returnTypeNode: ts.TypeNode): ts.TypeNode | null {
  if (!ts.isTypeReferenceNode(returnTypeNode)) return null;
  if (!ts.isIdentifier(returnTypeNode.typeName)) return null;
  if (returnTypeNode.typeName.escapedText.toString() !== 'Promise') {
    return null;
  }
  const [typeArgNode] = returnTypeNode.typeArguments ?? [];
  if (!typeArgNode) return null;
  return typeArgNode;
}
