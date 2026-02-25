import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';
import type { Option } from '../utils/option.js';
import { getFirstOption, None, Some } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid using a RegEx when string equality would suffice',
      recommended: true,
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      preferEquality: 'Just use === "{{content}}"',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      Literal(node) {
        if (!(node.value instanceof RegExp)) return;
        const re = node.value;

        const maybeContent = getExactEqualityPattern(re);
        if (!maybeContent.some) return;
        const content = maybeContent.value;

        const result = getRegexComparison(node);
        if (!result.some) return;
        const { ident, parent } = result.value;

        context.report({
          node,
          messageId: 'preferEquality',
          data: { content },
          suggest: [
            {
              messageId: 'preferEquality',
              data: { content },
              fix(fixer) {
                const compared = context.sourceCode.getText(ident);
                return fixer.replaceText(parent, `(${compared} === '${content}')`);
              },
            },
          ],
        });
      },
    };
  },
});

function getRegexComparison(
  node: TSESTree.Literal,
): Option<{ ident: TSESTree.Node; parent: TSESTree.Node }> {
  return getFirstOption([getRegexTestOrExec(node), getRegexMatch(node)]);
}

function getRegexTestOrExec(
  node: TSESTree.Literal,
): Option<{ ident: TSESTree.Node; parent: TSESTree.Node }> {
  if (node.parent.type !== AST_NODE_TYPES.MemberExpression) return None;
  if (node.parent.property.type !== AST_NODE_TYPES.Identifier) return None;
  if (node.parent.property.name !== 'test' && node.parent.property.name !== 'exec') {
    return None;
  }
  if (node.parent.parent.type !== AST_NODE_TYPES.CallExpression) return None;
  const [arg] = node.parent.parent.arguments;
  if (!arg) return None;
  return Some({ ident: arg, parent: node.parent.parent });
}

function getRegexMatch(
  node: TSESTree.Literal,
): Option<{ ident: TSESTree.Node; parent: TSESTree.Node }> {
  if (node.parent.type !== AST_NODE_TYPES.CallExpression) return None;
  if (node.parent.arguments[0] !== node) return None;
  if (node.parent.callee.type !== AST_NODE_TYPES.MemberExpression) return None;
  if (node.parent.callee.property.type !== AST_NODE_TYPES.Identifier) return None;
  if (node.parent.callee.property.name !== 'match') return None;

  return Some({ ident: node.parent.callee.object, parent: node.parent });
}

function getExactEqualityPattern(re: RegExp): Option<string> {
  if (re.ignoreCase) return None;
  if (re.multiline) return None;

  const pat = /^\^(?<content>[a-z\d]+)\$$/v;
  const result = pat.exec(re.source);
  if (!result) return None;
  const content = result.groups?.['content'];
  /* v8 ignore if -- @preserve */
  if (!content) return None;

  return Some(content);
}
