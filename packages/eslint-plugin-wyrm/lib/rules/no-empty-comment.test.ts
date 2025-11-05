import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-empty-comment.js';

const ruleTester = new RuleTester({
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
      code: `// Ok
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not an empty block comment',
      code: `/* . */
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not an empty JSDoc comment',
      code: `/** @param {string} */
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not an empty multi-line JSDoc comment',
      code: `/**
 * @param {string}
 */
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty padding comments (with default options)',
      code: `//
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
      code: `//
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
      code: `//
`,
      errors: [{ messageId: 'noEmptyComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty inline comment with spaces',
      code: `//  
`,
      errors: [{ messageId: 'noEmptyComment' }],
      after() {
        // Not formatted
      },
    },
    {
      name: 'Empty block comment #docs',
      code: `/* */
`,
      errors: [{ messageId: 'noEmptyComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty JSDoc comment #docs',
      code: `/** */
`,
      errors: [{ messageId: 'noEmptyComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty multi-line JSDoc comment',
      code: `/**
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
      code: `//
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
      code: `//
`,
      errors: [{ messageId: 'noEmptyComment' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty inline comment isolated from non-empty neighbors (with `allowPadding: true`)',
      options: [{ allowPadding: true }],
      code: `//

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
      code: `//
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
      name: 'Empty comment in JSX',
      code: `function Foo() {
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
  ],
});
