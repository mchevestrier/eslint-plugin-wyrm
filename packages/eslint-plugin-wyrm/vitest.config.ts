import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['dist/*', 'coverage/*', 'node_modules/*', '.stryker-tmp/*', 'reports/*'],
    setupFiles: ['./test/setupFiles.ts'],
    coverage: {
      provider: 'v8',
      include: ['lib/rules', 'lib/utils'],
      exclude: ['lib/rules/index.ts', 'lib/rules/fixtures/'],
      thresholds: {
        perFile: true,
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
  },
});
