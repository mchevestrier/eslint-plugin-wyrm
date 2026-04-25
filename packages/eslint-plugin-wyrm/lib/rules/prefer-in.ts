/**
 * @fileoverview
 *
 * `x in y` does not have the same behavior as `Object.hasOwn(y, x)` and `Object.prototype.hasOwnProperty.call(y, x)`.
 *
 * But in the majority of cases, the difference does not really matter (modern codebases should already avoid objects with prototype chains anyway).
 *
 * `x in y` is also more readable and better supported in TypeScript flow analysis for type narrowing.
 */

import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';
import { getFirstOption, None, Some } from '../utils/option.js';
import type { Option } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prefer `in` to `Object.hasOwn()` and `Object.prototype.hasOwnProperty.call()`',
      strict: true,
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      preferIn: 'See if you can use `in` instead',
      useIn: 'Use `in`',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        const maybeArgs = getFirstOption([
          getObjectHasOwn(node),
          getHasOwnPropertyCall(node),
        ]);
        if (!maybeArgs.some) return;
        const [key, value] = maybeArgs.value;

        context.report({
          node,
          messageId: 'preferIn',
          suggest: [
            {
              messageId: 'useIn',
              fix(fixer) {
                const keyText = context.sourceCode.getText(key);
                const valueText = context.sourceCode.getText(value);
                return fixer.replaceText(node, `${keyText} in ${valueText}`);
              },
            },
          ],
        });
      },
    };
  },
});

// Object.hasOwn()
function getObjectHasOwn(
  node: TSESTree.CallExpression,
): Option<[TSESTree.Node, TSESTree.Node]> {
  if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return None;

  if (node.callee.object.type !== AST_NODE_TYPES.Identifier) return None;
  if (node.callee.property.type !== AST_NODE_TYPES.Identifier) return None;

  if (node.callee.object.name !== 'Object') return None;
  if (node.callee.property.name !== 'hasOwn') return None;

  const [arg1, arg2] = node.arguments;

  if (!arg1) return None;
  if (!arg2) return None;

  return Some([arg2, arg1]);
}

// Object.prototype.hasOwnProperty.call()
function getHasOwnPropertyCall(
  node: TSESTree.CallExpression,
): Option<[TSESTree.Node, TSESTree.Node]> {
  if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return None;

  if (node.callee.property.type !== AST_NODE_TYPES.Identifier) return None;
  if (node.callee.property.name !== 'call') return None;

  if (node.callee.object.type !== AST_NODE_TYPES.MemberExpression) return None;
  if (node.callee.object.property.type !== AST_NODE_TYPES.Identifier) return None;
  if (node.callee.object.property.name !== 'hasOwnProperty') return None;

  if (node.callee.object.object.type !== AST_NODE_TYPES.MemberExpression) return None;
  if (node.callee.object.object.property.type !== AST_NODE_TYPES.Identifier) return None;
  if (node.callee.object.object.property.name !== 'prototype') return None;

  if (node.callee.object.object.object.type !== AST_NODE_TYPES.Identifier) return None;
  if (node.callee.object.object.object.name !== 'Object') return None;

  const [arg1, arg2] = node.arguments;

  if (!arg1) return None;
  if (!arg2) return None;

  return Some([arg2, arg1]);
}
