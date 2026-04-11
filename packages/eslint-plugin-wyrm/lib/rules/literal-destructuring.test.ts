import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './literal-destructuring.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'With a spread property after fixed properties #docs',
      code: `
const { foo } = { foo: 42, ...obj };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a spread property overwritten by some fixed properties #docs',
      code: `
const { foo, bar } = { ...obj, foo: 42 };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a spread property possibly overwriting some fixed property #docs',
      code: `
const { foo, bar } = { bar: 105, ...obj, foo: 42 };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a useful spread element #docs',
      code: `
const [foo, bar] = [42, ...arr];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a useful spread element and no literal initialization',
      code: `
const [foo, bar] = [...arr];
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a computed property in object pattern',
      code: `
const quux = 'foo';
const { [quux]: fnord } = { foo: 42 };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a computed property in init object literal',
      code: `
const quux = 'foo';
const { foo: fnord } = { [quux]: 42 };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a computed property in object pattern and in init object literal',
      code: `
const quux = 'foo';
const { [quux]: fnord } = { [quux]: 42 };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With nested array destructuring',
      code: `
const [foo, [bar]] = [42, [105]];
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Declaring a variable by destructuring a temporary object literal #docs',
      code: `
const { foo } = { foo: 42 };
`,
      output: `
const foo = 42;
`,
      errors: [{ messageId: 'usePlainDeclaration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Declaring a variable by destructuring a temporary array literal #docs',
      code: `
const [foo] = [42];
`,
      output: `
const foo = 42;
`,
      errors: [{ messageId: 'usePlainDeclaration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Declaring a variable by destructuring an empty array literal',
      code: `
const [foo] = [];
`,
      output: `
const foo = undefined;
`,
      errors: [{ messageId: 'usePlainDeclaration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Declaring several variables by destructuring a temporary object literal',
      code: `
const { foo, bar } = { foo: 42, bar: 105 };
`,
      output: `
const foo = 42, bar = 105;
`,
      errors: [{ messageId: 'usePlainDeclaration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Declaring several variable by destructuring a temporary array literal',
      code: `
const [foo, bar] = [42, 105];
`,
      output: `
const foo = 42, bar = 105;
`,
      errors: [{ messageId: 'usePlainDeclaration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a useless spread property always overwritten by a fixed property',
      code: `
const { foo } = { ...obj, foo: 42 };
`,
      output: [
        `
const { foo } = {  foo: 42 };
`,
        `
const foo = 42;
`,
      ],
      errors: [{ messageId: 'uselessSpreadProperty' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With several useless spread properties always overwritten by a fixed property',
      code: `
const { foo } = { ...obj1, ...obj2, foo: 42 };
`,
      output: [
        `
const { foo } = {  ...obj2, foo: 42 };
`,
        `
const { foo } = {   foo: 42 };
`,
        `
const foo = 42;
`,
      ],
      errors: [{ messageId: 'uselessSpreadProperty' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a useless spread property and a useful one',
      code: `
const { foo } = { ...obj1, foo: 42, ...obj2 };
`,
      output: `
const { foo } = {  foo: 42, ...obj2 };
`,
      errors: [{ messageId: 'uselessSpreadProperty' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a useless spread element that will never be read #docs',
      code: `
const [foo] = [42, ...arr];
`,
      output: [
        `
const [foo] = [42, ];
`,
        `
const foo = 42;
`,
      ],
      errors: [{ messageId: 'uselessSpreadElement' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a useless spread property always overwritten by fixed properties #docs',
      code: `
const { foo, bar } = { ...obj, foo: 42, bar: 105 };
`,
      output: [
        `
const { foo, bar } = {  foo: 42, bar: 105 };
`,
        `
const foo = 42, bar = 105;
`,
      ],
      errors: [{ messageId: 'uselessSpreadProperty' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With several declarators',
      code: `
const { foo } = { foo: 42 },
  bar = 105;
`,
      output: `
const foo = 42,
  bar = 105;
`,
      errors: [{ messageId: 'usePlainDeclaration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With more variables than elements in initialization',
      code: `
const [foo, bar, baz] = [42, 105];
`,
      output: `
const foo = 42, bar = 105, baz = undefined;
`,
      errors: [{ messageId: 'usePlainDeclaration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With nested object destructuring',
      code: `
const {
  foo: { bar },
} = { foo: { bar: 42 } };
`,
      output: `
const foo = { bar: 42 };
`,
      errors: [{ messageId: 'usePlainDeclaration' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
