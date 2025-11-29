import type { FlatConfig, RuleModule } from '@typescript-eslint/utils/ts-eslint';

import { plugin } from '../plugin.js';
import * as allRules from '../rules/index.js';
import type { WyrmPluginDocs } from '../utils/createRule.js';

type Config = FlatConfig.Config;

type Rule = RuleModule<string, unknown[], WyrmPluginDocs>;

const baseConfig: Omit<Config, 'rules'> = {
  plugins: {
    get wyrm() {
      return plugin;
    },
  },
};

function createConfigWithRules(
  initialRules: Record<string, Rule>,
  configName: string,
  pred: (rule: Rule) => boolean,
): Config {
  const entries = Object.entries(initialRules);
  const filteredRules = entries
    .filter(([, rule]) => pred(rule))
    .map(([ruleName]) => [`wyrm/${ruleName}`, 'error'] as const);

  const rules = Object.fromEntries(filteredRules);
  return {
    ...baseConfig,
    name: `wyrm/${configName}`,
    rules,
  };
}

export const all: Config = createConfigWithRules(allRules, 'all', () => true);

export const recommended: Config = createConfigWithRules(
  allRules,
  'recommended',
  (rule) => {
    if (rule.meta.deprecated) return false;
    if (rule.meta.docs?.requiresTypeChecking) return false;
    return !!rule.meta.docs?.recommended;
  },
);

export const strictOnly: Config = createConfigWithRules(
  allRules,
  'strictOnly',
  (rule) => {
    if (rule.meta.deprecated) return false;
    if (rule.meta.docs?.requiresTypeChecking) return false;
    return !!rule.meta.docs?.strict;
  },
);

export const strict: Config = {
  ...baseConfig,
  name: 'wyrm/strict',
  rules: {
    ...recommended.rules,
    ...strictOnly.rules,
  },
};

// Type checked configs

export const recommendedTypeCheckedOnly: Config = createConfigWithRules(
  allRules,
  'recommendedTypeCheckedOnly',
  (rule) => {
    if (rule.meta.deprecated) return false;
    if (!rule.meta.docs?.requiresTypeChecking) return false;
    return !!rule.meta.docs.recommended;
  },
);

export const recommendedTypeChecked: Config = {
  ...baseConfig,
  name: 'wyrm/recommendedTypeChecked',
  rules: {
    ...recommended.rules,
    ...recommendedTypeCheckedOnly.rules,
  },
};

export const strictTypeCheckedOnly: Config = createConfigWithRules(
  allRules,
  'strictTypeCheckedOnly',
  (rule) => {
    if (rule.meta.deprecated) return false;
    if (!rule.meta.docs?.requiresTypeChecking) return false;
    return !!rule.meta.docs.strict;
  },
);

export const strictTypeChecked: Config = {
  ...baseConfig,
  name: 'wyrm/strictTypeChecked',
  rules: {
    ...recommendedTypeChecked.rules,
    ...strictOnly.rules,
    ...strictTypeCheckedOnly.rules,
  },
};
