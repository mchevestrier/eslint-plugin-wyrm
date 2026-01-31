import path from 'node:path';

import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import * as ts from 'typescript';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description: 'Forbid calling `.valueOf()` on a primitive',
      recommended: true,
      requiresTypeChecking: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noPrimitiveValueOf: 'Calling `.valueOf()` on a primitive just returns its value',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return;
        const memberExpr = node.callee;

        if (memberExpr.property.type !== AST_NODE_TYPES.Identifier) return;
        if (memberExpr.property.name !== 'valueOf') return;

        const services = ESLintUtils.getParserServices(context);

        const type = services.getTypeAtLocation(memberExpr.object);

        if (!isPrimitiveOnly(type)) return;

        context.report({
          node,
          messageId: 'noPrimitiveValueOf',
          fix(fixer) {
            const txt = context.sourceCode.getText(memberExpr.object);
            return fixer.replaceText(node, txt);
          },
        });
      },
    };
  },
});

function isPrimitiveOnly(type: ts.Type): boolean {
  if (type.isUnion()) {
    return type.types.every((t) => isPrimitiveOnly(t));
  }

  if (type.flags & ts.TypeFlags.NumberLike) return true;
  if (type.flags & ts.TypeFlags.BooleanLike) return true;
  if (type.flags & ts.TypeFlags.StringLike) return true;
  if (type.flags & ts.TypeFlags.BigIntLike) return true;

  return false;
}
