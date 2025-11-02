import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  ignore: ['examples/**'],
  workspaces: {
    'packages/eslint-plugin-wyrm': {
      entry: ['.eslint-doc-generatorrc.ts'],
    },
  },
};

export default config;
