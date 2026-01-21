import markdownPlugin from '@eslint/markdown';
import { RuleTester } from '@typescript-eslint/rule-tester';
import jsoncParser from 'jsonc-eslint-parser';
import * as yamlParser from 'yaml-eslint-parser';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-empty-comment.js';

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
      name: 'Not an empty comment #docs',
      code: `
// Ok
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
# ok
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
# ok
<!-- Ok -->
`,
      after() {
        // Not formatted
      },
    },
    {
      name: 'Not an empty block comment',
      code: `
/* . */
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not an empty JSDoc comment',
      code: `
/** @param {string} */
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not an empty multi-line JSDoc comment',
      code: `
/**
 * @param {string}
 */
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Multi-line block comment with stars',
      code: `
/*
 **
 */
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Block comment with small line of asterisks',
      code: `
/****/
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Block comment with small line of asterisks and spaces',
      code: `
/* ** */
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Block comment with line of asterisks',
      code: `
/*********/
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Block comment with line of asterisks and spaces',
      code: `
/* ******* */
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty padding comments (with default options)',
      code: `
//
// Ok
//
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty padding comments (with `allowPadding: true`) #docs',
      options: [{ allowPadding: true }],
      code: `
//
// Ok
//
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Empty inline comment #docs',
      code: `
//
`,
      errors: [{ messageId: 'noEmptyComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Trailing inline comment',
      code: `
debugger; //
`,
      errors: [{ messageId: 'noEmptyComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty inline comment with spaces',
      code: `
//  
`,
      errors: [{ messageId: 'noEmptyComment' }],
      after() {
        // Not formatted
      },
    },
    {
      name: 'Empty block comment #docs',
      code: `
/* */
`,
      errors: [{ messageId: 'noEmptyComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty JSDoc comment #docs',
      code: `
/** */
`,
      errors: [{ messageId: 'noEmptyComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty multi-line JSDoc comment',
      code: `
/**
 *
 */
`,
      errors: [{ messageId: 'noEmptyComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty padding comments (with `allowPadding: false`) #docs',
      options: [{ allowPadding: false }],
      code: `
//
// Ok
//
`,
      errors: [{ messageId: 'noEmptyComment' }, { messageId: 'noEmptyComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty inline comment with no neighbors (with `allowPadding: true`)',
      options: [{ allowPadding: true }],
      code: `
//
`,
      errors: [{ messageId: 'noEmptyComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty inline comment isolated from non-empty neighbors (with `allowPadding: true`)',
      options: [{ allowPadding: true }],
      code: `
//

// Not empty
`,
      errors: [{ messageId: 'noEmptyComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Too many empty padding comments (with `allowPadding: true`) #docs',
      options: [{ allowPadding: true }],
      code: `
//
// Ok
//
//
`,
      errors: [{ messageId: 'noEmptyComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty block comment below a non-empty line comment',
      options: [{ allowPadding: true }],
      code: `
// Ok
/* */
`,
      errors: [{ messageId: 'noEmptyComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Padding comment (with `allowPadding: true`) next to a block comment',
      options: [{ allowPadding: true }],
      code: `
/* Ok */
//
`,
      errors: [{ messageId: 'noEmptyComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty comment in JSX',
      code: `
function Foo() {
  return (
    <div>
      {/* */}
      Ok
    </div>
  );
}
`,
      errors: [{ messageId: 'noEmptyComment' }],
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
//
{
}
`,
      errors: [{ messageId: 'noEmptyComment' }],
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
#
`,
      errors: [{ messageId: 'noEmptyComment' }],
      after() {
        // Not formatted
      },
    },
  ],
});
