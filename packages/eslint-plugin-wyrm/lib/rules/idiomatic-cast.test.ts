import path from 'node:path';

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './idiomatic-cast.js';

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
      name: 'Using `.toString()` with a number #docs',
      code: `
declare const foo: number;
foo.toString();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `String()` with a nullable number #docs',
      code: `
declare const foo: number | undefined;
String(foo);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Call expression but the callee is not an identifier',
      code: `
declare const foo: number | undefined;
(1 ? String : Quux)(foo);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Call expression but the callee is not `String`',
      code: `
declare const foo: number | undefined;
Quux(foo);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`String()` has no argument',
      code: `
declare const foo: number | undefined;
String();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`String()` argument is an array of numbers',
      code: `
declare const foo: number[];
String(foo);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`String()` argument is an object',
      code: `
const foo = new Object();
String(foo);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`String()` argument is a RegExp literal',
      code: `
String(/foo/i);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`String()` argument is a function',
      code: `
String(() => {});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`String()` argument is null',
      code: `
String(null);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`String()` argument is undefined',
      code: `
String(undefined);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unnecessary type conversion on a string',
      code: `
String('foo');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `Date()` with a number',
      code: `
declare const foo: number;
Date(foo);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `String()` with a union type (number | object)',
      code: `
declare const foo: number | object;
String(foo);
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Using `String()` with a number #docs',
      code: `
declare const foo: number;
String(foo);
`,
      output: `
declare const foo: number;
foo.toString();
`,
      errors: [{ messageId: 'useToString' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `String()` with a const number',
      code: `
const foo = 42 as const;
String(foo);
`,
      output: `
const foo = 42 as const;
foo.toString();
`,
      errors: [{ messageId: 'useToString' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `String()` with a number literal',
      code: `
String(42.0);
`,
      output: `
(42.0).toString();
`,
      errors: [{ messageId: 'useToString' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `String()` with a BigInt',
      code: `
declare const foo: BigInt;
String(foo);
`,
      output: `
declare const foo: BigInt;
foo.toString();
`,
      errors: [{ messageId: 'useToString' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `String()` with a BigInt literal',
      code: `
String(42n);
`,
      output: `
(42n).toString();
`,
      errors: [{ messageId: 'useToString' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `String()` with a date',
      code: `
String(new Date());
`,
      output: `
(new Date()).toString();
`,
      errors: [{ messageId: 'useToString' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `String()` with a boolean',
      code: `
String(true);
`,
      output: `
(true).toString();
`,
      errors: [{ messageId: 'useToString' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `String()` with a union type (number | string)',
      code: `
declare const foo: number | string;
String(foo);
`,
      output: `
declare const foo: number | string;
foo.toString();
`,
      errors: [{ messageId: 'useToString' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `String()` with a union type (number | boolean)',
      code: `
declare const foo: number | boolean;
String(foo);
`,
      output: `
declare const foo: number | boolean;
foo.toString();
`,
      errors: [{ messageId: 'useToString' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
