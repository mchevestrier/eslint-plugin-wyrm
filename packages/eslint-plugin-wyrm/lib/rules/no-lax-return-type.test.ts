import path from 'node:path';

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-lax-return-type.js';

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
      name: 'No explicit return type',
      code: `
function foo() {
  if (Math.random()) return 'bar';
  return 'foo';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'No explicit return type (multiple return types)',
      code: `
function id<T>(x: T): T {
  return x;
}

function foo(str: string) {
  if (!str) {
    throw Error('String is empty');
  }
  if (Math.random()) return undefined;
  const x = 'foo';
  return id(x);
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Return type is not too wide #docs',
      code: `
function foo(): string {
  if (Math.random()) return 'bar';
  return 'foo';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Return type is a union type #docs',
      code: `
function foo(): string | null {
  if (Math.random()) return null;
  return 'foo';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Return type is narrow',
      code: `
function foo(): 'bar' | 'foo' {
  if (Math.random()) return 'bar';
  return 'foo';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Several return statements have the same type',
      code: `
function foo(): 'bar' | 'foo' {
  if (Math.random()) return 'bar';
  if (Math.random()) return 'foo';
  return 'bar';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Return type is narrow (different order for the union type)',
      code: `
function foo(): 'foo' | 'bar' {
  if (Math.random()) return 'bar';
  return 'foo';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With multiple signatures and a lax implementation signature (but no lax public signature)',
      code: `
function foo(): string;
function foo(): string | null {
  if (Math.random()) return 'bar';
  return 'foo';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a single return value',
      code: `
function foo() {
  return true;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a single return value and several signatures',
      code: `
function foo();
function foo(str: string);
function foo(str?: string) {
  declare const baz: boolean | undefined;
  return baz;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a boolean return',
      code: `
function isEqual(a: string, b: string): boolean {
  return a === b;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a union type in a type alias',
      code: `
type Quux = string | null;

function MyComponent(): Quux {
  return null;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an if statement and a switch',
      code: `
function MyComponent(n: number): string | null {
  if (n > 100) return null;

  switch (n) {
    case 1:
      return 'foo';
    case 2:
      return 'bar';
    case 3:
      return 'baz';
    default:
      return null;
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With nested union types',
      code: `
type Quux = 'foo' | 'bar' | 'baz' | 'fnord';

function foo(n: number): Quux | null {
  switch (n) {
    case 1:
      return 'foo';
    case 2:
      return 'bar';
    case 3:
      return 'baz';
    default:
      return null;
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a union of object types in a type alias',
      code: `
enum Kind {
  FOO = 'foo',
  BAR = 'bar',
  BAZ = 'baz',
}

interface Foo {
  key: string;
  fnord: boolean;
  kind: Kind.FOO;
}

interface Bar extends Omit<Foo, 'fnord' | 'kind'> {
  key: string;
  fnord: number;
  kind: Kind.BAR;
}

interface Baz extends Omit<Foo, 'fnord' | 'kind'> {
  key: string;
  baz: boolean | undefined;
  kind: Kind.BAZ;
}

type Quux = Foo | Bar | Baz;

function MyComponent(): Quux {
  return { key: 'foo', fnord: 42, kind: Kind.BAR };
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a union type in a type alias (with a function signature)',
      code: `
type Quux = string | null;

function MyComponent(): Quux;
function MyComponent() {
  return null;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a conditional return type',
      code: `
export enum DonutType {
  GLAZED = 'glazed',
  CHOCOLATE = 'chocolate',
  SPRINKLE = 'sprinkle',
}

const ChocolateFillingConfig = {};
const GlazedToppingConfig = {};
const SprinkleMixConfig = {};

export function getDonutConfig<T extends DonutType | undefined>(
  donutType: T,
): T extends DonutType.CHOCOLATE
  ? typeof ChocolateFillingConfig
  : T extends DonutType.GLAZED
    ? typeof GlazedToppingConfig
    : typeof SprinkleMixConfig;

export function getDonutConfig(
  donutType?: DonutType,
): typeof ChocolateFillingConfig | typeof GlazedToppingConfig | typeof SprinkleMixConfig {
  switch (donutType) {
    case DonutType.CHOCOLATE:
      return ChocolateFillingConfig;
    case DonutType.GLAZED:
      return GlazedToppingConfig;
    case DonutType.SPRINKLE:
    default:
      return SprinkleMixConfig;
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a possibly undefined index access',
      code: `
interface Quux {
  key: string;
}

function getValidQuuxes(quuxes: Quux[]): Quux | undefined {
  const filteredQuux = quuxes.filter((q) => q.key);
  return filteredQuux[0];
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a null fallback',
      code: `
interface Quux {
  key: string;
}

function getValidQuuxes(quuxes: Quux[]): Quux | null {
  const filteredQuux = quuxes.filter((q) => q.key);
  return filteredQuux[0] ?? null;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a ternary return',
      code: `
const foo = { fnord: string };
const bar = { baz: number };

export function fun(param = false): typeof foo | typeof bar {
  return param ? foo : bar;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Return type is `void`',
      code: `
function foo(): void {
  if (Math.random()) return;
  return 'foo';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Return type is `any`',
      code: `
function foo(): any {
  if (Math.random()) return 'bar';
  return 'foo';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a return type including `void`',
      code: `
function fun(param = false): void | string {
  if (1) return;
  return 'ok';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a return type including `any`',
      code: `
function fun(param = false): any | number {
  if (1) return 42;
  return 'ok';
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an inferred return type of `any`',
      code: `
function fun(param = false): string | number {
  if (1) return 42;
  return 105 as any;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With no return statement',
      code: `
function foo(): void {
  if (Math.random()) console.log('foo');
  else console.log('bar');
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `for` loop',
      code: `
export function fun(arr: string[]): string | number | boolean {
  for (let i = 0; i < arr.length; i++) {
    return arr[i] ?? 42;
  }

  return false;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `for...in` loop',
      code: `
export function fun(obj: unknown): string | number | boolean {
  for (let k in obj) {
    return String(obj[k]) || 42;
  }

  return true;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `for...of` loop',
      code: `
export function fun(arr: unknown[]): string | number | boolean {
  for (const elt of arr) {
    try {
      return JSON.stringify(elt);
    } catch {
      return 42;
    }
  }

  return false;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `try/finally` block',
      code: `
export function fun(arr: unknown[]): string | number {
  try {
    return JSON.stringify(elt);
  } finally {
    return 42;
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an async function',
      code: `
async function fun(): Promise<string | number> {
  if (Math.random()) return 'foo';
  return 42;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an async function and return values using Promise.resolve()',
      code: `
async function fun(): Promise<string | number> {
  if (Math.random()) return Promise.resolve('foo');
  return Promise.resolve(42);
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Returning an array',
      code: `
function fun(): Array<string | number> {
  return [42];
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a Promise type alias',
      code: `
type PromiseAlias = Promise;

async function fun(): PromiseAlias<string | number> {
  return 42;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a Promise type alias including the type argument',
      code: `
type PromiseAlias = Promise<string | number>;

async function fun(): PromiseAlias {
  return 42;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With shadowing of the Promise type',
      code: `
type Promise = Promise<string | number>;

async function fun(): Promise {
  return 42;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Returning a union of Promise types',
      code: `
async function fun(): Promise<string> | Promise<number> {
  return 42;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Returning a union of Promise type aliases',
      code: `
type StringPromise = Promise<string>;
type NumberPromise = Promise<number>;

async function fun(): StringPromise | NumberPromise {
  return 42;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Async function returns a qualified name',
      code: `
namespace Quux {
  export type Promise = Promise<string | number>;
}

async function fun(): Quux.Promise {
  return 42;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Returning a promise but not async',
      code: `
function fun(): Promise<string | number> {
  return Promise.resolve(42);
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a class method',
      code: `
class Quux {
  getMsg(): string | undefined {
    return undefined;
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a single generic signature',
      code: `
type Value = string | number;

function fun<T extends Value>(options: T[]): T[] {
  return options.map((item) => item);
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With multiple generic signatures',
      code: `
type Value = string | number;

function fun<T extends Value>(options: T[]): T[];
function fun<T extends Value>(options: T[]): T[];
function fun<T extends Value>(options: T[]): T[] {
  return options.map((item) => item);
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a single generic signature and indexed access types',
      code: `
const DONUT_BITES = {
  0.5: '0.25rem',
  1: '0.5rem',
  2: '1rem',
} as const;

export type DonutBiteSize = keyof typeof DONUT_BITES;

function bite<S extends DonutBiteSize>(size: S): (typeof DONUT_BITES)[S] {
  return DONUT_BITES[size];
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With multiple generic signatures and indexed access types',
      code: `
const DONUT_BITES = {
  0.5: '0.25rem',
  1: '0.5rem',
  2: '1rem',
} as const;

export type DonutBiteSize = keyof typeof DONUT_BITES;

function bite<S extends 0.5>(size: S): (typeof DONUT_BITES)[S];
function bite<S extends 1>(size: S): (typeof DONUT_BITES)[S];
function bite<S extends 2>(size: S): (typeof DONUT_BITES)[S];
function bite<S extends DonutBiteSize>(size: S): (typeof DONUT_BITES)[S] {
  return DONUT_BITES[size];
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Return type is wider than the return values #docs',
      code: `
function foo(): string | null {
  if (Math.random()) return 'bar';
  return 'foo';
}
`,
      errors: [
        {
          messageId: 'noLaxReturnType',
          data: { unusedType: 'null' },
          line: 2,
          endLine: 2,
          column: 26,
          endColumn: 30,
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'null' },
              output: `
function foo(): string   {
  if (Math.random()) return 'bar';
  return 'foo';
}
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
      name: 'With several unused return types',
      code: `
function foo(): string | null | undefined {
  if (Math.random()) return 'bar';
  return 'foo';
}
`,
      errors: [
        {
          messageId: 'noLaxReturnType',
          data: { unusedType: 'null' },
          line: 2,
          endLine: 2,
          column: 26,
          endColumn: 30,
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'null' },
              output: `
function foo(): string   | undefined {
  if (Math.random()) return 'bar';
  return 'foo';
}
`,
            },
          ],
        },
        {
          messageId: 'noLaxReturnType',
          data: { unusedType: 'undefined' },
          line: 2,
          endLine: 2,
          column: 33,
          endColumn: 42,
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'undefined' },
              output: `
function foo(): string | null   {
  if (Math.random()) return 'bar';
  return 'foo';
}
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
      name: 'With multiple signatures',
      code: `
function foo(): string;
function foo(): string | null;
function foo(): string | null {
  if (Math.random()) return 'bar';
  return 'foo';
}
`,
      errors: [
        {
          messageId: 'noLaxReturnType',
          data: { unusedType: 'null' },
          line: 3,
          endLine: 3,
          column: 26,
          endColumn: 30,
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'null' },
              output: `
function foo(): string;
function foo(): string  ;
function foo(): string | null {
  if (Math.random()) return 'bar';
  return 'foo';
}
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
      name: 'With multiple signatures and several unused return types',
      code: `
function foo(): string;
function foo(): undefined | string;
function foo(): string | null;
function foo(): unknown {
  if (Math.random()) return 'bar';
  return 'foo';
}
`,
      errors: [
        {
          messageId: 'noLaxReturnType',
          data: { unusedType: 'undefined' },
          line: 3,
          endLine: 3,
          column: 17,
          endColumn: 26,
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'undefined' },
              output: `
function foo(): string;
function foo():   string;
function foo(): string | null;
function foo(): unknown {
  if (Math.random()) return 'bar';
  return 'foo';
}
`,
            },
          ],
        },
        {
          messageId: 'noLaxReturnType',
          data: { unusedType: 'null' },
          line: 4,
          endLine: 4,
          column: 26,
          endColumn: 30,
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'null' },
              output: `
function foo(): string;
function foo(): undefined | string;
function foo(): string  ;
function foo(): unknown {
  if (Math.random()) return 'bar';
  return 'foo';
}
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
      name: 'With nested union types',
      code: `
type Quux = 'foo' | 'bar' | 'baz' | 'fnord';

function foo(n: number): Quux | null {
  switch (n) {
    case 1:
    case 2:
    case 3:
    default:
      return null;
  }
}
`,
      errors: [
        {
          messageId: 'noLaxReturnType',
          data: { unusedType: 'Quux' },
          line: 4,
          endLine: 4,
          column: 26,
          endColumn: 30,
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'Quux' },
              output: `
type Quux = 'foo' | 'bar' | 'baz' | 'fnord';

function foo(n: number):   null {
  switch (n) {
    case 1:
    case 2:
    case 3:
    default:
      return null;
  }
}
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
      name: 'With a function expression',
      code: `
const foo = function (): string | null {
  if (Math.random()) return 'bar';
  return 'foo';
};
`,
      errors: [
        {
          messageId: 'noLaxReturnType',
          data: { unusedType: 'null' },
          line: 2,
          endLine: 2,
          column: 35,
          endColumn: 39,
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'null' },
              output: `
const foo = function (): string   {
  if (Math.random()) return 'bar';
  return 'foo';
};
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
      name: 'With an arrow function expression',
      code: `
const foo = (): string | null => {
  if (Math.random()) return 'bar';
  return 'foo';
};
`,
      errors: [
        {
          messageId: 'noLaxReturnType',
          data: { unusedType: 'null' },
          line: 2,
          endLine: 2,
          column: 26,
          endColumn: 30,
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'null' },
              output: `
const foo = (): string   => {
  if (Math.random()) return 'bar';
  return 'foo';
};
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
      name: 'With an inline arrow function',
      code: `
const foo = (): string | null => 'bar';
`,
      errors: [
        {
          messageId: 'noLaxReturnType',
          data: { unusedType: 'null' },
          line: 2,
          endLine: 2,
          column: 26,
          endColumn: 30,
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'null' },
              output: `
const foo = (): string   => 'bar';
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
      name: 'With a `try/catch` block',
      code: `
export function fun(elt: unknown): string | number | boolean {
  try {
    return JSON.stringify(elt);
  } catch {
    return 42;
  }
}
`,
      errors: [
        {
          messageId: 'noLaxReturnType',
          data: { unusedType: 'boolean' },
          line: 2,
          endLine: 2,
          column: 54,
          endColumn: 61,
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'boolean' },
              output: `
export function fun(elt: unknown): string | number   {
  try {
    return JSON.stringify(elt);
  } catch {
    return 42;
  }
}
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
      name: 'With a single generic signature',
      code: `
type Value = string | number;

function fun<T extends Value>(options: T[]): T[] | null {
  return options.map((item) => item);
}
`,
      errors: [
        {
          messageId: 'noLaxReturnType',
          data: { unusedType: 'null' },
          line: 4,
          endLine: 4,
          column: 52,
          endColumn: 56,
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'null' },
              output: `
type Value = string | number;

function fun<T extends Value>(options: T[]): T[]   {
  return options.map((item) => item);
}
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
      name: 'With a union of types where the second type extends the first one (the first one is returned)',
      code: `
interface First {
  key: string;
}

type Second = First & {
  count: number;
};

function fun(count?: number): First | Second {
  // val is not assignable to First unless First is widened
  // val is not assignable to Second
  // But val is assignable to First | Second
  const val = { key: 'quux', count };
  return val;
}
`,
      errors: [
        {
          messageId: 'noLaxReturnType',
          data: { unusedType: 'Second' },
          line: 10,
          endLine: 10,
          column: 39,
          endColumn: 45,
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'Second' },
              output: `
interface First {
  key: string;
}

type Second = First & {
  count: number;
};

function fun(count?: number): First   {
  // val is not assignable to First unless First is widened
  // val is not assignable to Second
  // But val is assignable to First | Second
  const val = { key: 'quux', count };
  return val;
}
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
      name: 'With an async function',
      code: `
async function fun(): Promise<string | number> {
  return 42;
}
`,
      errors: [
        {
          messageId: 'noLaxReturnType',
          data: { unusedType: 'string' },
          line: 2,
          endLine: 2,
          column: 31,
          endColumn: 37,
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'string' },
              output: `
async function fun(): Promise<  number> {
  return 42;
}
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
      name: 'With a union of types where the second type extends the first one (the second one is returned)',
      code: `
interface First {
  key: string;
}

type Second = First & {
  count: number;
};

function fun(count: number): First | Second {
  return { key: 'quux', count };
}
`,
      errors: [
        {
          messageId: 'noLaxReturnType',
          data: { unusedType: 'First' },
          line: 10,
          endLine: 10,
          column: 30,
          endColumn: 35,
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'First' },
              output: `
interface First {
  key: string;
}

type Second = First & {
  count: number;
};

function fun(count: number):   Second {
  return { key: 'quux', count };
}
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
      name: 'With a union of types where the second type extends the first one (the return value is not assignable to any of them)',
      code: `
interface First {
  key: string;
}

type Second = First & {
  count: number;
};

function fun(count?: number): First | Second {
  // val is not assignable to First unless First is widened
  // val is not assignable to Second
  // But val is assignable to First | Second
  return { key: 'quux', count };
}
`,
      errors: [
        {
          messageId: 'noLaxReturnType',
          data: { unusedType: 'First' },
          line: 10,
          endLine: 10,
          column: 31,
          endColumn: 36,
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'First' },
              output: `
interface First {
  key: string;
}

type Second = First & {
  count: number;
};

function fun(count?: number):   Second {
  // val is not assignable to First unless First is widened
  // val is not assignable to Second
  // But val is assignable to First | Second
  return { key: 'quux', count };
}
`,
            },
          ],
        },
        {
          messageId: 'noLaxReturnType',
          data: { unusedType: 'Second' },
          line: 10,
          endLine: 10,
          column: 39,
          endColumn: 45,
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'Second' },
              output: `
interface First {
  key: string;
}

type Second = First & {
  count: number;
};

function fun(count?: number): First   {
  // val is not assignable to First unless First is widened
  // val is not assignable to Second
  // But val is assignable to First | Second
  return { key: 'quux', count };
}
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
      name: 'With a single return type and void inferred return type',
      code: `
function fun(param = false): string {
  if (1) return;
  return;
}
`,
      errors: [
        {
          messageId: 'noLaxReturnType',
          data: { unusedType: 'string' },
          line: 2,
          endLine: 2,
          column: 30,
          endColumn: 36,
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'string' },
              output: `
function fun(param = false)  {
  if (1) return;
  return;
}
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
      name: 'Returning weird exotic thenable objects',
      code: `
async function fun(): Promise<string | number> {
  if (Math.random()) {
    return {
      then() {
        return 'foo';
      },
    };
  }
  return Promise.resolve(42);
}
`,
      errors: [
        {
          messageId: 'noLaxReturnType',
          data: { unusedType: 'string' },
          line: 2,
          endLine: 2,
          column: 31,
          endColumn: 37,
          suggestions: [
            {
              messageId: 'removeType',
              data: { unusedType: 'string' },
              output: `
async function fun(): Promise<  number> {
  if (Math.random()) {
    return {
      then() {
        return 'foo';
      },
    };
  }
  return Promise.resolve(42);
}
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
