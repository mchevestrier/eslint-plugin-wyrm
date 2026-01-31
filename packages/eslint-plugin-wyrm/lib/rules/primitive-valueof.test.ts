import path from 'node:path';

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './primitive-valueof.js';

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      errorOnTypeScriptSyntacticAndSemanticIssues: true,
      project: './tsconfig.json',
      projectService: false,
      tsconfigRootDir: path.join(import.meta.dirname, './fixtures'),
    },
  },
});

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Calling `.valueOf()` on a Date object #docs',
      code: `
const val = new Date();
val.valueOf();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.valueOf()` on a number | Date #docs',
      code: `
declare const val: number | Date;
val.valueOf();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.valueOf()` on a number | Number',
      code: `
declare const val: number | Number;
val.valueOf();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.valueOf()` on an object',
      code: `
const val = new Object();
val.valueOf();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.valueOf()` on an object literal',
      code: `
({}).valueOf();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.valueOf()` on a Number wrapper object',
      code: `
const val = new Number();
val.valueOf();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.valueOf()` on a String wrapper object',
      code: `
const val = new String();
val.valueOf();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.valueOf()` on a Boolean wrapper object',
      code: `
const val = new Boolean();
val.valueOf();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.valueOf()` on null',
      code: `
const val = null;
val.valueOf();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.valueOf()` on undefined',
      code: `
const val = undefined;
val.valueOf();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.valueOf()` on any',
      code: `
declare const val: any;
val.valueOf();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.valueOf()` on never',
      code: `
declare const val: never;
val.valueOf();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.valueOf()` on unknown',
      code: `
declare const val: unknown;
val.valueOf();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Callee is not a member expression',
      code: `
foo();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Property is not an identifier',
      code: `
const foo = 42;
foo['valueOf']();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Method is not `valueOf`',
      code: `
const foo = 42;
foo.quux();
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Calling `.valueOf()` on a number #docs',
      code: `
const val = 42;
val.valueOf();
`,
      output: `
const val = 42;
val;
`,
      errors: [{ messageId: 'noPrimitiveValueOf' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.valueOf()` on a string #docs',
      code: `
const val = 'foo';
val.valueOf();
`,
      output: `
const val = 'foo';
val;
`,
      errors: [{ messageId: 'noPrimitiveValueOf' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.valueOf()` on a boolean #docs',
      code: `
const val = false;
val.valueOf();
`,
      output: `
const val = false;
val;
`,
      errors: [{ messageId: 'noPrimitiveValueOf' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.valueOf()` on a bigint',
      code: `
const val = 42n;
val.valueOf();
`,
      output: `
const val = 42n;
val;
`,
      errors: [{ messageId: 'noPrimitiveValueOf' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.valueOf()` on a number | bigint',
      code: `
declare const val: number | bigint;
val.valueOf();
`,
      output: `
declare const val: number | bigint;
val;
`,
      errors: [{ messageId: 'noPrimitiveValueOf' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.valueOf()` on a number | bigint | string | boolean',
      code: `
declare const val: number | bigint | string | boolean;
val.valueOf();
`,
      output: `
declare const val: number | bigint | string | boolean;
val;
`,
      errors: [{ messageId: 'noPrimitiveValueOf' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.valueOf()` on a BigInt',
      code: `
const val = BigInt(42);
val.valueOf();
`,
      output: `
const val = BigInt(42);
val;
`,
      errors: [{ messageId: 'noPrimitiveValueOf' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.valueOf()` on a number literal',
      code: `
(42.0).valueOf();
`,
      output: `
42.0;
`,
      errors: [{ messageId: 'noPrimitiveValueOf' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.valueOf()` on a string literal',
      code: `
'foo'.valueOf();
`,
      output: `
'foo';
`,
      errors: [{ messageId: 'noPrimitiveValueOf' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.valueOf()` on a boolean literal',
      code: `
false.valueOf();
`,
      output: `
false;
`,
      errors: [{ messageId: 'noPrimitiveValueOf' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Calling `.valueOf()` on a bigint literal',
      code: `
42n.valueOf();
`,
      output: `
42n;
`,
      errors: [{ messageId: 'noPrimitiveValueOf' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a comment',
      code: `
(42) /* Comment */
  .valueOf();
`,
      output: `
42;
`,
      errors: [{ messageId: 'noPrimitiveValueOf' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With optional chaining',
      code: `
const val = 42;
val?.valueOf();
`,
      output: `
const val = 42;
val;
`,
      errors: [{ messageId: 'noPrimitiveValueOf' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
