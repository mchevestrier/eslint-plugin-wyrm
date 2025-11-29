import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';
import { None, Option, Some } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce usage of `String.prototype.repeat`',
      recommended: true,
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      preferRepeat: 'This could be simplified as `{{fixed}}`',
      replaceByRepeat: 'Replace by `{{fixed}}`',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return;
        if (node.callee.property.type !== AST_NODE_TYPES.Identifier) return;
        if (!['reduce', 'reduceRight'].includes(node.callee.property.name)) return;

        const length = getConstructedArrayLength(node.callee.object);
        if (!length.some) return;

        const [arg] = node.arguments;
        if (!arg) return;
        const repeatedString = getRepeatedString(arg);
        if (!repeatedString.some) return;

        const n = context.sourceCode.getText(length.value);

        const str =
          typeof repeatedString.value === 'string'
            ? `'${repeatedString.value}'`
            : context.sourceCode.getText(repeatedString.value);

        const fixed = `${str}.repeat(${n})`;

        context.report({
          node,
          messageId: 'preferRepeat',
          data: { fixed },
          suggest: [
            {
              messageId: 'replaceByRepeat',
              data: { fixed },
              fix(fixer) {
                return fixer.replaceText(node, fixed);
              },
            },
          ],
        });
      },
    };
  },
});

function getConstructedArrayLength(expr: TSESTree.Expression): Option<TSESTree.Node> {
  if (expr.type !== AST_NODE_TYPES.CallExpression) return None;
  const { callee } = expr;

  if (callee.type !== AST_NODE_TYPES.MemberExpression) return None;
  if (callee.property.type !== AST_NODE_TYPES.Identifier) return None;

  // Array.from({length: n})
  if (callee.property.name === 'from') {
    if (callee.object.type !== AST_NODE_TYPES.Identifier) return None;
    if (callee.object.name !== 'Array') return None;
    if (expr.arguments[0]?.type !== AST_NODE_TYPES.ObjectExpression) return None;

    const { properties } = expr.arguments[0];
    const length = properties
      .filter((prop) => prop.type === AST_NODE_TYPES.Property)
      .find(
        (prop) =>
          prop.key.type === AST_NODE_TYPES.Identifier && prop.key.name === 'length',
      );
    if (!length) return None;

    return Some(length.value);
  }

  // Array(n).fill()
  if (callee.property.name !== 'fill') return None;
  if (
    callee.object.type === AST_NODE_TYPES.CallExpression ||
    callee.object.type === AST_NODE_TYPES.NewExpression
  ) {
    return Option.fromUndef(callee.object.arguments[0]);
  }

  return None;
}

function getRepeatedString(
  callback: TSESTree.CallExpressionArgument,
): Option<string | TSESTree.Node> {
  if (
    callback.type !== AST_NODE_TYPES.FunctionExpression &&
    callback.type !== AST_NODE_TYPES.ArrowFunctionExpression
  ) {
    return None;
  }

  const [acc] = callback.params;
  if (!acc) return None;
  if (acc.type !== AST_NODE_TYPES.Identifier) return None;

  if (callback.body.type !== AST_NODE_TYPES.BlockStatement) {
    return extractRepeatedString(callback.body, acc);
  }

  const returnStatement = callback.body.body.at(-1);
  if (returnStatement?.type !== AST_NODE_TYPES.ReturnStatement) return None;
  if (!returnStatement.argument) return None;
  return extractRepeatedString(returnStatement.argument, acc);
}

function extractRepeatedString(
  expr: TSESTree.Expression,
  acc: TSESTree.Identifier,
): Option<string | TSESTree.Node> {
  if (expr.type === AST_NODE_TYPES.TemplateLiteral) {
    return extractRepeatedStringFromTemplateLiteral(expr, acc);
  }

  if (expr.type === AST_NODE_TYPES.CallExpression) {
    return extractRepeatedStringFromCallExpression(expr, acc);
  }
  return None;
}

function extractRepeatedStringFromTemplateLiteral(
  expr: TSESTree.TemplateLiteral,
  acc: TSESTree.Identifier,
): Option<string | TSESTree.Node> {
  // `${str}${acc}`
  // `${acc}${str}`
  if (expr.expressions.length === 2) {
    const str = expr.expressions.find(
      (expression) =>
        expression.type !== AST_NODE_TYPES.Identifier || expression.name !== acc.name,
    );
    return Option.fromUndef(str);
  }

  // `*${acc}`
  // `${acc}*`
  if (expr.expressions.length !== 1) return None;
  if (expr.expressions[0]?.type !== AST_NODE_TYPES.Identifier) return None;
  if (expr.expressions[0].name !== acc.name) return None;
  // if (expr.quasis.length !== 2) return None;
  const nonEmptyQuasis = expr.quasis.map((q) => q.value.cooked).filter(Boolean);
  const firstQuasi = nonEmptyQuasis.at(0);
  if (!firstQuasi) return None;
  if (nonEmptyQuasis.length === 1) {
    return Some(firstQuasi);
  }

  if (nonEmptyQuasis.every((quasi) => quasi === firstQuasi)) {
    return Some(firstQuasi.repeat(nonEmptyQuasis.length));
  }

  return None;
}

function extractRepeatedStringFromCallExpression(
  expr: TSESTree.CallExpression,
  acc: TSESTree.Identifier,
): Option<string | TSESTree.Node> {
  //  Acc.concat('*')
  if (expr.callee.type !== AST_NODE_TYPES.MemberExpression) return None;
  if (expr.callee.property.type !== AST_NODE_TYPES.Identifier) return None;
  if (expr.callee.property.name !== 'concat') return None;
  if (expr.callee.object.type !== AST_NODE_TYPES.Identifier) return None;
  if (expr.callee.object.name !== acc.name) return None;
  return Option.fromUndef(expr.arguments[0]);
}
