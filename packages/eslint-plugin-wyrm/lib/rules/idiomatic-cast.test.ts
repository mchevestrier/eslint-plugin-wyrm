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
  ],
});
