import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['dist/*', 'coverage/*', 'node_modules/'],
    setupFiles: ['./test/setupFiles.ts'],
    coverage: {
      provider: 'v8',
    },
  },
});
