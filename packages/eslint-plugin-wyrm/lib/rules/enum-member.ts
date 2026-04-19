import path from 'node:path';

import type { ParserServicesWithTypeInformation } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import ts from 'typescript';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer enum members to string literals asserted as enum',
      recommended: true,
      requiresTypeChecking: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferEnumMember: 'Use `satisfies` instead of `as`',
    },
  },
  defaultOptions: [],
  create(context) {
    let services: ParserServicesWithTypeInformation | undefined;
    function getServices() {
      services ??= ESLintUtils.getParserServices(context);
      return services;
    }

    return {
      TSAsExpression(node) {
        if (node.expression.type !== AST_NODE_TYPES.Literal) return;
        const { value } = node.expression;

        if (typeof value !== 'string' && typeof value !== 'number') {
          return;
        }

        const assertedType = getServices().getTypeFromTypeNode(node.typeAnnotation);

        if ((assertedType.flags & ts.TypeFlags.EnumLike) === 0) return;
        if (!assertedType.isUnion()) return;

        const enumName = assertedType.getSymbol()?.getEscapedName().toString();
        if (enumName === undefined) return;

        const member = assertedType.types
          .filter((t) => t.isStringLiteral() || t.isNumberLiteral())
          .find((t) => t.value === value);
        if (member === undefined) return;

        const memberName = member.getSymbol()?.getEscapedName().toString();
        if (memberName === undefined) return;

        context.report({
          node,
          messageId: 'preferEnumMember',
          fix(fixer) {
            return fixer.replaceText(node, `${enumName}.${memberName}`);
          },
        });
      },
    };
  },
});
