import path from 'node:path';

import type {
  ParserServicesWithTypeInformation,
  TSESTree,
} from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import * as ts from 'typescript';

import { createRule } from '../utils/createRule.js';
import { None, Option, Some } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid unnecessary use of `Required<T>` and `Partial<T>`',
      requiresTypeChecking: true,
      strict: true,
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      uselessRequired:
        'This use of `Required<T>` has no effect because all properties are already required',
      uselessPartial:
        'This use of `Partial<T>` has no effect because all properties are already optional',
      uselessRequiredWithIndexSignature:
        '`Required<T>` has no effect on an index signature',
      uselessPartialWithIndexSignature:
        '`Partial<T>` has no effect on an index signature',
      removeRequired: 'Remove `Required<>`',
      removePartial: 'Remove `Partial<>`',
      noPartialRequired: '`Partial<Required<T>>` can be replaced by `Partial<T>`',
      noRequiredPartial: '`Required<Partial<T>>` can be replaced by `Required<T>`',
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
      TSTypeReference(node) {
        if (node.typeName.type !== AST_NODE_TYPES.Identifier) return;

        const typeParams = node.typeArguments?.params ?? [];
        const [typeArg] = typeParams;
        if (!typeArg) return;
        if (typeParams.length > 1) return;

        const reportedNestedReverse = checkNestedReverse(node, node.typeName, typeArg);
        if (reportedNestedReverse) return;

        const reportedNestedDouble = checkNestedDouble(node, node.typeName, typeArg);
        if (reportedNestedDouble) return;

        if (node.typeName.name === UtilityName.Required.toString()) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
          const typeNode = getServices().esTreeNodeToTSNodeMap.get(
            typeArg,
          ) as ts.TypeNode;
          const type = getChecker().getTypeFromTypeNode(typeNode);

          if (shouldSkipType(type)) return;
          if (hasOptionalProperties(type)) return;

          if (hasIndexSignature(type)) {
            context.report({
              node,
              messageId: 'uselessRequiredWithIndexSignature',
              suggest: [
                {
                  messageId: 'removeRequired',
                  *fix(fixer) {
                    const typeArgText = context.sourceCode.getText(typeArg);
                    yield fixer.replaceText(node, typeArgText);
                  },
                },
              ],
            });
            return;
          }

          context.report({
            node,
            messageId: 'uselessRequired',
            suggest: [
              {
                messageId: 'removeRequired',
                *fix(fixer) {
                  const typeArgText = context.sourceCode.getText(typeArg);
                  yield fixer.replaceText(node, typeArgText);
                },
              },
            ],
          });
          return;
        }

        if (node.typeName.name === UtilityName.Partial.toString()) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
          const typeNode = getServices().esTreeNodeToTSNodeMap.get(
            typeArg,
          ) as ts.TypeNode;
          const type = getChecker().getTypeFromTypeNode(typeNode);

          if (shouldSkipType(type)) return;
          if (hasRequiredProperties(type)) return;

          if (hasIndexSignature(type)) {
            context.report({
              node,
              messageId: 'uselessPartialWithIndexSignature',
              suggest: [
                {
                  messageId: 'removePartial',
                  *fix(fixer) {
                    const typeArgText = context.sourceCode.getText(typeArg);
                    yield fixer.replaceText(node, typeArgText);
                  },
                },
              ],
            });
            return;
          }

          context.report({
            node,
            messageId: 'uselessPartial',
            suggest: [
              {
                messageId: 'removePartial',
                *fix(fixer) {
                  const typeArgText = context.sourceCode.getText(typeArg);
                  yield fixer.replaceText(node, typeArgText);
                },
              },
            ],
          });
        }
      },
    };

    /** Check for Required<Partial<T>> or Partial<Required<T>> */
    function checkNestedReverse(
      node: TSESTree.TSTypeReference,
      typeName: TSESTree.Identifier,
      typeArg: TSESTree.TypeNode,
    ): boolean {
      const maybeNestedReverse = getReverseReference(typeName, typeArg);
      if (!maybeNestedReverse.some) return false;
      const { utilityName, nestedReference } = maybeNestedReverse.value;

      if (utilityName === UtilityName.Required) {
        context.report({
          node,
          messageId: 'noRequiredPartial',
          suggest: [
            {
              messageId: 'removePartial',
              *fix(fixer) {
                const typeArgText = context.sourceCode.getText(nestedReference);
                yield fixer.replaceText(typeArg, typeArgText);
              },
            },
          ],
        });
        return true;
      }

      context.report({
        node,
        messageId: 'noPartialRequired',
        suggest: [
          {
            messageId: 'removeRequired',
            *fix(fixer) {
              const typeArgText = context.sourceCode.getText(nestedReference);
              yield fixer.replaceText(typeArg, typeArgText);
            },
          },
        ],
      });
      return true;
    }

    /** Check for Required<Partial<T>> or Partial<Required<T>> */
    function checkNestedDouble(
      node: TSESTree.TSTypeReference,
      typeName: TSESTree.Identifier,
      typeArg: TSESTree.TypeNode,
    ): boolean {
      const maybeNestedDouble = getDoubleReference(typeName, typeArg);
      if (!maybeNestedDouble.some) return false;
      const { utilityName, nestedReference } = maybeNestedDouble.value;

      if (utilityName === UtilityName.Required) {
        context.report({
          node,
          messageId: 'uselessRequired',
          suggest: [
            {
              messageId: 'removeRequired',
              *fix(fixer) {
                const typeArgText = context.sourceCode.getText(nestedReference);
                yield fixer.replaceText(typeArg, typeArgText);
              },
            },
          ],
        });
        return true;
      }

      context.report({
        node,
        messageId: 'uselessPartial',
        suggest: [
          {
            messageId: 'removePartial',
            *fix(fixer) {
              const typeArgText = context.sourceCode.getText(nestedReference);
              yield fixer.replaceText(typeArg, typeArgText);
            },
          },
        ],
      });
      return true;
    }
  },
});

function shouldSkipType(type: ts.Type): boolean {
  const flags =
    ts.TypeFlags.Any |
    ts.TypeFlags.Unknown |
    ts.TypeFlags.Never |
    ts.TypeFlags.TypeParameter;

  return (type.getFlags() & flags) !== 0;
}

function hasIndexSignature(type: ts.Type): boolean {
  return type.getStringIndexType() !== undefined;
}

function hasOptionalProperties(type: ts.Type): boolean {
  if (type.isUnionOrIntersection()) {
    return type.types.some((t) => hasOptionalProperties(t));
  }

  if (!isObjectType(type)) return type.isTypeParameter();

  const maybeMappedOptional = getOptionalMappedType(type);
  if (maybeMappedOptional.some) {
    return maybeMappedOptional.value;
  }

  return type
    .getProperties()
    .some((prop) => (prop.flags & ts.SymbolFlags.Optional) !== 0);
}

function hasRequiredProperties(type: ts.Type): boolean {
  if (type.isUnionOrIntersection()) {
    return type.types.some((t) => hasRequiredProperties(t));
  }

  if (!isObjectType(type)) return type.isTypeParameter();

  const maybeMappedOptional = getOptionalMappedType(type);
  if (maybeMappedOptional.some) {
    return !maybeMappedOptional.value;
  }

  const properties = type.getProperties();
  if (!properties.length && type.objectFlags & ts.ObjectFlags.Instantiated) {
    return true;
  }

  return properties.some((prop) => (prop.flags & ts.SymbolFlags.Optional) === 0);
}

function getOptionalMappedType(type: ts.ObjectType): Option<boolean> {
  if ((type.objectFlags & ts.ObjectFlags.Mapped) === 0) return None;
  if ((type.objectFlags & ts.ObjectFlags.Instantiated) !== 0) return None;

  const optional = !!type
    .getSymbol()
    ?.declarations?.some((decl) => ts.isMappedTypeNode(decl) && decl.questionToken);
  return Some(optional);
}

function isObjectType(type: ts.Type): type is ts.ObjectType {
  return (type.getFlags() & ts.TypeFlags.Object) !== 0;
}

enum UtilityName {
  Required = 'Required',
  Partial = 'Partial',
}

const ReverseUtilityName: Record<UtilityName, UtilityName> = {
  [UtilityName.Required]: UtilityName.Partial,
  [UtilityName.Partial]: UtilityName.Required,
};

function getNestedTypeReference(
  typeArg: TSESTree.TypeNode,
  typeName: string,
): Option<TSESTree.TypeNode> {
  if (typeArg.type !== AST_NODE_TYPES.TSTypeReference) return None;
  if (typeArg.typeName.type !== AST_NODE_TYPES.Identifier) return None;
  if (typeArg.typeName.name !== typeName) return None;
  if (!typeArg.typeArguments) return None;

  const [param] = typeArg.typeArguments.params;
  return Option.fromUndef(param);
}

/** Get Required<Partial<T>> or Partial<Required<T>> */
function getReverseReference(typeName: TSESTree.Identifier, typeArg: TSESTree.TypeNode) {
  for (const utilityName of [UtilityName.Partial, UtilityName.Required]) {
    if (typeName.name !== utilityName.toString()) continue;

    const maybeNestedReference = getNestedTypeReference(
      typeArg,
      ReverseUtilityName[utilityName],
    );

    if (!maybeNestedReference.some) continue;

    const nestedReference = maybeNestedReference.value;
    return Some({ utilityName, nestedReference });
  }

  return None;
}

/** Get Required<Required<T>> or Partial<Partial<T>> */
function getDoubleReference(typeName: TSESTree.Identifier, typeArg: TSESTree.TypeNode) {
  for (const utilityName of [UtilityName.Partial, UtilityName.Required]) {
    if (typeName.name !== utilityName.toString()) continue;

    const maybeNestedReference = getNestedTypeReference(typeArg, utilityName);

    if (!maybeNestedReference.some) continue;

    const nestedReference = maybeNestedReference.value;
    return Some({ utilityName, nestedReference });
  }

  return None;
}
