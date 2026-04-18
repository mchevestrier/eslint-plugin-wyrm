import { defineConfig } from 'tsdown';

export default defineConfig({
  unbundle: true,
  dts: true,
  entry: ['lib/index.ts', 'lib/cli.ts'],
  outDir: 'dist',
});
