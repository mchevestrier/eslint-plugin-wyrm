/** @type {import('lint-staged').Configuration} */
const config = {
  'packages/eslint-plugin-wyrm/**/*': () => [`pnpm run -r lint:eslint-docs`],

  '**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}': (stagedFiles) => [
    `pnpm run eslint ${stagedFiles.filter((f) => !f.includes('examples/')).join(' ')}`,
    'pnpm run lint:types',
    'pnpm run knip',
    'pnpm run -r test',
  ],

  'packages/eslint-plugin-wyrm/**/*.md': (stagedFiles) => [
    `cd packages/eslint-plugin-wyrm && pnpx markdownlint-cli2  ${stagedFiles
      .map((f) => f.replace('packages/eslint-plugin-wyrm/', ''))
      .map((f) => `"${f}"`)
      .join(' ')} "#node_modules" "#CHANGELOG.md"`,
  ],

  '**/*': (stagedFiles) => [
    `pnpx prettier --ignore-unknown --check ${stagedFiles.join(' ')}`,
  ],
};
export default config;
