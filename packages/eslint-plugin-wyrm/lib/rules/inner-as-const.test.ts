import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './inner-as-const.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: '`as const` is set on the outermost array #docs',
      code: `
const arr = [42, 105] as const;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Plain array',
      code: `
const arr = [42, 105];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`as const` is set on the outermost object #docs',
      code: `
const obj = { foo: 42, bar: 105 } as const;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Plain object',
      code: `
const obj = { foo: 42, bar: 105 };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Plain const number',
      code: `
const n = 42 as const;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Plain const string',
      code: `
const str = 'foo' as const;
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    // Array
    {
      name: '`as const` is set on all array elements #docs',
      code: `
const arr = [42 as const, 105 as const];
`,
      output: [
        `
const arr = [42, 105 as const] as const;
`,
        `
const arr = [42, 105] as const;
`,
      ],
      errors: [
        { messageId: 'noInnerAsConstArray' },
        { messageId: 'noInnerAsConstArray' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`as const` is set on some array elements #docs',
      code: `
const arr = [42, 105 as const];
`,
      output: `
const arr = [42, 105] as const;
`,
      errors: [{ messageId: 'noInnerAsConstArray' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`as const` is set on some array elements and on the array #docs',
      code: `
const arr = [42, 105 as const] as const;
`,
      output: `
const arr = [42, 105] as const;
`,
      errors: [{ messageId: 'noInnerAsConstArray' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`as const` is set on all array elements and on the array #docs',
      code: `
const arr = [42 as const, 105 as const] as const;
`,
      output: `
const arr = [42, 105] as const;
`,
      errors: [
        { messageId: 'noInnerAsConstArray' },
        { messageId: 'noInnerAsConstArray' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`as const` is set on some inner array',
      code: `
const arr = [42, [105] as const];
`,
      output: `
const arr = [42, [105]] as const;
`,
      errors: [{ messageId: 'noInnerAsConstArray' }],
      after() {
        checkFormatting(this);
      },
    },

    // Object
    {
      name: '`as const` is set on all object properties #docs',
      code: `
const obj = { foo: 42 as const, bar: 105 as const };
`,
      output: [
        `
const obj = { foo: 42, bar: 105 as const } as const;
`,
        `
const obj = { foo: 42, bar: 105 } as const;
`,
      ],
      errors: [
        { messageId: 'noInnerAsConstObject' },
        { messageId: 'noInnerAsConstObject' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`as const` is set on some object properties #docs',
      code: `
const obj = { foo: 42, bar: 105 as const };
`,
      output: `
const obj = { foo: 42, bar: 105 } as const;
`,
      errors: [{ messageId: 'noInnerAsConstObject' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`as const` is set on some object properties and on the object #docs',
      code: `
const obj = { foo: 42, bar: 105 as const } as const;
`,
      output: `
const obj = { foo: 42, bar: 105 } as const;
`,
      errors: [{ messageId: 'noInnerAsConstObject' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`as const` is set on all object properties and on the object #docs',
      code: `
const obj = { foo: 42 as const, bar: 105 as const } as const;
`,
      output: `
const obj = { foo: 42, bar: 105 } as const;
`,
      errors: [
        { messageId: 'noInnerAsConstObject' },
        { messageId: 'noInnerAsConstObject' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`as const` is set on some inner object',
      code: `
const obj = { foo: 42, bar: { baz: 105 } as const };
`,
      output: `
const obj = { foo: 42, bar: { baz: 105 } } as const;
`,
      errors: [{ messageId: 'noInnerAsConstObject' }],
      after() {
        checkFormatting(this);
      },
    },

    // Arrays and objects
    {
      name: '`as const` is set on some inner array in an object',
      code: `
const obj = { foo: 42, bar: [105] as const };
`,
      output: `
const obj = { foo: 42, bar: [105] } as const;
`,
      errors: [{ messageId: 'noInnerAsConstObject' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`as const` is set on some inner object in an array',
      code: `
const arr = [42, { bar: 105 } as const];
`,
      output: `
const arr = [42, { bar: 105 }] as const;
`,
      errors: [{ messageId: 'noInnerAsConstArray' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`as const` is set on some inner array in an object in an array',
      code: `
const arr = [42, { bar: [105] as const }];
`,
      output: [
        `
const arr = [42, { bar: [105] } as const];
`,
        `
const arr = [42, { bar: [105] }] as const;
`,
      ],
      errors: [{ messageId: 'noInnerAsConstObject' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array of objects with `as const` properties',
      code: `
export const FOO = [
  { key: 'A1' as const, left: 'B1' as const, right: 'C1' as const },
  { key: 'A2' as const, left: 'B2' as const, right: 'C2' as const },
  { key: 'A3' as const, left: 'B3' as const, right: 'C3' as const },
  { key: 'A4' as const, left: 'B4' as const, right: 'C4' as const },
] as const;
`,
      output: [
        `
export const FOO = [
  { key: 'A1', left: 'B1' as const, right: 'C1' as const } as const,
  { key: 'A2', left: 'B2' as const, right: 'C2' as const } as const,
  { key: 'A3', left: 'B3' as const, right: 'C3' as const } as const,
  { key: 'A4', left: 'B4' as const, right: 'C4' as const } as const,
] as const;
`,
        `
export const FOO = [
  { key: 'A1', left: 'B1' as const, right: 'C1' as const },
  { key: 'A2', left: 'B2' as const, right: 'C2' as const },
  { key: 'A3', left: 'B3' as const, right: 'C3' as const },
  { key: 'A4', left: 'B4' as const, right: 'C4' as const },
] as const;
`,
        `
export const FOO = [
  { key: 'A1', left: 'B1', right: 'C1' as const } as const,
  { key: 'A2', left: 'B2', right: 'C2' as const } as const,
  { key: 'A3', left: 'B3', right: 'C3' as const } as const,
  { key: 'A4', left: 'B4', right: 'C4' as const } as const,
] as const;
`,
        `
export const FOO = [
  { key: 'A1', left: 'B1', right: 'C1' as const },
  { key: 'A2', left: 'B2', right: 'C2' as const },
  { key: 'A3', left: 'B3', right: 'C3' as const },
  { key: 'A4', left: 'B4', right: 'C4' as const },
] as const;
`,
        `
export const FOO = [
  { key: 'A1', left: 'B1', right: 'C1' } as const,
  { key: 'A2', left: 'B2', right: 'C2' } as const,
  { key: 'A3', left: 'B3', right: 'C3' } as const,
  { key: 'A4', left: 'B4', right: 'C4' } as const,
] as const;
`,
        `
export const FOO = [
  { key: 'A1', left: 'B1', right: 'C1' },
  { key: 'A2', left: 'B2', right: 'C2' },
  { key: 'A3', left: 'B3', right: 'C3' },
  { key: 'A4', left: 'B4', right: 'C4' },
] as const;
`,
      ],
      errors: [
        { messageId: 'noInnerAsConstObject' },
        { messageId: 'noInnerAsConstObject' },
        { messageId: 'noInnerAsConstObject' },

        { messageId: 'noInnerAsConstObject' },
        { messageId: 'noInnerAsConstObject' },
        { messageId: 'noInnerAsConstObject' },

        { messageId: 'noInnerAsConstObject' },
        { messageId: 'noInnerAsConstObject' },
        { messageId: 'noInnerAsConstObject' },

        { messageId: 'noInnerAsConstObject' },
        { messageId: 'noInnerAsConstObject' },
        { messageId: 'noInnerAsConstObject' },
      ],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
