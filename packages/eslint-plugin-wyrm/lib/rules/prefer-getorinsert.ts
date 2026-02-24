import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

import { createRule } from '../utils/createRule.js';
import { None, Some } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce using `Map#getOrInsert`',
      strict: true,
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      preferGetOrInsert: 'Prefer Map#getOrInsert',
      useGetOrInsert: 'Use Map#getOrInsert',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      IfStatement(node) {
        const maybeMapHasCall = getMapHasCall(node.test);
        if (!maybeMapHasCall.some) return;
        const { hasKey, mapName } = maybeMapHasCall.value;

        if (node.alternate) return;
        if (node.parent.type !== AST_NODE_TYPES.BlockStatement) return;

        // Check consequent branch: return map.get(key)
        const maybeUniqueReturnStmt = getUniqueReturnStatement(node.consequent);
        if (!maybeUniqueReturnStmt.some) return;
        const thenStmt = maybeUniqueReturnStmt.value;
        if (!thenStmt.argument) return;

        const maybeMapGetCall = getMapGetCall(thenStmt.argument);
        if (!maybeMapGetCall.some) return;
        if (maybeMapGetCall.value.mapName !== mapName) return;
        const { getKey } = maybeMapGetCall.value;

        // Make sure keys match
        const hasKeyText = context.sourceCode.getText(hasKey);
        const getKeyText = context.sourceCode.getText(getKey);
        if (hasKeyText !== getKeyText) return;

        // Check next two statements
        const siblings = node.parent.body;
        const ifIndex = siblings.indexOf(node);
        const setStmt = siblings[ifIndex + 1];
        if (!setStmt) return;
        const returnStmt = siblings[ifIndex + 2];
        if (!returnStmt) return;

        // Check set statement:  map.set(key, defaultValue);
        if (setStmt.type !== AST_NODE_TYPES.ExpressionStatement) return;
        const maybeMapSetCall = getMapSetCall(setStmt.expression);
        if (!maybeMapSetCall.some) return;
        if (maybeMapSetCall.value.mapName !== mapName) return;
        const { setKey, setValue } = maybeMapSetCall.value;

        const setKeyText = context.sourceCode.getText(setKey);
        if (setKeyText !== hasKeyText) return;

        // Check return statement: return defaultValue;
        if (returnStmt.type !== AST_NODE_TYPES.ReturnStatement) return;
        if (!returnStmt.argument) return;
        const returnText = context.sourceCode.getText(returnStmt.argument);
        const setValueText = context.sourceCode.getText(setValue);
        if (returnText !== setValueText) return;

        context.report({
          node,
          messageId: 'preferGetOrInsert',
          suggest: [
            {
              messageId: 'useGetOrInsert',
              fix(fixer) {
                const start = node.range[0];
                const end = returnStmt.range[1];
                return fixer.replaceTextRange(
                  [start, end],
                  `return ${mapName}.getOrInsert(${hasKeyText}, ${setValueText});`,
                );
              },
            },
          ],
        });
      },

      CallExpression(node) {
        const maybeMapSetCall = getMapSetCall(node);
        if (!maybeMapSetCall.some) return;
        const { setKey, setValue, mapName } = maybeMapSetCall.value;

        if (setValue.type !== AST_NODE_TYPES.LogicalExpression) return;
        if (setValue.operator !== '??') return;

        const maybeMapGetCall = getMapGetCall(setValue.left);
        if (!maybeMapGetCall.some) return;
        if (maybeMapGetCall.value.mapName !== mapName) return;

        const { getKey } = maybeMapGetCall.value;
        const setKeyText = context.sourceCode.getText(setKey);
        const getKeyText = context.sourceCode.getText(getKey);
        if (getKeyText !== setKeyText) return;

        const defaultValueText = context.sourceCode.getText(setValue.right);

        context.report({
          node,
          messageId: 'preferGetOrInsert',
          suggest: [
            {
              messageId: 'useGetOrInsert',
              fix(fixer) {
                return fixer.replaceText(
                  node,
                  `${mapName}.getOrInsert(${setKeyText}, ${defaultValueText})`,
                );
              },
            },
          ],
        });
      },

      LogicalExpression(node) {
        if (node.operator !== '||' && node.operator !== '??') return;
        const maybeMapGetCall = getMapGetCall(node.left);
        if (!maybeMapGetCall.some) return;
        const { getKey, mapName } = maybeMapGetCall.value;

        if (node.right.type !== AST_NODE_TYPES.LogicalExpression) return;
        if (node.right.operator !== '&&') return;

        const maybeMapSetCall = getMapSetCall(node.right.left);
        if (!maybeMapSetCall.some) return;
        if (maybeMapSetCall.value.mapName !== mapName) return;
        const { setKey, setValue } = maybeMapSetCall.value;

        const getKeyText = context.sourceCode.getText(getKey);
        const setKeyText = context.sourceCode.getText(setKey);
        if (getKeyText !== setKeyText) return;

        const rightSideText = context.sourceCode.getText(node.right.right);
        const setValueText = context.sourceCode.getText(setValue);
        const leftSideText = context.sourceCode.getText(node.left);

        if (rightSideText === setValueText || rightSideText === leftSideText) {
          context.report({
            node,
            messageId: 'preferGetOrInsert',
            suggest: [
              {
                messageId: 'useGetOrInsert',
                fix(fixer) {
                  return fixer.replaceText(
                    node,
                    `${mapName}.getOrInsert(${getKeyText}, ${setValueText})`,
                  );
                },
              },
            ],
          });
        }
      },
    };
  },
});

function getMapHasCall(node: TSESTree.Expression) {
  if (node.type !== AST_NODE_TYPES.CallExpression) return None;
  if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return None;
  if (node.callee.object.type !== AST_NODE_TYPES.Identifier) return None;
  if (node.callee.property.type !== AST_NODE_TYPES.Identifier) return None;
  if (node.callee.property.name !== 'has') return None;

  const [hasKey] = node.arguments;
  // Stryker disable ConditionalExpression
  if (!hasKey) return None;

  const mapName = node.callee.object.name;

  return Some({ hasKey, mapName });
}

function getUniqueReturnStatement(node: TSESTree.Statement) {
  if (node.type === AST_NODE_TYPES.ReturnStatement) return Some(node);
  if (node.type !== AST_NODE_TYPES.BlockStatement) return None;
  const [stmt] = node.body;
  if (!stmt) return None;
  if (node.body.length > 1) return None;
  if (stmt.type !== AST_NODE_TYPES.ReturnStatement) return None;
  return Some(stmt);
}

function getMapGetCall(node: TSESTree.Expression) {
  if (node.type !== AST_NODE_TYPES.CallExpression) return None;
  if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return None;
  if (node.callee.object.type !== AST_NODE_TYPES.Identifier) return None;
  if (node.callee.property.type !== AST_NODE_TYPES.Identifier) return None;
  if (node.callee.property.name !== 'get') return None;

  const mapName = node.callee.object.name;

  if (node.arguments.length > 1) return None;
  const [getKey] = node.arguments;
  // Stryker disable ConditionalExpression
  if (!getKey) return None;

  return Some({ getKey, mapName });
}

function getMapSetCall(node: TSESTree.Expression) {
  if (node.type !== AST_NODE_TYPES.CallExpression) return None;
  if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return None;
  if (node.callee.object.type !== AST_NODE_TYPES.Identifier) return None;
  if (node.callee.property.type !== AST_NODE_TYPES.Identifier) return None;
  if (node.callee.property.name !== 'set') return None;

  const mapName = node.callee.object.name;

  if (node.arguments.length > 2) return None;
  const [setKey, setValue] = node.arguments;
  if (!setKey || !setValue) return None;
  return Some({ setKey, setValue, mapName });
}
