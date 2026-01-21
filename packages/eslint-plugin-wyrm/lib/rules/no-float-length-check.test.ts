import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-float-length-check.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Integer length comparison #docs',
      code: `
foo.length > 3;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Integer size comparison #docs',
      code: `
foo.size >= 42;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Binary expression but not a comparison',
      code: `
foo.length % 3.14;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a member expression',
      code: `
foo > 3.14;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Property is not an identifier',
      code: `
foo['size'] > 3.14;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Property is not a length',
      code: `
foo.bar > 3.14;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Length is not compared to a literal',
      code: `
foo.length !== quux;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Length is not compared to a number literal',
      code: `
foo.length !== 'ok';
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Comparing a length to a floating point number #docs',
      code: `
foo.length > 3.14;
`,
      errors: [{ messageId: 'noFloatLengthCheck' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Comparing a size to a floating point number #docs',
      code: `
foo.size === 3.14;
`,
      errors: [{ messageId: 'noFloatLengthCheck' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Comparing a size to an integer number with a comma',
      code: `
foo.size == 3.0;
`,
      errors: [{ messageId: 'noFloatLengthCheck' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With !=',
      code: `
foo.length != 3.14;
`,
      errors: [{ messageId: 'noFloatLengthCheck' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With !==',
      code: `
3.14 !== foo.length;
`,
      errors: [{ messageId: 'noFloatLengthCheck' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With <',
      code: `
3.14 < foo.size;
`,
      errors: [{ messageId: 'noFloatLengthCheck' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With <=',
      code: `
3.14 <= foo.length;
`,
      errors: [{ messageId: 'noFloatLengthCheck' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
