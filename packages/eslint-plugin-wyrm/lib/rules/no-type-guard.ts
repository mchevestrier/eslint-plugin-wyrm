import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Forbid type guards',
      pedantic: true,
    },
    schema: [],
    messages: {
      noTypeGuard: 'Type guards are forbidden.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      FunctionDeclaration: checkFunction,
      FunctionExpression: checkFunction,
      ArrowFunctionExpression: checkFunction,
    };

    type FunctionNode =
      | TSESTree.FunctionDeclaration
      | TSESTree.FunctionExpression
      | TSESTree.ArrowFunctionExpression;

    function checkFunction(fn: FunctionNode) {
      if (fn.parent.type === AST_NODE_TYPES.CallExpression) return;

      if (!fn.returnType) return;
      if (fn.returnType.typeAnnotation.type !== AST_NODE_TYPES.TSTypePredicate) {
        return;
      }

      context.report({ node: fn, messageId: 'noTypeGuard' });
    }
  },
});
