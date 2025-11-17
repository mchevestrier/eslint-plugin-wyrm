import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-invalid-date-literal.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Valid date #docs',
      code: `
new Date('07-20-1969');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Valid date (with `Date.parse()`) #docs',
      code: `
Date.parse('07-20-1969');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Valid date with no argument',
      code: `
new Date();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'New date with non-literal argument',
      code: `
new Date(foo());
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'New date with some identifier',
      code: `
new Date(foo);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'New date with a boolean literal',
      code: `
new Date(false);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Valid date (with slashes)',
      code: `
new Date('07/20/1969');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With several arguments',
      code: `
new Date(2020, 0, 0);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an error',
      code: `
Error('ok');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a new error',
      code: `
new Error('ok');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Callee of `new` expression is not an identifier',
      code: `
new (1 ? Date : Error)('ok');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Method is not an identifier',
      code: `
Date['parse']('ok');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Object is not an identifier',
      code: `
(1 ? Date : Error).parse('ok');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Date.parse()` with no argument',
      code: `
Date.parse();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Date.parse()` with non-literal argument',
      code: `
Date.parse(foo());
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Date` method call is not `parse`',
      code: `
Date.now('ok');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`parse` method call but not on `Date`',
      code: `
JSON.parse('{}');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Date.parse` called with a number (not checked)',
      code: `
Date.parse(123);
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Invalid date #docs',
      code: `
new Date('20-07-1969');
`,
      errors: [{ messageId: 'noInvalidDateLiteral' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Invalid date (with slashes)',
      code: `
new Date('20/07/1969');
`,
      errors: [{ messageId: 'noInvalidDateLiteral' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a number #docs',
      code: `
new Date(9007199254740991);
`,
      errors: [{ messageId: 'noInvalidDateLiteral' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `Date.parse()` #docs',
      code: `
Date.parse('not a valid date');
`,
      errors: [{ messageId: 'noInvalidDateLiteral' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With Infinity',
      code: `
new Date(Infinity);
`,
      errors: [{ messageId: 'noInvalidDateLiteral' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With NaN',
      code: `
new Date(NaN);
`,
      errors: [{ messageId: 'noInvalidDateLiteral' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a random string',
      code: `
new Date('wat');
`,
      errors: [{ messageId: 'noInvalidDateLiteral' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
