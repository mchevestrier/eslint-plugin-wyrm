import markdownPlugin from '@eslint/markdown';
import { RuleTester } from '@typescript-eslint/rule-tester';
import jsoncParser from 'jsonc-eslint-parser';
import yamlParser from 'yaml-eslint-parser';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-numbered-comments.js';

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
      name: 'Not a numbered comment #docs',
      code: `
// Ok
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not an inline numbered comment',
      code: `
// 123 Ok
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Version number',
      code: `
// 1.2.3
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
// Ok
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
# Ok
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
# 23. Do stuff
<!-- 23. Do stuff -->
`,
      after() {
        // Not formatted
      },
    },
    {
      name: 'Not a numbered block comment',
      code: `
/* 123 Ok */
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'JSDoc numbered comment #docs',
      code: `
/** 23. Do stuff */
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Inline numbered comment #docs',
      code: `
// 23. Do stuff
`,
      errors: [{ messageId: 'noNumberedComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Trailing inline numbered comment',
      code: `
debugger; // 23. Do stuff
`,
      errors: [{ messageId: 'noNumberedComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Block numbered comment #docs',
      code: `
/* 23. Do stuff */
`,
      errors: [{ messageId: 'noNumberedComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Numbered comment in JSX',
      code: `
function Foo() {
  return (
    <div>
      {/* 23. Do stuff */}
      Ok
    </div>
  );
}
`,
      errors: [{ messageId: 'noNumberedComment' }],
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
// 23. Do stuff
{
}
`,
      errors: [{ messageId: 'noNumberedComment' }],
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
# 23. Do stuff
`,
      errors: [{ messageId: 'noNumberedComment' }],
      after() {
        // Not formatted
      },
    },
  ],
});
