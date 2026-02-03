import * as rules from './rules/index.js';

const ruleNames = Object.keys(rules);

/**
 * @typedef {Object} CompatibleConfig
 * @property {string} [name]
 * @property {object} [rules]
 */

const externalRuleNames = ruleNames.map((ruleName) => `internal/${ruleName}`);
const rulesConfig = Object.fromEntries(
  externalRuleNames.map((key) => /** @type {const} */ ([key, 'error'])),
);

const configs = {
  recommended: {
    name: 'recommended',
    rules: rulesConfig,
    plugins: {
      get internal() {
        return plugin;
      },
    },
  },
};

const plugin = {
  rules,
  configs: /** @type {Record<keyof typeof configs, CompatibleConfig>} */ (configs),
};

export default plugin;
