import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './duplicate-destructuring.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'No duplicate key #docs',
      code: `
const { map: at, at: map } = [];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With shadowing',
      code: `
const { map: foo, at: foo } = [];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With some rest element',
      code: `
const { map: at, at: map, ...foo } = [];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With computed keys',
      code: `
const { map: at, [foo()]: bar, [foo()]: baz } = [];
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Duplicate identifier key #docs',
      code: `
const { length: bar, length: baz } = [];
`,
      errors: [{ messageId: 'duplicateKey' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a property using destructuring shorthand',
      code: `
const { length: bar, length } = [];
`,
      errors: [{ messageId: 'duplicateKey' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With some rest element',
      code: `
const { length: bar, length: baz, ...length } = [];
`,
      errors: [{ messageId: 'duplicateKey' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Several duplicate identifier keys',
      code: `
const { length: bar, at: foo, length: baz, length: quux, at: fnord } = [];
`,
      errors: [
        { messageId: 'duplicateKey' },
        { messageId: 'duplicateKey' },
        { messageId: 'duplicateKey' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Duplicate string literal key',
      code: `
const { 'foo-bar': quux, 'foo-bar': fnord } = foo();
`,
      errors: [{ messageId: 'duplicateKey' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Duplicate number key',
      code: `
const { 42: quux, 42: fnord } = foo();
`,
      errors: [{ messageId: 'duplicateKey' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Duplicate bigint key',
      code: `
const { 42n: quux, 42n: fnord } = foo();
`,
      errors: [{ messageId: 'duplicateKey' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Duplicate boolean key',
      code: `
const { [false]: quux, [false]: fnord } = foo();
`,
      errors: [{ messageId: 'duplicateKey' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Duplicate null key',
      code: `
const { [null]: quux, [null]: fnord } = foo();
`,
      errors: [{ messageId: 'duplicateKey' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Duplicate RegExp key',
      code: `
const { [/foo/gi]: quux, [/foo/gi]: fnord } = foo();
`,
      errors: [{ messageId: 'duplicateKey' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Duplicate key (identifier and string literal)',
      code: `
const { baz: quux, ['baz']: fnord } = foo();
`,
      errors: [{ messageId: 'duplicateKey' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Duplicate key (string and RegExp)',
      code: `
const { '/foo/gi': quux, [/foo/gi]: fnord } = foo();
`,
      errors: [{ messageId: 'duplicateKey' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Duplicate key (string and number)',
      code: `
const { '42': quux, 42: fnord } = foo();
`,
      errors: [{ messageId: 'duplicateKey' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Duplicate keys (string and null)',
      code: `
const { null: baz, ['null']: quux, [null]: fnord } = foo();
`,
      errors: [{ messageId: 'duplicateKey' }, { messageId: 'duplicateKey' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
