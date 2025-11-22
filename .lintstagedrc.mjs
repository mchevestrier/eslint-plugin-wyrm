/** @type {import('lint-staged').Configuration} */
const config = {
  'packages/eslint-plugin-wyrm/**/*': () => ['pnpm run -r lint:docs'],

  '**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}': (stagedFiles) => [
    `pnpm run eslint ${stagedFiles.join(' ')}`,
    `pnpm run dogfooding ${stagedFiles.join(' ')}`,
    'pnpm run lint:types',
    'pnpm run knip',
    'pnpm run -r test',
  ],

  'packages/eslint-plugin-wyrm/**/*.md': () => ['pnpm run -r lint:md'],

  '**/*': (stagedFiles) => [
    `pnpx prettier --ignore-unknown --check ${stagedFiles.join(' ')}`,
    'pnpm run manypkg:check',
  ],
};
export default config;
