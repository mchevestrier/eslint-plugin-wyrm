import path from 'node:path';

import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import * as ts from 'typescript';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce idiomatic ways to cast values',
      requiresTypeChecking: true,
      strict: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      useToString: 'Use the `.toString()` method to convert a number to a string.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type !== AST_NODE_TYPES.Identifier) return;
        if (node.callee.name !== 'String') return;

        const [arg] = node.arguments;
        if (!arg) return;

        const services = ESLintUtils.getParserServices(context);
        const argType = services.getTypeAtLocation(arg);

        if (argType.isUnion()) return;
        if ((argType.flags & ts.TypeFlags.NumberLike) === 0) return;

        context.report({
          node,
          messageId: 'useToString',
          fix(fixer) {
            const argText = context.sourceCode.getText(arg);
            const text =
              arg.type === AST_NODE_TYPES.Identifier
                ? `${argText}.toString()`
                : `(${argText}).toString()`;
            return fixer.replaceText(node, text);
          },
        });
      },
    };
  },
});
