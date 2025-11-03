import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  workspaces: {
    'packages/eslint-plugin-wyrm': {
      entry: ['.eslint-doc-generatorrc.ts'],
    },
  },
};

export default config;
