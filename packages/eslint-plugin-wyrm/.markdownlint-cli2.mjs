const config = {
  config: {
    default: true,
    extends: 'markdownlint/style/prettier',
    'no-reversed-links': true,
    'table-column-style': false,
  },
  globs: ['**/*.md'],

  ignores: [
    'CHANGELOG.md',
    '**/node_modules',
    'coverage/**',
    'dist/**',
    'reports/**',
    '.stryker-tmp/**',
  ],
};

export default config;
