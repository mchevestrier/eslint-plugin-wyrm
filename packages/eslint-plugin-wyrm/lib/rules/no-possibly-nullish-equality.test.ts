import path from 'node:path';

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-possibly-nullish-equality.js';

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
      name: 'Compared values are not possibly nullish #docs',
      code: `
declare const foo: string | number;
declare const bar: string | number;
foo === bar;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Left value is not possibly nullish #docs',
      code: `
declare const foo: string | number;
declare const bar: string | number | null;
foo === bar;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Right value is not possibly nullish',
      code: `
declare const foo: string | number | null;
declare const bar: string | number;
foo === bar;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Binary expression is not an equality check',
      code: `
declare const foo: number | undefined;
declare const bar: number | undefined;
foo > bar;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Possibly nullish values do not intersect (null & undefined)',
      code: `
declare const foo: string | null;
declare const bar: string | undefined;
foo === bar;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Possibly nullish values do not intersect (undefined & null)',
      code: `
declare const foo: string | undefined;
declare const bar: string | null;
foo === bar;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Only one possibly null value',
      code: `
declare const foo: string | null;
declare const bar: string;
foo === bar;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Only one possibly undefined value',
      code: `
declare const foo: string;
declare const bar: string | undefined;
foo === bar;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Number comparison, already checked by TypeScript',
      code: `
declare const foo: number;
declare const bar: number | undefined;
foo >= bar;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Literal null comparison #docs',
      code: `
declare const foo: number | undefined;
foo != null;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Literal undefined comparison',
      code: `
declare const foo: number | undefined;
foo === undefined;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Literal undefined comparison (loose inequality)',
      code: `
declare const foo: number | null;
foo != undefined;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Literal number comparison',
      code: `
declare const foo: number | null;
foo === 42;
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Comparing possibly undefined values #docs',
      code: `
declare const foo: string | undefined;
declare const bar: string | undefined;
foo === bar;
`,
      errors: [{ messageId: 'noPossiblyNullishEquality' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Comparing possibly null values #docs',
      code: `
declare const foo: string | null;
declare const bar: string | null;
foo === bar;
`,
      errors: [{ messageId: 'noPossiblyNullishEquality' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Comparing possibly nullish values #docs',
      code: `
declare const foo: string | undefined | null;
declare const bar: string | undefined | null;
foo === bar;
`,
      errors: [{ messageId: 'noPossiblyNullishEquality' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Possibly nullish values do not intersect, but using loose equality',
      code: `
declare const foo: string | null;
declare const bar: string | undefined;
foo == bar;
`,
      errors: [{ messageId: 'noPossiblyNullishLooseEquality' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Possibly nullish values do not intersect, but using loose inequality',
      code: `
declare const foo: string | null;
declare const bar: string | undefined;
foo != bar;
`,
      errors: [{ messageId: 'noPossiblyNullishLooseEquality' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Constant undefined comparison',
      code: `
declare const foo: undefined;
declare const bar: undefined;
foo === bar;
`,
      errors: [{ messageId: 'noConstantNullishComparison' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Constant null comparison',
      code: `
declare const foo: null;
declare const bar: null;
foo === bar;
`,
      errors: [{ messageId: 'noConstantNullishComparison' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Constant nullish comparison',
      code: `
declare const foo: undefined | null;
declare const bar: undefined | null;
foo !== bar;
`,
      errors: [{ messageId: 'noConstantNullishComparison' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Comparing value with constant undefined value (left side)',
      code: `
declare const foo: undefined;
declare const bar: string | undefined;
foo === bar;
`,
      errors: [{ messageId: 'noConstantNullishComparison' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Comparing value with constant null value (left side)',
      code: `
declare const foo: null;
declare const bar: string | null;
foo === bar;
`,
      errors: [{ messageId: 'noConstantNullishComparison' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Comparing value with constant nullish value (left side)',
      code: `
declare const foo: undefined | null;
declare const bar: string | null;
foo === bar;
`,
      errors: [{ messageId: 'noConstantNullishComparison' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Comparing possibly nullish value with constant nullish value (left side)',
      code: `
declare const foo: undefined | null;
declare const bar: string | undefined | null;
foo === bar;
`,
      errors: [{ messageId: 'noConstantNullishComparison' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Comparing value with constant undefined value (right side)',
      code: `
declare const foo: string | undefined;
declare const bar: undefined;
foo === bar;
`,
      errors: [{ messageId: 'noConstantNullishComparison' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Comparing value with constant null value (right side)',
      code: `
declare const foo: string | null;
declare const bar: null;
foo === bar;
`,
      errors: [{ messageId: 'noConstantNullishComparison' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Comparing value with constant nullish value (right side)',
      code: `
declare const foo: string | null;
declare const bar: undefined | null;
foo === bar;
`,
      errors: [{ messageId: 'noConstantNullishComparison' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Comparing possibly nullish value with constant nullish value (right side)',
      code: `
declare const foo: string | undefined | null;
declare const bar: undefined | null;
foo === bar;
`,
      errors: [{ messageId: 'noConstantNullishComparison' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
