import { ESLintUtils } from '@typescript-eslint/utils';

export const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-internal/lib/rules/${name}.js`,
);
