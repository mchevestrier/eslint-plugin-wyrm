import path from 'node:path';

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './eqeq-null.js';

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
      name: 'Using `== null` with a possibly nullish value #docs',
      code: `
declare const foo: number | null | undefined;
foo == null;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `== undefined` with a possibly nullish value #docs',
      code: `
declare const foo: number | null | undefined;
foo == undefined;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a nullish check',
      code: `
declare const foo: number | null;
foo == bar;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not nullish',
      code: `
declare const foo: number;
foo == null;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Comparing to a literal but not null',
      code: `
declare const foo: number | null;
foo == 42;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a nullish union',
      code: `
declare const foo: number | string;
foo == null;
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Using `== null` with a possibly null value #docs',
      code: `
declare const foo: number | null;
foo == null;
`,
      output: `
declare const foo: number | null;
foo === null;
`,
      errors: [{ messageId: 'useEqEqEqNull', data: { op: '===' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `== null` with a possibly undefined value #docs',
      code: `
declare const foo: number | undefined;
foo == null;
`,
      output: `
declare const foo: number | undefined;
foo === undefined;
`,
      errors: [{ messageId: 'useEqEqEqUndefined', data: { op: '===' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `!= null` with a possibly null value #docs',
      code: `
declare const foo: number | null;
foo != null;
`,
      output: `
declare const foo: number | null;
foo !== null;
`,
      errors: [{ messageId: 'useEqEqEqNull', data: { op: '!==' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `!= null` with a possibly undefined value #docs',
      code: `
declare const foo: number | undefined;
foo != null;
`,
      output: `
declare const foo: number | undefined;
foo !== undefined;
`,
      errors: [{ messageId: 'useEqEqEqUndefined', data: { op: '!==' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `== null` with a definitely nullish value #docs',
      code: `
declare const foo: null | undefined;
foo == null;
`,
      output: null,
      errors: [{ messageId: 'constantEquality' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `!= null` with a definitely nullish value #docs',
      code: `
declare const foo: null | undefined;
foo != null;
`,
      output: null,
      errors: [{ messageId: 'constantInequality' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `== undefined` with a definitely nullish value',
      code: `
declare const foo: null | undefined;
foo == undefined;
`,
      output: null,
      errors: [{ messageId: 'constantEquality' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `!= undefined` with a definitely nullish value',
      code: `
declare const foo: null | undefined;
foo != undefined;
`,
      output: null,
      errors: [{ messageId: 'constantInequality' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `== undefined` with a possibly null value',
      code: `
declare const foo: number | null;
foo == undefined;
`,
      output: `
declare const foo: number | null;
foo === null;
`,
      errors: [{ messageId: 'useEqEqEqNull', data: { op: '===' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `== undefined` with a possibly undefined value',
      code: `
declare const foo: number | undefined;
foo == undefined;
`,
      output: `
declare const foo: number | undefined;
foo === undefined;
`,
      errors: [{ messageId: 'useEqEqEqUndefined', data: { op: '===' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `== null` with a definitely null value',
      code: `
declare const foo: null;
foo == null;
`,
      output: `
declare const foo: null;
foo === null;
`,
      errors: [{ messageId: 'useEqEqEqNull', data: { op: '===' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `== null` with a definitely undefined value',
      code: `
declare const foo: undefined;
foo == null;
`,
      output: `
declare const foo: undefined;
foo === undefined;
`,
      errors: [{ messageId: 'useEqEqEqUndefined', data: { op: '===' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `null ==` with a possibly null value',
      code: `
declare const foo: number | null;
null == foo;
`,
      output: `
declare const foo: number | null;
foo === null;
`,
      errors: [{ messageId: 'useEqEqEqNull', data: { op: '===' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using `undefined ==` with a possibly undefined value',
      code: `
declare const foo: number | undefined;
undefined == foo;
`,
      output: `
declare const foo: number | undefined;
foo === undefined;
`,
      errors: [{ messageId: 'useEqEqEqUndefined', data: { op: '===' } }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
