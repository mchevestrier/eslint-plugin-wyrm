import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './unsafe-asserted-chain.js';

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ['*.ts*'],
      },
      errorOnTypeScriptSyntacticAndSemanticIssues: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
});

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Optional chain asserted as nullable (included in docs)',
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
      name: 'Optional chain asserted as any (included in docs)',
      code: `declare const foo: { bar: string | number } | null;
const str = (foo?.bar as any)?.toUpperCase();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Optional chain asserted as unknown (included in docs)',
      code: `declare const foo: { bar: string | number } | null;
const str = (foo?.bar as unknown)?.toUpperCase();
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
  ],
  invalid: [
    {
      name: 'Optional chain asserted as not undefined (included in docs)',
      code: `declare const foo: { bar: string | number } | null;
const str = (foo?.bar as string).toUpperCase();
`,
      errors: [{ messageId: 'unsafeAssertionOnOptionalChain' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Optional chain call expression asserted as not undefined (included in docs)',
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
