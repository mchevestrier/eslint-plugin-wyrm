import * as configs from './configs/index.js';
import * as rules from './rules/index.js';

interface CompatibleConfig {
  name?: string;
  rules?: object;
}

const plugin = {
  rules,
  configs: configs as Record<keyof typeof configs, CompatibleConfig>,
};

export default plugin;
