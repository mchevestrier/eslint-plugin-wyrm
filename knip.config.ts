import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  treatConfigHintsAsErrors: true,
  workspaces: {
    'packages/eslint-plugin-wyrm': {
      entry: ['.eslint-doc-generatorrc.ts'],
      ignoreFiles: ['./lib/rules/fixtures/*'],
    },
  },
};

export default config;
