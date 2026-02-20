import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  treatConfigHintsAsErrors: true,
  workspaces: {
    '.github/ecosystem': {
      entry: ['./*/*/eslint.ecosystem.mjs'],
    },

    'packages/eslint-plugin-wyrm': {
      entry: ['.eslint-doc-generatorrc.ts', '.markdownlint-cli2.mjs'],
      ignoreFiles: ['./lib/rules/fixtures/*'],
    },
  },
};

export default config;
