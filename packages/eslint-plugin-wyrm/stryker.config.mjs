// @ts-check

/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  packageManager: 'pnpm',
  reporters: ['html', 'clear-text', 'progress'],
  testRunner: 'vitest',

  coverageAnalysis: 'perTest',

  ignoreStatic: true,
  allowConsoleColors: true,
  incremental: true,

  plugins: ['@stryker-mutator/vitest-runner', '@stryker-mutator/typescript-checker'],

  ignorePatterns: ['dist', 'coverage', 'scripts', 'lib/rules/index.ts'],

  checkers: ['typescript'],
  tsconfigFile: 'tsconfig.json',
  typescriptChecker: {
    prioritizePerformanceOverAccuracy: false,
  },
};
export default config;

process.env['STRYKER_MUTATOR'] = '1';
