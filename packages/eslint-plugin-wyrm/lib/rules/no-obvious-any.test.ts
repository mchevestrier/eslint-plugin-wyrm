import path from 'node:path';

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-obvious-any.js';

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
      name: 'Declaration with no initialization',
      code: `
let foo: any;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Type of initialization value cannot be trivially inferred',
      code: `
let foo: any = quux();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Assignment of an object literal, typed as `any`',
      code: `
let foo: any = { quux: 42, bar: 'ok' };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Assignment of a number literal, typed as `number` #docs',
      code: `
const foo: number = 42;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Assignment of a number literal, with inferred type',
      code: `
const foo = 42;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Assignment of a string literal, typed as `string`',
      code: `
const foo: string = 'ok';
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Assignment of a string literal, with inferred type #docs',
      code: `
const foo = 'ok';
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Assignment of an array literal, typed as `any[]` #docs',
      code: `
const foo: any[] = [];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Assignment of an array literal, with inferred type',
      code: `
const foo = [];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Function declaration argument is not trivially inferable',
      code: `
function foo(n: any) {}

const x: unknown = quux();
foo(x);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Function declaration has a named export',
      code: `
export function foo(n: any) {}

foo(42);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Function declaration has a default export',
      code: `
export default function foo(n: any) {}

foo(42);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Arrow function declaration has a named export',
      code: `
const foo = (n: any) => {};

foo(42);

export { foo };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Arrow function declaration has a default export',
      code: `
const foo = (n: any) => {};

foo(42);

export default foo;
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Assignment of a number literal, typed as `any` #docs',
      code: `
const foo: any = 42;
`,
      output: `
const foo: number = 42;
`,
      errors: [{ messageId: 'noObviousAny' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Assignment of a string literal, typed as `any` #docs',
      code: `
let foo: any = 'ok';
`,
      output: `
let foo: string = 'ok';
`,
      errors: [{ messageId: 'noObviousAny' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Assignment of a boolean literal, typed as `any` #docs',
      code: `
const foo: any = false;
`,
      output: `
const foo: boolean = false;
`,
      errors: [{ messageId: 'noObviousAny' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Assignment of an array literal, typed as `any` #docs',
      code: `
const foo: any = [];
`,
      output: `
const foo: any[] = [];
`,
      errors: [{ messageId: 'noObviousAny' }],
      after() {
        checkFormatting(this);
      },
    },

    {
      name: 'Function declaration with obvious `any` parameter',
      code: `
function foo(n: any) {}

foo(42);
`,
      output: `
function foo(n: number) {}

foo(42);
`,
      errors: [{ messageId: 'noObviousAny' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Arrow function declaration with obvious `any` parameter',
      code: `
const foo = (n: any) => {};

foo(42);
`,
      output: `
const foo = (n: number) => {};

foo(42);
`,
      errors: [{ messageId: 'noObviousAny' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Arrow function declaration has no named export',
      code: `
const foo = (n: any) => {};

const bar = 42;
foo(bar);

export { bar };
`,
      output: `
const foo = (n: number) => {};

const bar = 42;
foo(bar);

export { bar };
`,
      errors: [{ messageId: 'noObviousAny' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Arrow function declaration has several calls',
      code: `
const foo = (n: any) => {};

const bar = 42;
foo(bar);

const quux = 37;
foo(quux);
`,
      output: `
const foo = (n: number) => {};

const bar = 42;
foo(bar);

const quux = 37;
foo(quux);
`,
      errors: [{ messageId: 'noObviousAny' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
