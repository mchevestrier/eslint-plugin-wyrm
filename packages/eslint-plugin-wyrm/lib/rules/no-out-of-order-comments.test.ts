import markdownPlugin from '@eslint/markdown';
import { RuleTester } from '@typescript-eslint/rule-tester';
import jsoncParser from 'jsonc-eslint-parser';
import * as yamlParser from 'yaml-eslint-parser';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-out-of-order-comments.js';

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
      name: 'Not a numbered comment',
      code: `
// Ok
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Numbered comments in order #docs',
      code: `
// 1. Ok
// 2. Ok
// 3. Ok

// 1. Ok
// 2. Ok
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Infinite numbers are ignored',
      code: `
// 1. Ok
// 99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999. Ok
// 2. Ok
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Numbered comments in order, with several digits',
      code: `
// 1. Ok
// 2. Ok
// 3. Ok
// 4. Ok
// 5. Ok
// 6. Ok
// 7. Ok
// 8. Ok
// 9. Ok
// 10. Ok
// 11. Ok
// 12. Ok

// 1. Ok
// 2. Ok
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not starting with 1',
      code: `
// 2. Ok
// 3. Ok

// 1. Ok
// 2. Ok
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With several words before the number',
      code: `
// Several words 1: Do stuff
// Several words 3: Do stuff
// Several words 2: Do stuff
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
// 1. Ok
// 2. Ok
// 3. Ok

// 1. Ok
// 2. Ok
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
# 1. Ok
# 2. Ok
# 3. Ok

# 1. Ok
# 2. Ok
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
# 1. Do stuff
# 3. Do stuff

<!-- 1. Do stuff -->
<!-- 3. Do stuff -->
`,
      after() {
        // Not formatted
      },
    },
    {
      name: 'Numbered block comments in order',
      code: `
/* 1. Ok */
/* 2. Ok */
/* 3. Ok */
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'JSDoc numbered comments, out of order',
      code: `
/** 1. Do stuff */
/** 3. Do stuff */
/** 2. Do stuff */
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Inline numbered comments, out of order #docs',
      code: `
// 1. Do stuff
// 3. Do stuff
// 2. Do stuff
`,
      errors: [
        { messageId: 'noOutOfOrderComments' },
        { messageId: 'noOutOfOrderComments' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Inline numbered comments, with one missing number #docs',
      code: `
// 1. Do stuff
// 3. Do stuff
`,
      errors: [{ messageId: 'noOutOfOrderComments' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Duplicate number',
      code: `
// 1. Do stuff
// 2. Do stuff
// 3. Do stuff
// 3. Do stuff
`,
      errors: [{ messageId: 'noOutOfOrderComments' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Numbered comments out of order, with several digits',
      code: `
// 1. Ok
// 2. Ok
// 3. Ok
// 4. Ok
// 6. Ok
// 7. Ok
// 8. Ok
// 9. Ok
// 10. Ok
// 12. Ok

// 1. Ok
// 2. Ok
`,
      errors: [
        { messageId: 'noOutOfOrderComments' },
        { messageId: 'noOutOfOrderComments' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Block numbered comments, out of order',
      code: `
/* 1. Do stuff */
/* 3. Do stuff */
/* 2. Do stuff */
`,
      errors: [
        { messageId: 'noOutOfOrderComments' },
        { messageId: 'noOutOfOrderComments' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a prefix #docs',
      code: `
// Step 1: Do stuff
// Step 3: Do stuff
// Step 2: Do stuff
`,
      errors: [
        { messageId: 'noOutOfOrderComments' },
        { messageId: 'noOutOfOrderComments' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a prefix and a period',
      code: `
// Part 1. Do stuff
// Part 3. Do stuff
// Part 2. Do stuff
`,
      errors: [
        { messageId: 'noOutOfOrderComments' },
        { messageId: 'noOutOfOrderComments' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a semicolon',
      code: `
// 1: Do stuff
// 3: Do stuff
// 2: Do stuff
`,
      errors: [
        { messageId: 'noOutOfOrderComments' },
        { messageId: 'noOutOfOrderComments' },
      ],
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
// 1. Do stuff
// 3. Do stuff
// 2. Do stuff
{
}
`,
      errors: [
        { messageId: 'noOutOfOrderComments' },
        { messageId: 'noOutOfOrderComments' },
      ],
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
# 1. Do stuff
# 3. Do stuff
# 2. Do stuff
`,
      errors: [
        { messageId: 'noOutOfOrderComments' },
        { messageId: 'noOutOfOrderComments' },
      ],
      after() {
        // Not formatted
      },
    },
  ],
});
