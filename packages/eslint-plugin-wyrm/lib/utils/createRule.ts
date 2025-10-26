import { ESLintUtils } from '@typescript-eslint/utils';

export type WyrmPluginDocs = {
  description: string;
  requiresTypeChecking?: boolean;
} & ({ recommended: true; strict?: never } | { recommended?: never; strict: true });

export const createRule = ESLintUtils.RuleCreator<WyrmPluginDocs>(
  (name) =>
    `https://github.com/mchevestrier/eslint-plugin-wyrm/blob/master/packages/eslint-plugin-wyrm/docs/rules/${name}.md`,
);
