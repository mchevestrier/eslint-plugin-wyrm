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
      description: 'Forbid duplicated branches with early returns',
      recommended: true,
    },
    schema: [],
    messages: {
      noDuplicatedReturn: 'The return value is the same in both cases',
    },
  },
  defaultOptions: [],
  create(context) {
    function checkBody(
      node:
        | TSESTree.FunctionDeclaration
        | TSESTree.FunctionExpression
        | TSESTree.ArrowFunctionExpression,
    ) {
      if (node.body.type !== AST_NODE_TYPES.BlockStatement) return;
      const { body } = node.body;

      const lastStatement = body.at(-1);
      const beforeLastStatement = body.at(-2);

      if (!lastStatement) return;
      if (!beforeLastStatement) return;

      if (lastStatement.type !== AST_NODE_TYPES.ReturnStatement) return;
      if (beforeLastStatement.type !== AST_NODE_TYPES.IfStatement) return;

      if (beforeLastStatement.alternate) return;
      if (
        beforeLastStatement.consequent.type === AST_NODE_TYPES.BlockStatement &&
        beforeLastStatement.consequent.body.length > 1
      ) {
        return;
      }
      const consequentStatement =
        beforeLastStatement.consequent.type === AST_NODE_TYPES.BlockStatement
          ? beforeLastStatement.consequent.body.at(0)
          : beforeLastStatement.consequent;
      if (!consequentStatement) return;
      if (consequentStatement.type !== AST_NODE_TYPES.ReturnStatement) return;

      const lastReturnValue = lastStatement.argument;
      const beforeLastReturnValue = consequentStatement.argument;

      if (lastReturnValue === null && beforeLastReturnValue === null) {
        context.report({ node: consequentStatement, messageId: 'noDuplicatedReturn' });
        context.report({ node: lastStatement, messageId: 'noDuplicatedReturn' });
      }
      if (!lastReturnValue) return;
      if (!beforeLastReturnValue) return;

      const lastReturnValueText = context.sourceCode.getText(lastReturnValue);
      const beforeLastReturnValueText = context.sourceCode.getText(beforeLastReturnValue);

      if (lastReturnValueText === beforeLastReturnValueText) {
        context.report({ node: consequentStatement, messageId: 'noDuplicatedReturn' });
        context.report({ node: lastStatement, messageId: 'noDuplicatedReturn' });
      }
    }

    return {
      FunctionDeclaration: checkBody,
      FunctionExpression: checkBody,
      ArrowFunctionExpression: checkBody,
    };
  },
});
