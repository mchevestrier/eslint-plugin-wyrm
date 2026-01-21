import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-self-object-assign.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'With different identifiers #docs',
      code: `
const obj1 = {};
const obj2 = {};
Object.assign(obj1, obj2);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With several sources',
      code: `
const obj1 = {};
const obj2 = {};
const obj3 = {};
Object.assign(obj1, obj2, obj3);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With no arguments',
      code: `
Object.assign();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Call expression callee is not a member expression',
      code: `
assign(obj, obj);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Object is not an identifier',
      code: `
(1 ? Object : Foo).assign(obj, obj);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Property is not an identifier',
      code: `
Object['assign'](obj, obj);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not `Object`',
      code: `
Foo.assign(obj, obj);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not `assign`',
      code: `
Object.foo(obj, obj);
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: '`Object.assign()` to self #docs',
      code: `
const obj = {};
Object.assign(obj, obj);
`,
      errors: [
        {
          messageId: 'noSelfObjectAssign',
          column: 20,
          endColumn: 23,
          line: 3,
          endLine: 3,
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With several sources',
      code: `
const obj1 = {};
const obj2 = {};
Object.assign(obj1, obj2, obj1);
`,
      errors: [
        {
          messageId: 'noSelfObjectAssign',
          column: 27,
          endColumn: 31,
          line: 4,
          endLine: 4,
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With the target used several times in sources',
      code: `
const obj1 = {};
const obj2 = {};
Object.assign(obj1, obj2, obj1, obj1);
`,
      errors: [
        {
          messageId: 'noDuplicateSources',
          column: 33,
          endColumn: 37,
          line: 4,
          endLine: 4,
        },
        {
          messageId: 'noSelfObjectAssign',
          column: 33,
          endColumn: 37,
          line: 4,
          endLine: 4,
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With duplicate sources',
      code: `
const obj1 = {};
const obj2 = {};
Object.assign(obj1, obj2, obj2);
`,
      errors: [
        {
          messageId: 'noDuplicateSources',
          column: 27,
          endColumn: 31,
          line: 4,
          endLine: 4,
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With duplicate sources and a literal target',
      code: `
const obj1 = {};
const obj2 = {};
const _ = Object.assign({}, obj1, obj2, obj2);
`,
      errors: [
        {
          messageId: 'noDuplicateSources',
          column: 41,
          endColumn: 45,
          line: 4,
          endLine: 4,
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With several duplicate sources',
      code: `
const obj1 = {};
const obj2 = {};
const obj3 = {};
const obj4 = {};
Object.assign(obj1, obj2, obj3, obj2, obj2, obj4, obj3);
`,
      errors: [
        {
          messageId: 'noDuplicateSources',
          column: 33,
          endColumn: 37,
          line: 6,
          endLine: 6,
        },
        {
          messageId: 'noDuplicateSources',
          column: 39,
          endColumn: 43,
          line: 6,
          endLine: 6,
        },
        {
          messageId: 'noDuplicateSources',
          column: 51,
          endColumn: 55,
          line: 6,
          endLine: 6,
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
