import path from 'node:path';

import type {
  ParserServicesWithTypeInformation,
  TSESLint,
  TSESTree,
} from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ASTUtils, ESLintUtils } from '@typescript-eslint/utils';
import * as ts from 'typescript';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Forbid declaring array types that are wider than the types of the actual elements',
      requiresTypeChecking: true,
      strict: true,
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      noLaxArrayType:
        'This type is never used for any element, maybe you can remove it from the array type: {{unusedType}}',
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

    return {
      VariableDeclarator(node) {
        const { id } = node;
        if (id.type !== AST_NODE_TYPES.Identifier) return;
        if (node.parent.kind !== 'const') return;
        if (!id.typeAnnotation?.typeAnnotation) return;
        if (node.init?.type !== AST_NODE_TYPES.ArrayExpression) return;

        const scope = context.sourceCode.getScope(id);
        const variable = ASTUtils.findVariable(scope, id);
        /* v8 ignore next -- @preserve */
        if (!variable) return;

        const possibleMutatingReferences = variable.references.filter((ref) =>
          isPossiblyMutatingReference(ref, id),
        );
        if (possibleMutatingReferences.length > 1) return;

        const estreeArrayTypeNode = id.typeAnnotation.typeAnnotation;
        const tsArrayTypeNode =
          // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
          getServices().esTreeNodeToTSNodeMap.get(estreeArrayTypeNode) as ts.TypeNode;

        const inferredElementTypes = inferAllElementTypes(node.init);
        if (!inferredElementTypes.length) return;

        const arrayElementsTypeNodes = getArrayElementsTypeNodes(tsArrayTypeNode);

        for (const arrayTypeNode of arrayElementsTypeNodes) {
          const arrayType = getChecker().getTypeFromTypeNode(arrayTypeNode);

          if (
            inferredElementTypes.some((inferredElementType) =>
              isAssignableTo(inferredElementType, arrayType),
            )
          ) {
            continue;
          }

          const estreeNode = getServices().tsNodeToESTreeNodeMap.get(arrayTypeNode);
          const typeAsString = arrayTypeNode.getText();

          context.report({
            node,
            messageId: 'noLaxArrayType',
            data: { unusedType: typeAsString },
            suggest: [
              {
                messageId: 'removeType',
                data: { unusedType: typeAsString },
                *fix(fixer) {
                  if (
                    estreeNode.parent?.type === AST_NODE_TYPES.TSUnionType &&
                    (estreeNode.parent.types[0] as TSESTree.Node | undefined) ===
                      estreeNode
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
      },
    };

    function inferAllElementTypes(array: TSESTree.ArrayExpression): ts.Type[] {
      return array.elements.map((elt) => {
        if (!elt) return getChecker().getUndefinedType();
        const type = getServices().getTypeAtLocation(elt);
        return type;
      });
    }

    function isAssignableTo(source: ts.Type, target: ts.Type): boolean {
      if (source.isUnion()) {
        return source.types.some((t) => isAssignableTo(t, target));
      }

      return getChecker().isTypeAssignableTo(source, getChecker().getWidenedType(target));
    }
  },
});

function getArrayElementsTypeNodes(arrayTypeNode: ts.TypeNode): ts.TypeNode[] {
  const innerTypeNode = getArrayTypeNode(arrayTypeNode);
  if (!innerTypeNode) return [];
  return getUnionTypeNodes(innerTypeNode);
}

function getUnionTypeNodes(type: ts.TypeNode): ts.TypeNode[] {
  if (ts.isParenthesizedTypeNode(type)) return getUnionTypeNodes(type.type);
  if (ts.isUnionTypeNode(type)) return [...type.types];
  return [];
}

/** Extract the inner type node from an Array type node */
function getArrayTypeNode(arrayTypeNode: ts.TypeNode): ts.TypeNode | null {
  // foo[]
  if (ts.isArrayTypeNode(arrayTypeNode)) {
    return arrayTypeNode.elementType;
  }

  // Array<foo>
  if (!ts.isTypeReferenceNode(arrayTypeNode)) return null;
  if (!ts.isIdentifier(arrayTypeNode.typeName)) return null;
  if (arrayTypeNode.typeName.escapedText.toString() !== 'Array') {
    return null;
  }
  const [typeArgNode] = arrayTypeNode.typeArguments ?? [];
  if (!typeArgNode) return null;
  return typeArgNode;
}

function isPossiblyMutatingReference(
  ref: TSESLint.Scope.Reference,
  id: TSESTree.Identifier,
) {
  if (ref.isWrite()) return true;

  // Method call:
  if (
    ref.identifier.parent.type !== AST_NODE_TYPES.MemberExpression ||
    ref.identifier.parent.parent.type !== AST_NODE_TYPES.CallExpression ||
    ref.identifier.parent.object.type !== AST_NODE_TYPES.Identifier ||
    ref.identifier.parent.property.type !== AST_NODE_TYPES.Identifier ||
    ref.identifier.parent.object.name !== id.name
  ) {
    return false;
  }

  // `.includes()` is not a mutating method but having a wider type can be useful when using it
  if (ref.identifier.parent.property.name === 'includes') return true;

  const mutableMethods = [
    'copyWithin',
    'fill',
    'pop',
    'push',
    'reverse',
    'shift',
    'sort',
    'splice',
    'unshift',
  ] as const satisfies MutableMethod[];

  type AssertExhaustiveArray<T extends readonly MutableMethod[]> =
    Exclude<MutableMethod, T[number]> extends never ? string[] : never;

  const exhaustiveMutableMethods: AssertExhaustiveArray<typeof mutableMethods> =
    mutableMethods;

  return exhaustiveMutableMethods.includes(ref.identifier.parent.property.name);
}

type ArrayMethods = keyof never[] & string;
type ImmutableMethods = keyof (readonly never[]) & string;
type MutableMethod = Exclude<ArrayMethods, ImmutableMethods>;
