import path from 'node:path';

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './prefer-satisfies.js';

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
      name: 'With `satisfies` #docs',
      code: `
type Obj = { foo: number; bar: string };
const quux = { foo: 42, bar: 'ok' };

quux satisfies Obj;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a safe (widening) type assertion #docs',
      code: `
type Obj = { foo: number; bar: string };
const quux = { foo: 42, bar: 'ok' };

quux as { foo: number };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an unsafe (narrowing) type assertion #docs',
      code: `
type Obj = { foo: number; bar: string };
const quux = { foo: 42, bar: 'ok' };

quux as Obj & { baz: number };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a string and `as const` #docs',
      code: `
const foo = 'foo' as const;
const bar = foo satisfies 'foo';
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With optional keys',
      code: `
type Obj = { foo: number; bar: string };
const quux = { foo: 42, bar: 'ok' };

quux as Obj & { baz?: number };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With optional keys only',
      code: `
type Obj = { foo?: number; bar?: string };
const quux: Obj = { foo: 42, bar: 'ok' };

quux as Obj & { baz?: number };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a narrowing type assertion for record type with optional keys only',
      code: `
type Obj = { foo?: number; bar?: string };
const quux: Record<string, Obj> = { quux: { foo: 42, bar: 'ok' } };

quux as Record<string, Obj & { baz?: number }>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a widening type assertion for a record type with optional keys only in values',
      code: `
type Obj = { foo?: number; bar?: string; baz?: number };
const quux: Record<string, Obj> = { quux: { foo: 42, bar: 'ok' } };

quux as Record<string, { foo?: number; bar?: string }>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a widening type assertion for a record type with const index type and optional keys only in values',
      code: `
type Obj = { foo?: number; bar?: string; baz?: number };
const quux: Record<'quux', Obj> = { quux: { foo: 42, bar: 'ok' } };

quux as Record<keyof typeof quux, { foo?: number; bar?: string }>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With mapped types',
      code: `
type Obj = { foo?: number; bar?: string; baz?: number };
const quux = { quux: { foo: 42, bar: 'ok' } };

quux as { [k in keyof typeof quux]: { foo?: number; bar?: string } };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an unsafe (narrowing) type assertion from a const number to a number enum',
      code: `
enum FooEnum {
  QUUX = 1,
  FNORD = 2,
}
const n = 42 as const;
n as FooEnum;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an unsafe (narrowing) type assertion from a number to a number enum',
      code: `
enum FooEnum {
  QUUX = 1,
  FNORD = 2,
}
declare const n: number;
n as FooEnum;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an safe (widening) type assertion from a number enum to a number',
      code: `
enum FooEnum {
  QUUX = 1,
  FNORD = 2,
}
const n = FooEnum.QUUX;
n as number;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty object asserted as Record type',
      code: `
const foo = {} as Record<number, number>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a safe (widening) type assertion of a string record value',
      code: `
type Obj = { foo: number; bar: string };
const quux: Record<'fnord', { foo: number }> = { fnord: { foo: 42, bar: 'ok' } };

quux as Record<string, { foo: number }>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a safe (widening) type assertion of a record value with const index type',
      code: `
type Obj = { foo: number; bar: string };
const quux: Record<'fnord', { foo: number; bar: string }> = {
  fnord: { foo: 42, bar: 'ok' },
};

quux as Record<'fnord', { foo: number }>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a safe (widening) type assertion of a record value with keyof typeof',
      code: `
type Obj = { foo: number; bar: string };
const quux = { fnord: { foo: 42, bar: 'ok' } };

quux as Record<keyof typeof quux, { foo: number }>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`as any`',
      code: `
type Obj = { foo: number; bar: string };
const quux = { foo: 42, bar: 'ok' };

quux as any;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Expression is `any`',
      code: `
type Obj = { foo: number; bar: string };
declare const quux: any;

quux as Obj;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Expression is `unknown`',
      code: `
type Obj = { foo: number; bar: string };
declare const quux: unknown;

quux as Obj;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`as unknown`',
      code: `
type Obj = { foo: number; bar: string };
const quux = { foo: 42, bar: 'ok' };

quux as unknown;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`as never`',
      code: `
type Obj = { foo: number; bar: string };
const quux = { foo: 42, bar: 'ok' };

quux as never;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a safe (widening) type assertion with a boolean',
      code: `
true as boolean;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`satisfies` with a boolean',
      code: `
true satisfies true;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`as const`',
      code: `
true as const;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Function with multiple signatures',
      code: `
function foo(): string;
function foo(): number;
function foo() {
  return 42;
}

const bar = foo as (() => string) | (() => number);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Generic signatures',
      code: `
type Foo = <T>(o: T) => Array<[Extract<keyof T, string>, T[keyof T]]>;

type Bar = <T>(o: { [s: string]: T } | ArrayLike<T>) => [string, T][];

declare const bar: Bar;
const foo = bar as Foo;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Multiple generic signatures',
      code: `
function foo<T>(o: { [s: string]: T } | ArrayLike<T>): [string, T][];
function foo(o: {}): [string, any][];
function foo(o) {}

type Bar = <T>(o: T) => Array<[Extract<keyof T, string>, T[keyof T]]>;

const bar = foo as Bar;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Object.entries',
      code: `
const entries = Object.entries as <T>(
  o: T,
) => Array<[Extract<keyof T, string>, T[keyof T]]>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'any[]',
      code: `
declare const foo: any[];
foo as number[];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Promise<any>',
      code: `
declare const foo: Promise<any>;
foo as Promise<number>;
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'With a type assertion #docs',
      code: `
type Obj = { foo: number; bar: string };
const quux = { foo: 42, bar: 'ok' };

quux as Obj;
`,
      errors: [
        {
          messageId: 'preferSatisfies',
          suggestions: [
            {
              messageId: 'preferSatisfies',
              output: `
type Obj = { foo: number; bar: string };
const quux = { foo: 42, bar: 'ok' };

quux satisfies Obj;
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a string and `as const` #docs',
      code: `
const foo = 'foo'; // Could just add \`as const\` here
const bar = foo as 'foo';
`,
      errors: [
        {
          messageId: 'preferSatisfies',
          suggestions: [
            {
              messageId: 'preferSatisfies',
              output: `
const foo = 'foo'; // Could just add \`as const\` here
const bar = foo satisfies 'foo';
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Type assertion with a boolean',
      code: `
true as true;
`,
      errors: [
        {
          messageId: 'preferSatisfies',
          suggestions: [
            {
              messageId: 'preferSatisfies',
              output: `
true satisfies true;
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a parenthesized expression',
      code: `
({ foo: 'ok' }) as { foo: 'ok' };
`,
      errors: [
        {
          messageId: 'preferSatisfies',
          suggestions: [
            {
              messageId: 'preferSatisfies',
              output: `
({ foo: 'ok' }) satisfies { foo: 'ok' };
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
