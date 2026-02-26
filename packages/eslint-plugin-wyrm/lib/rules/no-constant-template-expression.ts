/**
 * @fileoverview
 *
 * It is sometimes clearer to inline interpolated expressions when their values are constant:
 *
 * @example
 * ```ts
 * const foo = 'foobar';
 * const str = `${foo}_baz`;
 * // This would be clearer as:
 * const str = 'foobar_baz';
 * ```
 *
 * By default, this rule allows constant values when they take up at least 10 characters.
 * This can be configured with the `minAllowedLength` option.
 *
 */

import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import {
  AST_NODE_TYPES,
  ASTUtils,
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/utils';
import * as ts from 'typescript';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

const DEFAULT_MIN_ALLOWED_LENGTH = 10;

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow constant string expressions in template literals',
      requiresTypeChecking: true,
      strict: true,
    },
    hasSuggestions: true,
    schema: [
      {
        type: 'object',
        properties: {
          minAllowedLength: {
            type: 'number',
            description: `Minimum string length allowed for constant expressions. Default: ${DEFAULT_MIN_ALLOWED_LENGTH}`,
          },
        },
      },
    ],
    messages: {
      noConstantTemplateExpression:
        "Replace this constant template expression by its value as a string ('{{value}}')",
      replaceByString: "Replace by '{{value}}'",
    },
  },
  defaultOptions: [{ minAllowedLength: DEFAULT_MIN_ALLOWED_LENGTH }],
  create(context, [options]) {
    function checkExpression(
      expr: TSESTree.Expression,
      quasis: TSESTree.TemplateElement[],
      scope: TSESLint.Scope.Scope,
    ) {
      if (expr.type === AST_NODE_TYPES.Identifier) {
        const variable = ASTUtils.findVariable(scope, expr);
        if (variable) {
          const { references, defs } = variable;
          if (references.length > 2) return;

          const def = defs.at(-1);
          if (
            def?.parent?.type === AST_NODE_TYPES.VariableDeclaration &&
            def.parent.parent.type === AST_NODE_TYPES.ExportNamedDeclaration
          ) {
            return;
          }

          if (def?.type !== TSESLint.Scope.DefinitionType.Variable) {
            return;
          }

          if (isNonAlphabeticStringLiteral(def.node)) {
            return;
          }
        }
      }

      const services = ESLintUtils.getParserServices(context);
      const checker = services.program.getTypeChecker();

      const type = services.getTypeAtLocation(expr);

      const value = getLiteralValue(type, checker);
      if (value === null) return;

      if (value.length >= options.minAllowedLength) return;

      const sym = services.getSymbolAtLocation(expr);
      if (
        sym &&
        sym.getFlags() & ts.SymbolFlags.EnumMember &&
        !quasis.some((quasi) => quasi.value.cooked)
      ) {
        return;
      }

      context.report({
        node: expr,
        messageId: 'noConstantTemplateExpression',
        data: { value },
        suggest: [
          {
            messageId: 'replaceByString',
            data: { value },
            *fix(fixer) {
              const [identStart, identEnd] = expr.range;

              const previousQuasi = quasis
                .toReversed()
                .find((quasi) => quasi.range[1] <= identStart);
              const nextQuasi = quasis.find((quasi) => quasi.range[0] >= identEnd);

              /* v8 ignore if -- @preserve */
              if (!previousQuasi || !nextQuasi) {
                const msg =
                  '[wyrm] No previous/next quasi found. This should never happen.';
                console.error(msg);
                return;
              }

              const start = previousQuasi.range[1];
              const end = nextQuasi.range[0];

              const range = [start - 2, end + 1] as const;
              yield fixer.replaceTextRange(range, value);
            },
          },
        ],
      });
    }

    return {
      TemplateLiteral(node) {
        const { expressions, quasis } = node;

        if (quasis.some((quasi) => quasi.value.cooked.includes(' '))) return;

        const scope = context.sourceCode.getScope(node);

        for (const expr of expressions) {
          checkExpression(expr, quasis, scope);
        }
      },
    };
  },
});

function getLiteralValue(type: ts.Type, checker: ts.TypeChecker): string | null {
  if (type.isStringLiteral()) return type.value;

  if (type === checker.getTrueType()) return 'true';
  if (type === checker.getFalseType()) return 'false';

  return null;
}

function isNonAlphabeticStringLiteral(node: TSESTree.VariableDeclarator): boolean {
  return (
    node.init?.type === AST_NODE_TYPES.Literal &&
    typeof node.init.value === 'string' &&
    /[^a-zA-Z]/u.test(node.init.value)
  );
}
