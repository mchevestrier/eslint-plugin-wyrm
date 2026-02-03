import path from 'node:path';

/** @import {TSESTree} from '@typescript-eslint/utils' */

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce using `checkFormatting(this)` or explicitly ignoring formatting',
    },
    schema: [],
    messages: {
      severalIgnoringComments:
        'There are several comments explicitly ignoring formatting. This is unexpected',
      useCheckFormatting:
        "Don't forget to add `checkFormatting(this)` after the test case",
    },
  },
  create(context) {
    if (!context.filename.endsWith('.test.ts')) return {};

    return {
      ObjectExpression(node) {
        const props = node.properties
          .filter((prop) => prop.type === AST_NODE_TYPES.Property)
          .map((prop) => /** @type {const} */ ([prop.key, prop]));

        const propKeys = props
          .map(([key]) => key)
          .filter((key) => key.type === AST_NODE_TYPES.Identifier);

        if (!propKeys.some((key) => key.name === 'name')) return;
        if (!propKeys.some((key) => key.name === 'code')) return;

        const [, after] =
          props.find(([key]) => {
            if (key.type !== AST_NODE_TYPES.Identifier) return false;
            return key.name === 'after';
          }) ?? [];

        if (!after) {
          context.report({ node, messageId: 'useCheckFormatting' });
          return;
        }

        if (after.value.type !== AST_NODE_TYPES.FunctionExpression) {
          throw Error('Expected `after` key to be a method');
        }

        const method = after.value;

        const comments = context.sourceCode.getCommentsInside(method.body);
        const explicitIgnoringComments = comments.filter(
          (comment) => comment.value.trimStart() === 'Not formatted',
        );

        if (explicitIgnoringComments.length === 1) return;

        if (explicitIgnoringComments.length > 1) {
          context.report({ node: method, messageId: 'severalIgnoringComments' });
          return;
        }

        if (!method.body.body.some((stmt) => isCheckFormattingCall(stmt))) {
          context.report({ node: method, messageId: 'useCheckFormatting' });
        }
      },
    };
  },
});

/**
 * @param {TSESTree.Statement} stmt
 */
function isCheckFormattingCall(stmt) {
  if (stmt.type !== AST_NODE_TYPES.ExpressionStatement) return false;
  if (stmt.expression.type !== AST_NODE_TYPES.CallExpression) return false;
  if (stmt.expression.callee.type !== AST_NODE_TYPES.Identifier) return false;
  if (stmt.expression.callee.name !== 'checkFormatting') return false;

  const [arg] = stmt.expression.arguments;
  if (!arg || stmt.expression.arguments.length > 1) return false;
  if (arg.type !== AST_NODE_TYPES.ThisExpression) return false;

  return true;
}
