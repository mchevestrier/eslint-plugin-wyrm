import path from 'node:path';

import { AST_NODE_TYPES, AST_TOKEN_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

import { areTokensEqual } from '../utils/compareTokens.js';
import { createRule } from '../utils/createRule.js';
import { None, Option, Some } from '../utils/option.js';

export const { name } = path.parse(import.meta.filename);

export default createRule({
  name,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Forbid if/else branches where the only difference is a boolean literal',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      noConditionalBoolean:
        'Collapse this condition to a single statement by using the test as a boolean',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      IfStatement(node) {
        const { consequent, alternate } = node;
        if (!alternate) return;

        const maybeConsequentStmt = getUniqueStatement(consequent);
        if (!maybeConsequentStmt.some) return;
        const consequentStmt = maybeConsequentStmt.value;

        const maybeAlternateStmt = getUniqueStatement(alternate);
        if (!maybeAlternateStmt.some) return;
        const alternateStmt = maybeAlternateStmt.value;

        const consequentTokens = context.sourceCode.getTokens(consequentStmt);
        const alternateTokens = context.sourceCode.getTokens(alternateStmt);

        if (consequentTokens.length !== alternateTokens.length) return;

        const booleanTokens = new Set<TSESTree.BooleanToken>();

        for (const [i, consequentTok] of consequentTokens.entries()) {
          const alternateTok = alternateTokens[i];
          if (!alternateTok) return;

          if (consequentTok.type !== alternateTok.type) return;

          if (
            consequentTok.type === AST_TOKEN_TYPES.Boolean &&
            alternateTok.type === AST_TOKEN_TYPES.Boolean &&
            consequentTok.value !== alternateTok.value
          ) {
            booleanTokens.add(consequentTok);
            continue;
          }

          if (!areTokensEqual(consequentTok, alternateTok)) return;
        }

        if (!booleanTokens.size) return;

        context.report({
          node,
          messageId: 'noConditionalBoolean',
          *fix(fixer) {
            const testTxt = context.sourceCode.getText(node.test);

            for (const tok of booleanTokens) {
              const replacement =
                tok.value === 'true' ? `!!(${testTxt})` : `!(${testTxt})`;
              yield fixer.replaceTextRange(tok.range, replacement);
            }

            const ifRange = [node.range[0], consequentStmt.range[0]] as const;
            yield fixer.removeRange(ifRange);

            const elseRange = [consequentStmt.range[1], node.range[1]] as const;
            yield fixer.removeRange(elseRange);
          },
        });
      },
    };
  },
});

function getUniqueStatement(stmt: TSESTree.Statement) {
  if (stmt.type !== AST_NODE_TYPES.BlockStatement) {
    return Some(stmt);
  }

  if (stmt.body.length !== 1) return None;

  return Option.fromUndef(stmt.body[0]);
}
