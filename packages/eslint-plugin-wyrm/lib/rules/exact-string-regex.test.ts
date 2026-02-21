import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './exact-string-regex.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Using string equality #docs',
      code: `
foo === 'quux';
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using RegEx but should use `includes`',
      code: `
/quux/.test(foo);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using RegEx but should use `startsWith`',
      code: `
/^quux/.test(foo);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using RegEx but should use `endsWith`',
      code: `
/quux$/.test(foo);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With ignoreCase flag',
      code: `
/^quux$/i.test(foo);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With multiline flag',
      code: `
/^quux$/m.test(foo);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a RegExp match',
      code: `
expect(foo).toHaveTextContent(/^quux$/);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `exec` but should use `endsWith`',
      code: `
/quux$/.exec(foo);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `match` but should use `endsWith`',
      code: `
foo.match(/quux$/);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not `test` or `exec`',
      code: `
/^quux$/.fnord(foo);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not `match`',
      code: `
foo.fnord(/^quux$/);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With the `v` flag and some special characters',
      // eslint-disable-next-line unicorn/prefer-string-raw
      code: `
/[\\p{Lowercase}&&\\p{Script=Greek}]/v.exec(foo);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'RegEx used as computed property',
      code: `
obj[/^quux$/].test(foo);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Computed property access on regex',
      code: `
/^quux$/['test'](foo);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Member expression but not a call expression',
      code: `
const fn = /^quux$/.test;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Call expression with no arguments',
      code: `
/^quux$/.test();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'RegEx not first argument in match',
      code: `
foo.match(bar, /^quux$/);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Callee not a member expression for match',
      code: `
match(/^quux$/);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Computed property for match',
      code: `
foo['match'](/^quux$/);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With content after $',
      code: `
/^quux$x/.test(foo);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With content before ^',
      code: `
/x^quux$/.test(foo);
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Exact string RegEx #docs (with `test)`',
      code: `
/^quux$/.test(foo);
`,
      errors: [
        {
          messageId: 'preferEquality',
          data: { content: 'quux' },
          suggestions: [
            {
              messageId: 'preferEquality',
              data: { content: 'quux' },
              output: `
(foo === 'quux');
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Exact string RegEx (with `exec`)',
      code: `
/^qu42ux$/.exec(foo);
`,
      errors: [
        {
          messageId: 'preferEquality',
          data: { content: 'qu42ux' },
          suggestions: [
            {
              messageId: 'preferEquality',
              data: { content: 'qu42ux' },
              output: `
(foo === 'qu42ux');
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Exact string RegEx (with `match`)',
      code: `
foo.match(/^qu42ux$/);
`,
      errors: [
        {
          messageId: 'preferEquality',
          data: { content: 'qu42ux' },
          suggestions: [
            {
              messageId: 'preferEquality',
              data: { content: 'qu42ux' },
              output: `
(foo === 'qu42ux');
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `match`, inside a variable declaration',
      code: `
const result = foo().match(/^qu42ux$/);
`,
      errors: [
        {
          messageId: 'preferEquality',
          data: { content: 'qu42ux' },
          suggestions: [
            {
              messageId: 'preferEquality',
              data: { content: 'qu42ux' },
              output: `
const result = (foo() === 'qu42ux');
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With the `u` flag',
      code: `
/^qu42ux$/u.exec(foo);
`,
      errors: [
        {
          messageId: 'preferEquality',
          data: { content: 'qu42ux' },
          suggestions: [
            {
              messageId: 'preferEquality',
              data: { content: 'qu42ux' },
              output: `
(foo === 'qu42ux');
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With the `v` flag',
      code: `
/^qu42ux$/v.exec(foo);
`,
      errors: [
        {
          messageId: 'preferEquality',
          data: { content: 'qu42ux' },
          suggestions: [
            {
              messageId: 'preferEquality',
              data: { content: 'qu42ux' },
              output: `
(foo === 'qu42ux');
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
