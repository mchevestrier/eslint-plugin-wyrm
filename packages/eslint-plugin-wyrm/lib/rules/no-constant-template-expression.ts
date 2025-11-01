import path from 'node:path';

import { ESLintUtils } from '@typescript-eslint/utils';
import type * as ts from 'typescript';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    hasSuggestions: true,
    docs: {
      description: 'Disallow constant string expressions in template literals',
      requiresTypeChecking: true,
      strict: true,
    },
    schema: [],
    messages: {
      noConstantTemplateExpression:
        "Replace this constant template expression by its value as a string ('{{value}}')",
      replaceByString: "Replace by '{{value}}'",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      TemplateLiteral(node) {
        const services = ESLintUtils.getParserServices(context);
        const checker = services.program.getTypeChecker();

        const { expressions, quasis } = node;

        for (const expr of expressions) {
          const type = services.getTypeAtLocation(expr);

          const value = getLiteralValue(type, checker);
          if (value === null) continue;

          context.report({
            node: expr,
            messageId: 'noConstantTemplateExpression',
            data: { value },
            suggest: [
              {
                messageId: 'replaceByString',
                data: { value },
                fix(fixer) {
                  const [identStart, identEnd] = expr.range;

                  const previousQuasi = quasis
                    .toReversed()
                    .find((quasi) => quasi.range[1] <= identStart);
                  const nextQuasi = quasis.find((quasi) => quasi.range[0] >= identEnd);

                  const start = previousQuasi?.range[1] ?? node.range[0];
                  const end = nextQuasi?.range[0] ?? node.range[1];

                  const range = [start - 2, end + 1] as const;
                  return fixer.replaceTextRange(range, value);
                },
              },
            ],
          });
        }
      },
    };
  },
});

function getLiteralValue(type: ts.Type, checker: ts.TypeChecker): string | null {
  if (type.isStringLiteral()) return type.value;
  if (type.isNumberLiteral()) return type.value.toString();

  if (type === checker.getTrueType()) return 'true';
  if (type === checker.getFalseType()) return 'false';

  return null;
}
