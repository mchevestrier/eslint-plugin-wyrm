import path from 'node:path';

import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';
import { None, type Option, Some } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce using `finally` rather than duplicating code in `try` and `catch` blocks',
      strict: true,
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      preferFinally: 'Use `finally` instead of duplicating code in both branches',
      useFinally: 'Use `finally` instead',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      TryStatement(node) {
        if (!node.handler) return;

        const dup = getDuplicate(node.block, node.handler.body);

        if (!dup.some) return;

        const { lastTryStmt: lastTry, lastHandlerStmt: lastHandler, text } = dup.value;

        context.report({
          node,
          messageId: 'preferFinally',
          suggest: [
            {
              messageId: 'useFinally',
              *fix(fixer) {
                yield fixer.remove(lastTry);
                yield fixer.remove(lastHandler);
                const indent = ' '.repeat(node.loc.start.column);

                if (node.finalizer) {
                  const firstToken = context.sourceCode.getFirstToken(node.finalizer);
                  /* v8 ignore if -- @preserve */
                  if (!firstToken) return;
                  yield fixer.insertTextAfter(firstToken, `\n${indent}  ${text}`);
                } else {
                  yield fixer.insertTextAfter(
                    node,
                    ` finally {
${indent}  ${text}
${indent}}`,
                  );
                }
              },
            },
          ],
        });
      },

      CallExpression(node) {
        if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return;
        if (node.callee.object.type !== AST_NODE_TYPES.CallExpression) return;
        if (node.callee.object.callee.type !== AST_NODE_TYPES.MemberExpression) return;

        if (node.callee.property.type !== AST_NODE_TYPES.Identifier) return;
        if (node.callee.object.callee.property.type !== AST_NODE_TYPES.Identifier) return;

        const catchProp = node.callee.property;
        if (catchProp.name !== 'catch') return;
        const thenProp = node.callee.object.callee.property;
        if (thenProp.name !== 'then') return;

        const handlerBody = getBlockBody(node.arguments[0]);
        const blockBody = getBlockBody(node.callee.object.arguments[0]);

        if (!handlerBody.some || !blockBody.some) return;

        const dup = getDuplicate(blockBody.value, handlerBody.value);

        if (!dup.some) return;

        const { lastTryStmt, lastHandlerStmt, text } = dup.value;

        context.report({
          node,
          messageId: 'preferFinally',
          suggest: [
            {
              messageId: 'useFinally',
              *fix(fixer) {
                yield fixer.remove(lastTryStmt);
                yield fixer.remove(lastHandlerStmt);
                const indent = ' '.repeat(catchProp.loc.start.column - 1);
                const innerIndent = ' '.repeat(lastTryStmt.loc.start.column);

                const finalizer = getFinallyMethodBody(node);

                if (finalizer) {
                  const firstToken = context.sourceCode.getFirstToken(finalizer);
                  /* v8 ignore if -- @preserve */
                  if (!firstToken) return;
                  yield fixer.insertTextAfter(firstToken, `\n${innerIndent}${text}`);
                  return;
                }

                yield fixer.insertTextAfter(
                  node,
                  `.finally(() => {
${innerIndent}${text}
${indent}})`,
                );
              },
            },
          ],
        });
      },
    };

    type Duplicate = {
      lastTryStmt: TSESTree.Statement;
      lastHandlerStmt: TSESTree.Statement;
      text: string;
    };

    function getDuplicate(
      block: TSESTree.BlockStatement,
      handler: TSESTree.BlockStatement,
    ): Option<Duplicate> {
      const lastTryStmt = block.body.at(-1);
      const lastHandlerStmt = handler.body.at(-1);

      if (!lastTryStmt || !lastHandlerStmt) return None;
      if (block.body.length <= 1 || handler.body.length <= 1) return None;

      const tryText = context.sourceCode.getText(lastTryStmt);
      const handlerText = context.sourceCode.getText(lastHandlerStmt);

      if (tryText !== handlerText) return None;

      const handlerScope = context.sourceCode.getScope(handler);
      const lastHandlerScope = context.sourceCode.getScope(lastHandlerStmt);
      if (
        lastHandlerScope.references.some((ref) => ref.resolved?.scope === handlerScope)
      ) {
        return None;
      }

      const tryScope = context.sourceCode.getScope(block);
      const lastTryScope = context.sourceCode.getScope(lastTryStmt);
      if (lastTryScope.references.some((ref) => ref.resolved?.scope === tryScope)) {
        return None;
      }

      return Some({ lastTryStmt, lastHandlerStmt, text: tryText });
    }
  },
});

function getBlockBody(
  node: TSESTree.CallExpressionArgument | undefined,
): Option<TSESTree.BlockStatement> {
  if (!node) return None;
  if (
    node.type !== AST_NODE_TYPES.FunctionExpression &&
    node.type !== AST_NODE_TYPES.ArrowFunctionExpression
  ) {
    return None;
  }
  if (node.body.type !== AST_NODE_TYPES.BlockStatement) return None;
  return Some(node.body);
}

function getFinallyMethodBody(
  node: TSESTree.CallExpression,
): TSESTree.BlockStatement | null {
  if (node.parent.type !== AST_NODE_TYPES.MemberExpression) return null;
  if (node.parent.parent.type !== AST_NODE_TYPES.CallExpression) return null;
  if (node.parent.property.type !== AST_NODE_TYPES.Identifier) return null;
  if (node.parent.property.name !== 'finally') return null;
  const [finalizer] = node.parent.parent.arguments;
  if (!finalizer) return null;
  if (
    finalizer.type !== AST_NODE_TYPES.FunctionExpression &&
    finalizer.type !== AST_NODE_TYPES.ArrowFunctionExpression
  ) {
    return null;
  }
  if (finalizer.body.type !== AST_NODE_TYPES.BlockStatement) return null;
  return finalizer.body;
}
