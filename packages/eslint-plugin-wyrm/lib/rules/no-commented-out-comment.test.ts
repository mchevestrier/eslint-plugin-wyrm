import markdownPlugin from '@eslint/markdown';
import { RuleTester } from '@typescript-eslint/rule-tester';
import jsoncParser from 'jsonc-eslint-parser';
import * as yamlParser from 'yaml-eslint-parser';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-commented-out-comment.js';

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
      name: 'Normal comment #docs',
      code: `
// foo
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Commented out comment but not at the beginning',
      code: `
// foo // bar
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Normal block comment #docs',
      code: `
/* foo */
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Normal comment in a JSONC file',
      filename: 'foo.json',
      languageOptions: {
        parser: jsoncParser,
      },
      code: `
{
  // foo
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
# # foo
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
# # foo
<!-- foo -->
`,
      after() {
        // Not formatted
      },
    },
  ],
  invalid: [
    {
      name: 'Commented out comment #docs',
      code: `
// // foo
`,
      errors: [{ messageId: 'commentedOutComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Commented out block comment #docs',
      code: `
// /* foo */
`,
      errors: [{ messageId: 'commentedOutComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Commented out comment in a JSONC file',
      filename: 'foo.json',
      languageOptions: {
        parser: jsoncParser,
      },
      code: `
{
  // // foo
}
`,
      errors: [{ messageId: 'commentedOutComment' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
