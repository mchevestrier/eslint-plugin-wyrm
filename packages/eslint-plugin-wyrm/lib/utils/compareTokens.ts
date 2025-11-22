import type { TSESTree } from '@typescript-eslint/utils';
import { AST_TOKEN_TYPES } from '@typescript-eslint/utils';

export function compareTokens(
  tokensA: TSESTree.Token[],
  tokensB: TSESTree.Token[],
): boolean {
  const [a, ...restA] = tokensA;
  const [b, ...restB] = tokensB;

  if (a === undefined && b === undefined) return true;

  if (a === undefined) return false;
  if (b === undefined) return false;

  if (!areTokensEqual(a, b)) {
    return false;
  }

  return compareTokens(restA, restB);
}

function areTokensEqual(a: TSESTree.Token, b: TSESTree.Token): boolean {
  // Not sure if it's possible for two tokens to have different types but the same value
  // Stryker disable ConditionalExpression
  if (a.type !== b.type) return false;

  if (a.type === AST_TOKEN_TYPES.String) {
    return a.value.slice(1, -1) === b.value.slice(1, -1);
  }

  return a.value === b.value;
}
