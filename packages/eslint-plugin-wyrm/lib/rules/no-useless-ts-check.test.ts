import markdownPlugin from '@eslint/markdown';
import { RuleTester } from '@typescript-eslint/rule-tester';
import jsoncParser from 'jsonc-eslint-parser';
import * as yamlParser from 'yaml-eslint-parser';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-useless-ts-check.js';

const ruleTester = new RuleTester({
  plugins: { markdown: markdownPlugin },
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Random comment',
      code: `
// Ok
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful `@ts-check` comment in a JS file #docs',
      filename: 'foo.js',
      code: `
// @ts-check
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@ts-check` in block comment',
      code: `
/* @ts-check */
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@ts-check` in JSDoc comment',
      code: `
/** @ts-check */
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`@ts-nocheck` comment',
      code: `
// @ts-nocheck
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Comment starts with `@ts-check`',
      code: `
// @ts-check is unnecessary here
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Comment ends with `@ts-check`',
      code: `
// No need for @ts-check
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a JSONC file',
      filename: 'foo.json',
      languageOptions: {
        parser: jsoncParser,
      },
      code: `
// @ts-check
{
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a YAML file',
      filename: 'foo.yml',
      languageOptions: {
        parser: yamlParser,
      },
      code: `
# @ts-check
`,
      after() {
        // Not formatted
      },
    },
    {
      name: 'With a Markdown file',
      filename: 'foo.md',
      // 'language' is not supported by typings, but still transmitted
      // @ts-expect-error - 'language' does not exist in type 'ValidTestCase'
      language: 'markdown/commonmark',
      code: `
# @ts-check
<!-- @ts-check -->
`,
      after() {
        // Not formatted
      },
    },
    {
      name: 'With a YAML file (and a .ts file extension)',
      filename: 'foo.ts',
      languageOptions: {
        parser: yamlParser,
      },
      code: `
# @ts-check
`,
      after() {
        // Not formatted
      },
    },
    {
      name: 'With a Markdown file (and a .ts file extension)',
      filename: 'foo.ts',
      // 'language' is not supported by typings, but still transmitted
      // @ts-expect-error - 'language' does not exist in type 'ValidTestCase'
      language: 'markdown/commonmark',
      code: `
# @ts-check
<!-- @ts-check -->
`,
      after() {
        // Not formatted
      },
    },
  ],
  invalid: [
    {
      name: 'Useless `@ts-check` comment #docs',
      filename: 'foo.ts',
      code: `
// @ts-check
`,
      errors: [{ messageId: 'noUselessTsCheck' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useless `@ts-check` comment in .tsx file',
      filename: 'foo.tsx',
      code: `
// @ts-check
`,
      errors: [{ messageId: 'noUselessTsCheck' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a JSONC file (and a .ts file extension)',
      filename: 'foo.ts',
      languageOptions: {
        parser: jsoncParser,
      },
      code: `
// @ts-check
{
}
`,
      errors: [{ messageId: 'noUselessTsCheck' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
