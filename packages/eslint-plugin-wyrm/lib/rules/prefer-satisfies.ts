import path from 'node:path';

import type { ParserServicesWithTypeInformation } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import ts from 'typescript';

import { createRule } from '../utils/createRule.js';
import { None, Some } from '../utils/option.js';
import type { Option } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer `satisfies` to type assertions',
      strict: true,
      requiresTypeChecking: true,
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      preferSatisfies: 'Use `satisfies` instead of `as`',
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
      TSAsExpression(node) {
        // as const
        if (
          node.typeAnnotation.type === AST_NODE_TYPES.TSTypeReference &&
          node.typeAnnotation.typeName.type === AST_NODE_TYPES.Identifier &&
          node.typeAnnotation.typeName.name === 'const'
        ) {
          return;
        }

        const assertedType = getServices().getTypeFromTypeNode(node.typeAnnotation);

        if (hasOptionalProperties(assertedType)) return;

        const valueTypeHasOptionalProperties = getObjectValueTypes(
          assertedType,
          getChecker(),
        ).some((t) => hasOptionalProperties(t));
        if (valueTypeHasOptionalProperties) return;

        const hasIndexType =
          getChecker().getIndexInfoOfType(assertedType, ts.IndexKind.String) !==
          undefined;
        if (hasIndexType) return;

        if (isPromiseType(assertedType)) return;

        const flags =
          ts.TypeFlags.Any |
          ts.TypeFlags.Unknown |
          ts.TypeFlags.Never |
          ts.TypeFlags.EnumLike;

        if (assertedType.getFlags() & flags) return;

        const exprType = getServices().getTypeAtLocation(node.expression);
        if (exprType.getFlags() & flags) return;
        if (isPromiseType(exprType)) return;

        if (!exprType.getProperties().length) return;

        const isExprAssignableToAsserted = getChecker().isTypeAssignableTo(
          exprType,
          assertedType,
        );
        // Narrowing type assertion
        if (!isExprAssignableToAsserted) return;

        const isAssertedAssignableToExpr = getChecker().isTypeAssignableTo(
          assertedType,
          exprType,
        );
        // Widening assertion
        if (!isAssertedAssignableToExpr) return;

        context.report({
          node,
          messageId: 'preferSatisfies',
          suggest: [
            {
              messageId: 'preferSatisfies',
              fix(fixer) {
                const asToken = context.sourceCode.getTokenBefore(node.typeAnnotation);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return fixer.replaceText(asToken!, 'satisfies');
              },
            },
          ],
        });
      },
    };
  },
});

function isPromiseType(type: ts.Type): boolean {
  return type.getSymbol()?.getName() === 'Promise';
}

function getObjectValueTypes(type: ts.Type, checker: ts.TypeChecker): ts.Type[] {
  if (type.isUnionOrIntersection()) {
    return type.types.flatMap((t) => getObjectValueTypes(t, checker));
  }

  if (!isObjectType(type)) return [];

  const props = checker.getPropertiesOfType(type);
  return props.map((prop) => checker.getTypeOfSymbol(prop));
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

function isObjectType(type: ts.Type): type is ts.ObjectType {
  return (type.getFlags() & ts.TypeFlags.Object) !== 0;
}

function getOptionalMappedType(type: ts.ObjectType): Option<boolean> {
  if ((type.objectFlags & ts.ObjectFlags.Mapped) === 0) return None;
  if ((type.objectFlags & ts.ObjectFlags.Instantiated) !== 0) return None;

  const optional = !!type
    .getSymbol()
    ?.declarations?.some((decl) => ts.isMappedTypeNode(decl) && decl.questionToken);
  return Some(optional);
}
