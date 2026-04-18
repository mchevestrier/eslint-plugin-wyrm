import path from 'node:path';

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './discarded-expression-statement.js';

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
      name: 'Call expression of a function returning void #docs',
      code: `
function foo() {}

foo();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Expression statement with type `any`',
      code: `
function foo(): any {
  return 42;
}

foo();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Call expression of a function returning undefined',
      code: `
function foo(): undefined {
  return undefined;
}

foo();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Call expression of a function returning unknown',
      code: `
function foo(): unknown {
  return 42;
}

foo();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Call expression of a function returning void | undefined',
      code: `
function foo(): void | undefined {
  return undefined;
}

foo();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'describe()',
      code: `
function describe() {
  return {};
}

describe();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '.mock()',
      code: `
const jest = { mock: () => ({}) };
const vi = { mock: () => ({}) };

jest.mock();
vi.mock();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '.mockClear()',
      code: `
const jest = { mockClear: () => ({}) };
jest.mockClear();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'String literal directive #docs',
      code: `
'use strict';
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Return value is ignored by wrapping in `void` #docs',
      code: `
function foo() {
  return 42;
}

void foo();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Return value is ignored by assigning to a variable #docs',
      code: `
function foo() {
  return 42;
}

const _ = foo();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`undefined`',
      code: `
undefined;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`null`',
      code: `
null;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Promise<void> | null`',
      code: `
function foo(x: number) {
  if (x < 0) return null;
  return bar(x);
}

async function bar(x: number) {
  console.log(x);
}

foo(42);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Promise<number> | number`, not awaited',
      code: `
function foo(x: number) {
  if (x < 0) return 105;
  return bar(x);
}

async function bar(x: number) {
  return x + 1;
}

foo(42);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Simple assignment',
      code: `
let foo;
foo = 42;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Nullish coalescing assignment',
      code: `
let foo = null;
foo ??= 42;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Update expression',
      code: `
let foo = 42;
foo--;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array fill',
      code: `
let foo = [42];
foo.fill(null);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array pop',
      code: `
let foo = [42];
foo.pop();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array push',
      code: `
let foo = [];
foo.push(42);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Map add',
      code: `
let foo = new Map<string, number>();
foo.add('bar');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Map delete',
      code: `
let foo = new Map<string, number>();
foo.delete('bar');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Map set',
      code: `
let foo = new Map<string, number>();
foo.set(42);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Yield expression with void type',
      code: `
function* foo(): Generator<number, void, void> {
  yield 42;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Yield expression',
      code: `
function* foo() {
  yield 42;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Awaited promise, returning `void`, with `ignorePromises: false`',
      options: [
        {
          ignorePromises: false,
          ignoredFunctions: [],
          ignoredObjects: [],
          ignoredMethods: [],
        },
      ],
      code: `
async function foo() {
  console.log(42);
}
await foo();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Promise<void>, not awaited, with `ignorePromises: true`',
      options: [
        {
          ignorePromises: true,
          ignoredFunctions: [],
          ignoredObjects: [],
          ignoredMethods: [],
        },
      ],
      code: `
async function foo() {
  console.log(42);
}
foo();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Awaited promise, not ignored',
      code: `
async function foo() {
  return 42;
}
const x = await foo();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'array?.push()',
      code: `
declare const foo: string[] | null;
foo?.push(42);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Chainable methods',
      code: `
declare class Foo {
  bar(): this;
}
declare const foo: Foo;
foo.bar();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`void[]` type is ignored',
      code: `
async function foo() {
  await Promise.all(
    [1, 2, 3].map(async (x) => {
      console.log(x);
    }),
  );
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`[void, void, void]` type is ignored',
      code: `
async function foo() {
  const arr = [1, 2, 3] as const;
  const promises = arr.map(async (x) => {
    console.log(x);
  }) as [Promise<void>, Promise<void>, Promise<void>];
  (await Promise.all(promises)) satisfies [void, void, void];
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Ignored function',
      options: [
        {
          ignorePromises: true,
          ignoredFunctions: ['foo'],
          ignoredObjects: [],
          ignoredMethods: [],
        },
      ],
      code: `
function foo(): number {
  return 105;
}

foo();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Ignored awaited function',
      options: [
        {
          ignorePromises: true,
          ignoredFunctions: ['foo'],
          ignoredObjects: [],
          ignoredMethods: [],
        },
      ],
      code: `
async function foo(): Promise<number> {
  return 105;
}

await foo();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'document.body.appendChild()',
      code: `
const div = document.createElement('div');
document.body.appendChild(div);
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Number literal in expression statement #docs',
      code: `
42;
`,
      errors: [{ messageId: 'unusedExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'String literal in expression statement #docs',
      code: `
'foo';
`,
      errors: [{ messageId: 'unusedExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Awaited `Promise<number>` #docs',
      code: `
async function foo(): Promise<number> {
  return 42;
}
await foo();
`,
      errors: [{ messageId: 'unusedExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Promise<void>, not awaited, with `ignorePromises: false`',
      options: [
        {
          ignorePromises: false,
          ignoredFunctions: [],
          ignoredObjects: [],
          ignoredMethods: [],
        },
      ],
      code: `
async function foo() {
  console.log(42);
}
foo();
`,
      errors: [{ messageId: 'unusedExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Promise<void> | null`, not awaited, with `ignorePromises: false`',
      options: [
        {
          ignorePromises: false,
          ignoredFunctions: [],
          ignoredObjects: [],
          ignoredMethods: [],
        },
      ],
      code: `
function foo(x: number) {
  if (x < 0) return null;
  return bar(x);
}

async function bar(x: number) {
  console.log(x);
}

foo(42);
`,
      errors: [{ messageId: 'unusedExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Awaited `Promise<number> | null`',
      code: `
function foo(x: number) {
  if (x < 0) return null;
  return bar(x);
}

async function bar(x: number) {
  return x + 1;
}

await foo(42);
`,
      errors: [{ messageId: 'unusedExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Promise<number> | number`, not awaited, with `ignorePromises: false`',
      options: [
        {
          ignorePromises: false,
          ignoredFunctions: [],
          ignoredObjects: [],
          ignoredMethods: [],
        },
      ],
      code: `
function foo(x: number) {
  if (x < 0) return 105;
  return bar(x);
}

async function bar(x: number) {
  return x + 1;
}

foo(42);
`,
      errors: [{ messageId: 'unusedExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Awaited `Promise<number> | number`',
      code: `
function foo(x: number) {
  if (x < 0) return 105;
  return bar(x);
}

async function bar(x: number) {
  return x + 1;
}

await foo(42);
`,
      errors: [{ messageId: 'unusedExpression' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
