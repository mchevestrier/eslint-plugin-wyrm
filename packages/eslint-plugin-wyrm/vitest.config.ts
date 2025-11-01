import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['dist/*', 'coverage/*'],
    setupFiles: ['./test/setupFiles.ts'],
    coverage: {
      provider: 'v8',
    },
  },
});
