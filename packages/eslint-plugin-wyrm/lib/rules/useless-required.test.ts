import path from 'node:path';

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './useless-required.js';

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
      name: '`Required<T>` with a reference to a type with some optional properties #docs',
      code: `
type Foo = {
  quux?: string | undefined;
  bar: number;
  quux: number | undefined;
};

type Bar = Required<Foo>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Partial<T>` with a reference to a type with some required properties #docs',
      code: `
type Foo = {
  quux?: string | undefined;
  bar: number;
  quux: number | undefined;
};

type Bar = Partial<Foo>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not `Required<T>` or `Partial<T>`',
      code: `
type Foo = { quux?: string | undefined };

type Bar = NotPartial<Foo>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a qualified name',
      code: `
namespace Quux {
  export type Partial = string;
}

type Bar = Quux.Partial;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With no type argument',
      code: `
type Foo = { quux?: string | undefined };

type Bar = Partial;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Required<T>` with an index signature and some optional property',
      code: `
type Foo = { [k: string]: string | undefined; fnord?: string };

type Bar = Required<Foo>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Partial<T>` with an index signature and some required property',
      code: `
type Foo = { [k: string]: string | undefined; fnord: string };

type Bar = Partial<Foo>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Required<T>` with a reference to a type with several signatures (type union)',
      code: `
interface Foo {
  quux: string | undefined;
  bar: number;
}

interface Bar {
  fnord?: number;
}

type Baz = Required<Foo | Bar>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Required<T>` with a reference to a type with several signatures (and an intersecting property)',
      code: `
interface Foo {
  quux: string | undefined;
  bar: number;
}

interface Bar {
  quux?: number;
}

type Baz = Required<Foo | Bar>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Partial<T>` with a reference to a type with several signatures (type union)',
      code: `
interface Foo {
  quux: string | undefined;
  bar: number;
}

interface Bar {
  fnord?: number;
}

type Baz = Partial<Foo | Bar>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Partial<T>` with a reference to a type with several signatures (and an intersecting property)',
      code: `
interface Foo {
  quux: string | undefined;
  bar: number;
}

interface Bar {
  quux?: number;
}

type Baz = Partial<Foo | Bar>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Required<T>` with a reference to a type with several signatures (type intersection)',
      code: `
interface Foo {
  quux: string | undefined;
  bar: number;
}

interface Bar {
  fnord?: number;
}

type Baz = Required<Foo & Bar>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Partial<T>` with a reference to a type with several signatures (type intersection)',
      code: `
interface Foo {
  quux: string | undefined;
  bar: number;
}

interface Bar {
  fnord?: number;
}

type Baz = Partial<Foo & Bar>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Required<T>` in a generic type alias',
      code: `
interface Foo {
  quux: string | undefined;
  bar: number;
}

type Baz<T extends Foo> = Required<T>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Required<T>` in a generic function signature',
      code: `
interface Foo {
  quux: string | undefined;
  bar: number;
}

function foo<T extends Foo>(obj: T): Required<T> {
  return obj;
}

const zoz = { baz: 42, quux: '' };
export const fnord = foo(zoz);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Partial<T>` in a generic type alias',
      code: `
interface Foo {
  quux?: string | undefined;
  bar?: number;
}

type Baz<T extends Foo> = Partial<T>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Partial<T>` in a generic function signature',
      code: `
interface Foo {
  quux?: string | undefined;
  bar?: number;
}

function foo<T extends Foo>(obj: T): Partial<T> {
  return obj;
}

const zoz = { baz: 42, quux: '' };
export const fnord = foo(zoz);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Partial<T>` where `T` contains a type parameter',
      code: `
interface Foo {
  quux?: string | undefined;
  bar?: number;
}

type Options<T extends Foo> = T & {
  baz?: Foo;
};

type Baz<T extends Foo> = Partial<Options<T> | never>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `Required<T>` in simple type alias',
      code: `
type Baz<T> = Required<T>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `Partial<T>` in simple type alias',
      code: `
type Baz<T> = Partial<T>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `Partial<Record<T, U>>`',
      code: `
type Baz<T> = Partial<Record<'foo' | 'bar', T>>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `Partial<T>` in type alias',
      code: `
type Foo<T> = T;
type Baz<T> = Partial<Foo<T>>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Required<T>` with more than one type param',
      code: `
type Foo = { quux: string | undefined };

type Bar = Required<Foo, Quux>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Partial<T>` with more than one type param',
      code: `
type Foo = { quux: string | undefined };

type Bar = Partial<Foo, Quux>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `Partial<Required>`',
      code: `
type Baz<T> = Partial<Required>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `Partial<Partial>`',
      code: `
type Baz<T> = Partial<Partial>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `Required<Partial>`',
      code: `
type Baz<T> = Required<Partial>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `Required<Required>`',
      code: `
type Baz<T> = Required<Required>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `Partial<Record<T[number], string>>`',
      code: `
function fun<T extends readonly string[]>(arr: T) {
  const result: Partial<Record<T[number], string>> = {};
  return result;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `Partial<Record<string, T>>`',
      code: `
type Baz<T> = Partial<Record<string, T>>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Required<T>` with a mapped type',
      code: `
type Foo = { [k in 'foo' | 'bar']?: string | undefined };

type Bar = Required<Foo>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Partial<T>` with a mapped type',
      code: `
type Foo = { [k in 'foo' | 'bar']: string | undefined };

type Bar = Partial<Foo>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Partial<T>` with a mapped type with a generic type parameter',
      code: `
type Baz<T> = Partial<{ [K in keyof T]: Array<T[K]> }>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Required<T>` with a mapped type with a generic type parameter',
      code: `
type Baz<T> = Required<{ [K in keyof T]?: Array<T[K]> }>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Required<T>` with a union type',
      code: `
type Baz = Required<Record<string | string> | Record<string | number>>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Partial<T>` with a union type',
      code: `
type Baz = Required<{ foo?: string } | { fnord?: number }>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Required<T>` with `Pick<T>`',
      code: `
type Foo = { quux?: number };
type Bar = Pick<Foo, 'quux'>;
type Baz = Required<Bar>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Partial<T>` with `Pick<T>`',
      code: `
type Foo = { quux: number };
type Bar = Pick<Foo, 'quux'>;
type Baz = Partial<Bar>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Required<T>` with union containing type parameter',
      code: `
type Foo<T> = Required<T | { x: number }>;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Readonly wrapping Required',
      code: `
type Foo<T> = Readonly<Required<T>>;
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: '`Required<T>` with a reference to a type with no optional property #docs',
      code: `
type Foo = { quux: string | undefined };

type Bar = Required<Foo>;
`,
      errors: [
        {
          messageId: 'uselessRequired',
          suggestions: [
            {
              messageId: 'removeRequired',
              output: `
type Foo = { quux: string | undefined };

type Bar = Foo;
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
      name: '`Required<T>` with a type literal with no optional property',
      code: `
type Foo = Required<{ quux: string | undefined }>;
`,
      errors: [
        {
          messageId: 'uselessRequired',
          suggestions: [
            {
              messageId: 'removeRequired',
              output: `
type Foo = { quux: string | undefined };
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
      name: '`Partial<T>` with a reference to a type with no required property',
      code: `
type Foo = { quux?: string | undefined; bar?: number };

type Bar = Partial<Foo>;
`,
      errors: [
        {
          messageId: 'uselessPartial',
          suggestions: [
            {
              messageId: 'removePartial',
              output: `
type Foo = { quux?: string | undefined; bar?: number };

type Bar = Foo;
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
      name: '`Partial<T>` with a type literal with no required property #docs',
      code: `
type Foo = Partial<{ quux?: string | undefined }>;
`,
      errors: [
        {
          messageId: 'uselessPartial',
          suggestions: [
            {
              messageId: 'removePartial',
              output: `
type Foo = { quux?: string | undefined };
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
      name: '`Required<T>` with an index signature',
      code: `
type Foo = { [k: string]: string | undefined };

type Bar = Required<Foo>;
`,
      errors: [
        {
          messageId: 'uselessRequiredWithIndexSignature',
          suggestions: [
            {
              messageId: 'removeRequired',
              output: `
type Foo = { [k: string]: string | undefined };

type Bar = Foo;
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
      name: '`Partial<T>` with an index signature',
      code: `
type Foo = { [k: string]: string | undefined };

type Bar = Partial<Foo>;
`,
      errors: [
        {
          messageId: 'uselessPartialWithIndexSignature',
          suggestions: [
            {
              messageId: 'removePartial',
              output: `
type Foo = { [k: string]: string | undefined };

type Bar = Foo;
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
      name: '`Required<T>` with an index signature and some required property',
      code: `
type Foo = { [k: string]: string | undefined; fnord: string };

type Bar = Required<Foo>;
`,
      errors: [
        {
          messageId: 'uselessRequiredWithIndexSignature',
          suggestions: [
            {
              messageId: 'removeRequired',
              output: `
type Foo = { [k: string]: string | undefined; fnord: string };

type Bar = Foo;
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
      name: '`Partial<T>` with an index signature and some optional property',
      code: `
type Foo = { [k: string]: string | undefined; fnord?: string };

type Bar = Partial<Foo>;
`,
      errors: [
        {
          messageId: 'uselessPartialWithIndexSignature',
          suggestions: [
            {
              messageId: 'removePartial',
              output: `
type Foo = { [k: string]: string | undefined; fnord?: string };

type Bar = Foo;
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
      name: '`Required<T>` with a mapped type',
      code: `
type Foo = { [k in 'foo' | 'bar']: string | undefined };

type Bar = Required<Foo>;
`,
      errors: [
        {
          messageId: 'uselessRequired',
          suggestions: [
            {
              messageId: 'removeRequired',
              output: `
type Foo = { [k in 'foo' | 'bar']: string | undefined };

type Bar = Foo;
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
      name: '`Partial<T>` with a mapped type',
      code: `
type Foo = { [k in 'foo' | 'bar']?: string | undefined };

type Bar = Partial<Foo>;
`,
      errors: [
        {
          messageId: 'uselessPartial',
          suggestions: [
            {
              messageId: 'removePartial',
              output: `
type Foo = { [k in 'foo' | 'bar']?: string | undefined };

type Bar = Foo;
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
      name: '`Partial<T>` in a generic context but `T` contains no type parameter',
      code: `
interface Foo {
  quux?: string | undefined;
  bar?: number;
}

type Options<T extends Foo> = T & {
  baz?: Foo;
};

type Baz<T extends Foo> = Partial<{ fnord?: string }> & Options<T>;
`,
      errors: [
        {
          messageId: 'uselessPartial',
          suggestions: [
            {
              messageId: 'removePartial',
              output: `
interface Foo {
  quux?: string | undefined;
  bar?: number;
}

type Options<T extends Foo> = T & {
  baz?: Foo;
};

type Baz<T extends Foo> = { fnord?: string } & Options<T>;
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
      name: 'With `Required<Record<string, T>>`',
      code: `
type Baz<T> = Required<Record<string, T>>;
`,
      errors: [
        {
          messageId: 'uselessRequiredWithIndexSignature',
          suggestions: [
            {
              messageId: 'removeRequired',
              output: `
type Baz<T> = Record<string, T>;
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
      name: 'With `Required<Record<T[number], string>>`',
      code: `
function fun<T extends readonly string[]>(arr: T) {
  const result: Required<Record<T[number], string>> = {};
  return result;
}
`,
      errors: [
        {
          messageId: 'uselessRequired',
          suggestions: [
            {
              messageId: 'removeRequired',
              output: `
function fun<T extends readonly string[]>(arr: T) {
  const result: Record<T[number], string> = {};
  return result;
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
      name: 'With `Required<Record<T, U>>`',
      code: `
type Baz<T> = Required<Record<'foo' | 'bar', T>>;
`,
      errors: [
        {
          messageId: 'uselessRequired',
          suggestions: [
            {
              messageId: 'removeRequired',
              output: `
type Baz<T> = Record<'foo' | 'bar', T>;
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
      name: 'With `Partial<Required<T>>`',
      code: `
type Baz<T> = Partial<Required<T>>;
`,
      errors: [
        {
          messageId: 'noPartialRequired',
          suggestions: [
            {
              messageId: 'removeRequired',
              output: `
type Baz<T> = Partial<T>;
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
      name: 'With `Partial<Required<T>>` where `T` has no optional properties',
      code: `
type Baz = Partial<Required<{ foo: string }>>;
`,
      errors: [
        {
          messageId: 'noPartialRequired',
          suggestions: [
            {
              messageId: 'removeRequired',
              output: `
type Baz = Partial<{ foo: string }>;
`,
            },
          ],
        },
        {
          messageId: 'uselessRequired',
          suggestions: [
            {
              messageId: 'removeRequired',
              output: `
type Baz = Partial<{ foo: string }>;
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
      name: 'With `Partial<Required<T>>` where `T` has some optional properties',
      code: `
type Baz = Partial<Required<{ foo?: string }>>;
`,
      errors: [
        {
          messageId: 'noPartialRequired',
          suggestions: [
            {
              messageId: 'removeRequired',
              output: `
type Baz = Partial<{ foo?: string }>;
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
      name: 'With `Partial<Partial<T>>`',
      code: `
type Baz<T> = Partial<Partial<T>>;
`,
      errors: [
        {
          messageId: 'uselessPartial',
          suggestions: [
            {
              messageId: 'removePartial',
              output: `
type Baz<T> = Partial<T>;
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
      name: 'With `Partial<Partial<T>>` where `T` has no required properties',
      code: `
type Baz = Partial<Partial<{ foo?: string }>>;
`,
      errors: [
        {
          messageId: 'uselessPartial',
          suggestions: [
            {
              messageId: 'removePartial',
              output: `
type Baz = Partial<{ foo?: string }>;
`,
            },
          ],
        },
        {
          messageId: 'uselessPartial',
          suggestions: [
            {
              messageId: 'removePartial',
              output: `
type Baz = Partial<{ foo?: string }>;
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
      name: 'With `Required<Partial<T>>`',
      code: `
type Baz<T> = Required<Partial<T>>;
`,
      errors: [
        {
          messageId: 'noRequiredPartial',
          suggestions: [
            {
              messageId: 'removePartial',
              output: `
type Baz<T> = Required<T>;
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
      name: 'With `Required<Partial<T>>` where `T` has no required properties',
      code: `
type Baz = Required<Partial<{ foo?: string }>>;
`,
      errors: [
        {
          messageId: 'noRequiredPartial',
          suggestions: [
            {
              messageId: 'removePartial',
              output: `
type Baz = Required<{ foo?: string }>;
`,
            },
          ],
        },
        {
          messageId: 'uselessPartial',
          suggestions: [
            {
              messageId: 'removePartial',
              output: `
type Baz = Required<{ foo?: string }>;
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
      name: 'With `Required<Required<T>>`',
      code: `
type Baz<T> = Required<Required<T>>;
`,
      errors: [
        {
          messageId: 'uselessRequired',
          suggestions: [
            {
              messageId: 'removeRequired',
              output: `
type Baz<T> = Required<T>;
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
      name: 'With `Required<Required<T>>` where `T` has no optional properties',
      code: `
type Baz = Required<Required<{ foo: string }>>;
`,
      errors: [
        {
          messageId: 'uselessRequired',
          suggestions: [
            {
              messageId: 'removeRequired',
              output: `
type Baz = Required<{ foo: string }>;
`,
            },
          ],
        },
        {
          messageId: 'uselessRequired',
          suggestions: [
            {
              messageId: 'removeRequired',
              output: `
type Baz = Required<{ foo: string }>;
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
      name: 'With qualified type name (namespace)',
      code: `
namespace Foo {
  export type Bar = { x: number };
}
type Baz = Required<Foo.Bar>;
`,
      errors: [
        {
          messageId: 'uselessRequired',
          suggestions: [
            {
              messageId: 'removeRequired',
              output: `
namespace Foo {
  export type Bar = { x: number };
}
type Baz = Foo.Bar;
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
      name: '`Required<T>` with `Pick<T>`',
      code: `
type Foo = { quux: number };
type Bar = Pick<Foo, 'quux'>;
type Baz = Required<Bar>;
`,
      errors: [
        {
          messageId: 'uselessRequired',
          suggestions: [
            {
              messageId: 'removeRequired',
              output: `
type Foo = { quux: number };
type Bar = Pick<Foo, 'quux'>;
type Baz = Bar;
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
      name: '`Partial<T>` with `Pick<T>`',
      code: `
type Foo = { quux?: number };
type Bar = Pick<Foo, 'quux'>;
type Baz = Partial<Bar>;
`,
      errors: [
        {
          messageId: 'uselessPartial',
          suggestions: [
            {
              messageId: 'removePartial',
              output: `
type Foo = { quux?: number };
type Bar = Pick<Foo, 'quux'>;
type Baz = Bar;
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
      name: '`Required<T>` with a primitive type',
      code: `
type Foo = Required<string>;
`,
      errors: [
        {
          messageId: 'uselessRequired',
          suggestions: [
            {
              messageId: 'removeRequired',
              output: `
type Foo = string;
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
      name: '`Partial<T>` with a primitive type',
      code: `
type Foo = Partial<string>;
`,
      errors: [
        {
          messageId: 'uselessPartial',
          suggestions: [
            {
              messageId: 'removePartial',
              output: `
type Foo = string;
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
