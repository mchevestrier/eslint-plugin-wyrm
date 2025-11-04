import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-invalid-date-literal.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Valid date #docs',
      code: `new Date('07-20-1969');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Valid date (with slashes)',
      code: `new Date('07/20/1969');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With several arguments',
      code: `new Date(2020, 0, 0);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an error',
      code: `Error('ok');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a new error',
      code: `new Error('ok');
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Invalid date #docs',
      code: `new Date('20-07-1969');
`,
      errors: [{ messageId: 'noInvalidDateLiteral' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Invalid date (with slashes)',
      code: `new Date('20/07/1969');
`,
      errors: [{ messageId: 'noInvalidDateLiteral' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a number #docs',
      code: `new Date(9007199254740991);
`,
      errors: [{ messageId: 'noInvalidDateLiteral' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `Date.parse()` #docs',
      code: `Date.parse('not a valid date');
`,
      errors: [{ messageId: 'noInvalidDateLiteral' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With Infinity',
      code: `new Date(Infinity);
`,
      errors: [{ messageId: 'noInvalidDateLiteral' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With NaN',
      code: `new Date(NaN);
`,
      errors: [{ messageId: 'noInvalidDateLiteral' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a random string',
      code: `new Date('wat');
`,
      errors: [{ messageId: 'noInvalidDateLiteral' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
