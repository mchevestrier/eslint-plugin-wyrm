import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-nullish-ternary.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Consequent is not a property or index access',
      code: `
foo ? bar : undefined;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Alternate is `null`, not `undefined` #docs',
      code: `
foo ? foo.bar : null;
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Simple property access #docs',
      code: `
foo ? foo.bar : undefined;
`,
      output: `
foo?.bar;
`,
      errors: [{ messageId: 'noNullishTernary' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Simple index access',
      code: `
foo ? foo[2] : undefined;
`,
      output: `
foo?.[2];
`,
      errors: [{ messageId: 'noNullishTernary' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Computed property access',
      code: `
foo ? foo['bar-baz'] : undefined;
`,
      output: `
foo?.['bar-baz'];
`,
      errors: [{ messageId: 'noNullishTernary' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Simple property access with negated test',
      code: `
!foo ? undefined : foo.bar;
`,
      output: `
foo?.bar;
`,
      errors: [{ messageId: 'noNullishTernary' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`!== undefined`',
      code: `
foo !== undefined ? foo.bar : undefined;
`,
      output: `
foo?.bar;
`,
      errors: [{ messageId: 'noNullishTernary' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`!== null`',
      code: `
foo !== null ? foo.bar : undefined;
`,
      output: `
foo?.bar;
`,
      errors: [{ messageId: 'noNullishTernary' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`!= undefined`',
      code: `
foo != undefined ? foo.bar : undefined;
`,
      output: `
foo?.bar;
`,
      errors: [{ messageId: 'noNullishTernary' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`!= null`',
      code: `
foo != null ? foo.bar : undefined;
`,
      output: `
foo?.bar;
`,
      errors: [{ messageId: 'noNullishTernary' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`=== undefined`',
      code: `
foo === undefined ? undefined : foo.bar;
`,
      output: `
foo?.bar;
`,
      errors: [{ messageId: 'noNullishTernary' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`=== null`',
      code: `
foo === null ? undefined : foo.bar;
`,
      output: `
foo?.bar;
`,
      errors: [{ messageId: 'noNullishTernary' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`== undefined`',
      code: `
foo == undefined ? undefined : foo.bar;
`,
      output: `
foo?.bar;
`,
      errors: [{ messageId: 'noNullishTernary' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`== null`',
      code: `
foo == null ? undefined : foo.bar;
`,
      output: `
foo?.bar;
`,
      errors: [{ messageId: 'noNullishTernary' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
