import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-mutable-literal-fill.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Filling with `null` and mapping to empty arrays #docs',
      code: `
Array(42)
  .fill(null)
  .map(() => []);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Filling with identifier',
      code: `
Array(42).fill(foo);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not the`.fill()` method',
      code: `
Array(42).foo([]);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Filling with spread element',
      code: `
Array(42).fill(...[]);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Method is not an identifier',
      code: `
Array(42)['fill']([]);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.fill()` not called on an Array instantiation',
      code: `
foo.fill([]);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.fill()` called on a call expression, but the callee is not an identifier',
      code: `
(1 ? Array : Foo)().fill([]);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.fill()` called on a call expression, but not an array',
      code: `
Foo().fill([]);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`.fill()` called with no argument',
      code: `
Array(42).fill();
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Filling with empty array #docs',
      code: `
Array(42).fill([]);
`,
      errors: [{ messageId: 'noMutableLiteralFill' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array with explicit length',
      code: `
Array({ length: 42 }).fill([]);
`,
      errors: [{ messageId: 'noMutableLiteralFill' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array with dynamic length',
      code: `
Array(n).fill([]);
`,
      errors: [{ messageId: 'noMutableLiteralFill' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Filling with array literal',
      code: `
Array(42).fill([1, 2, 3]);
`,
      errors: [{ messageId: 'noMutableLiteralFill' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Filling with empty object #docs',
      code: `
Array(42).fill({});
`,
      errors: [{ messageId: 'noMutableLiteralFill' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Filling with new `Map` #docs',
      code: `
Array(42).fill(new Map());
`,
      errors: [{ messageId: 'noMutableLiteralFill' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Filling with new `Set`',
      code: `
Array(42).fill(new Set());
`,
      errors: [{ messageId: 'noMutableLiteralFill' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Filling with new `Whatever`',
      code: `
Array(42).fill(new Whatever());
`,
      errors: [{ messageId: 'noMutableLiteralFill' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Filling with object literal',
      code: `
Array(42).fill({ foo: 'bar' });
`,
      errors: [{ messageId: 'noMutableLiteralFill' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
