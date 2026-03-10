import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './prefer-eqeq-null.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Using `foo == null` #docs',
      code: `
foo == null;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `foo != null` #docs',
      code: `
foo != null;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `foo === null && foo === undefined`',
      code: `
foo === null && foo === undefined;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `foo === null || foo !== undefined`',
      code: `
foo === null || foo !== undefined;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `foo !== null || foo === undefined`',
      code: `
foo !== null || foo === undefined;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Inequality check but not a conjunction',
      code: `
foo !== null || foo !== undefined;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction - Left side is not a binary expression',
      code: `
quux() && foo === undefined;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Disjunction - Left side is not a binary expression',
      code: `
quux() || foo === undefined;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conjunction - Right side is not a binary expression',
      code: `
foo === null && quux();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Disjunction - Right side is not a binary expression',
      code: `
foo === null || quux();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `foo === null || bar === undefined`',
      code: `
foo === null || bar === undefined;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `foo !== null && bar !== undefined`',
      code: `
foo !== null && bar !== undefined;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `foo === null || 42 === undefined`',
      code: `
foo === null || 42 === undefined;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `foo !== null && 42 !== undefined`',
      code: `
foo !== null && 42 !== undefined;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `foo !== null && foo === undefined`',
      code: `
foo !== null && foo === undefined;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `foo === null && foo !== undefined`',
      code: `
foo === null && foo !== undefined;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Equality - Right side is not null',
      code: `
foo === 42 || undefined === foo;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Equality - Right side is not undefined',
      code: `
foo === null || foo === 42;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Inequality - Right side is not null',
      code: `
foo !== 42 && undefined !== foo;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Inequality - Right side is not undefined',
      code: `
foo !== null && foo !== 42;
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Using `foo === null || foo === undefined` #docs',
      code: `
foo === null || foo === undefined;
`,
      output: `
foo == null;
`,
      errors: [{ messageId: 'useEqEqNull', data: { ident: 'foo' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `foo !== null && foo !== undefined` #docs',
      code: `
foo !== null && foo !== undefined;
`,
      output: `
foo != null;
`,
      errors: [{ messageId: 'useNotEqNull', data: { ident: 'foo' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `foo === undefined || foo === null`',
      code: `
foo === undefined || foo === null;
`,
      output: `
foo == null;
`,
      errors: [{ messageId: 'useEqEqNull', data: { ident: 'foo' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `foo !== undefined && foo !== null`',
      code: `
foo !== undefined && foo !== null;
`,
      output: `
foo != null;
`,
      errors: [{ messageId: 'useNotEqNull', data: { ident: 'foo' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `foo == null || foo == undefined`',
      code: `
foo == null || foo == undefined;
`,
      output: `
foo == null;
`,
      errors: [{ messageId: 'useEqEqNull', data: { ident: 'foo' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `foo != null && foo != undefined`',
      code: `
foo != null && foo != undefined;
`,
      output: `
foo != null;
`,
      errors: [{ messageId: 'useNotEqNull', data: { ident: 'foo' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `null === foo || foo === undefined`',
      code: `
null === foo || foo === undefined;
`,
      output: `
foo == null;
`,
      errors: [{ messageId: 'useEqEqNull', data: { ident: 'foo' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `null !== foo && foo !== undefined`',
      code: `
null !== foo && foo !== undefined;
`,
      output: `
foo != null;
`,
      errors: [{ messageId: 'useNotEqNull', data: { ident: 'foo' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `foo === null || undefined === foo`',
      code: `
foo === null || undefined === foo;
`,
      output: `
foo == null;
`,
      errors: [{ messageId: 'useEqEqNull', data: { ident: 'foo' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `foo !== null && undefined !== foo`',
      code: `
foo !== null && undefined !== foo;
`,
      output: `
foo != null;
`,
      errors: [{ messageId: 'useNotEqNull', data: { ident: 'foo' } }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
