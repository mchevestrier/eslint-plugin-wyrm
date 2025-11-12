import path from 'node:path';

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './unsafe-asserted-chain.js';

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
      name: 'Optional chain asserted as nullable #docs',
      code: `declare const foo: { bar: string | number } | null;
const str = (foo?.bar as string | undefined)?.toUpperCase();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Optional chain asserted as nullable union',
      code: `declare const foo: { bar: string | number } | null;
const str = (foo?.bar as string | number | undefined)?.toString();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Optional chain asserted as any #docs',
      code: `declare const foo: { bar: string | number } | null;
const str = (foo?.bar as any)?.toUpperCase();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Optional chain asserted as unknown #docs',
      code: `declare const foo: { bar: string | number } | null;
const str = (foo?.bar as unknown)?.toUpperCase();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Optional chain asserted as union containing any',
      code: `declare const foo: { bar: string | number } | null;
const str = (foo?.bar as string | any)?.toUpperCase();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a non-null assertion on an optional chain. Already checked by `@typescript-eslint/no-non-null-asserted-optional-chain`.',
      code: `declare const foo: { bar: string | number } | null;
const str = (foo?.bar! as string).toUpperCase();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Optional chain asserted as union containing unknown',
      code: `declare const foo: { bar: string | number } | null;
const str = (foo?.bar as string | unknown)?.toUpperCase();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Optional chain asserted as nullable indexed access type',
      code: `declare const foo: { bar?: string | number };
const str = (foo?.bar as (typeof foo)['bar'])?.toString();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Type assertion is not on a chain expression',
      code: `declare const foo: string | undefined;
const str = (foo as string).toString();
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Optional chain asserted as not undefined #docs',
      code: `declare const foo: { bar: string | number } | null;
const str = (foo?.bar as string).toUpperCase();
`,
      errors: [{ messageId: 'unsafeAssertionOnOptionalChain' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Optional chain call expression asserted as not undefined #docs',
      code: `declare const foo: { bar: () => string | number } | null;
const str = (foo?.bar() as string | number)?.toString();
`,
      errors: [{ messageId: 'unsafeAssertionOnOptionalChain' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Optional chain asserted as non nullable indexed access type',
      code: `declare const foo: { bar: string | number } | null;
const str = (foo?.bar as NonNullable<typeof foo>['bar']).toString();
`,
      errors: [{ messageId: 'unsafeAssertionOnOptionalChain' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
