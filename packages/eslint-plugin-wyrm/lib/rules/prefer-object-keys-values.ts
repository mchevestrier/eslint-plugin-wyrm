import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce using `Object.keys()` and `Object.values()` rather than `Object.entries()`',
      strict: true,
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      preferObjectKeys: 'You are only using keys, use `Object.keys()` instead',
      preferObjectValues: 'You are only using values, use `Object.values()` instead',
      useObjectKeys: 'Use `Object.keys()`',
      useObjectValues: 'Use `Object.values()`',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return;
        if (node.callee.property.type !== AST_NODE_TYPES.Identifier) return;
        if (node.callee.object.type !== AST_NODE_TYPES.CallExpression) return;
        if (node.callee.object.callee.type !== AST_NODE_TYPES.MemberExpression) return;

        if (node.callee.object.callee.object.type !== AST_NODE_TYPES.Identifier) return;
        if (node.callee.object.callee.property.type !== AST_NODE_TYPES.Identifier) return;

        if (node.callee.object.callee.object.name !== 'Object') return;
        const objectMethod = node.callee.object.callee.property;
        if (objectMethod.name !== 'entries') return;

        const methods = ['map', 'forEach', 'every', 'some'];
        if (!methods.includes(node.callee.property.name)) return;

        const [arg] = node.arguments;
        if (!arg) return;
        if (
          arg.type !== AST_NODE_TYPES.FunctionExpression &&
          arg.type !== AST_NODE_TYPES.ArrowFunctionExpression
        ) {
          return;
        }

        const [param] = arg.params;
        if (!param) return;
        if (param.type !== AST_NODE_TYPES.ArrayPattern) return;

        const [keyParam, valueParam, ...rest] = param.elements;
        if (rest.length) return;

        if (!valueParam && keyParam?.type === AST_NODE_TYPES.Identifier) {
          context.report({
            node,
            messageId: 'preferObjectKeys',
            suggest: [
              {
                messageId: 'useObjectKeys',
                *fix(fixer) {
                  yield fixer.replaceText(objectMethod, 'keys');
                  yield fixer.replaceText(param, keyParam.name);
                },
              },
            ],
          });
          return;
        }

        if (keyParam === null && valueParam?.type === AST_NODE_TYPES.Identifier) {
          context.report({
            node,
            messageId: 'preferObjectValues',
            suggest: [
              {
                messageId: 'useObjectValues',
                *fix(fixer) {
                  yield fixer.replaceText(objectMethod, 'values');
                  yield fixer.replaceText(param, valueParam.name);
                },
              },
            ],
          });
        }
      },
    };
  },
});
