import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './prefer-has.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'With `.has()` #docs',
      code: `
foo.has('bar');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `.get()` not being check for undefined #docs',
      code: `
foo.get('bar');
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'With `!== undefined` #docs',
      code: `
foo.get('bar') !== undefined;
`,
      output: `
foo.has('bar');
`,
      errors: [{ messageId: 'preferHas' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: "With `typeof !== 'undefined'` #docs",
      code: `
typeof foo.get('bar') !== 'undefined';
`,
      output: `
foo.has('bar');
`,
      errors: [{ messageId: 'preferHas' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `undefined !==`',
      code: `
undefined !== foo.get('bar');
`,
      output: `
foo.has('bar');
`,
      errors: [{ messageId: 'preferHas' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: "With `'undefined' !== typeof`",
      code: `
'undefined' !== typeof foo.get('bar');
`,
      output: `
foo.has('bar');
`,
      errors: [{ messageId: 'preferHas' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `!= undefined`',
      code: `
foo.get('bar') != undefined;
`,
      output: `
foo.has('bar');
`,
      errors: [{ messageId: 'preferHas' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: "With `typeof != 'undefined'`",
      code: `
typeof foo.get('bar') != 'undefined';
`,
      output: `
foo.has('bar');
`,
      errors: [{ messageId: 'preferHas' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
