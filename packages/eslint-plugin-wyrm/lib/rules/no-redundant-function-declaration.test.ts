import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-redundant-function-declaration.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Normal function declaration #docs',
      code: `
function foo() {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Variable declaration initialized with unnamed function expression',
      code: `
const foo = function () {};
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Named function expression but not in a variable declaration',
      code: `
baz(function foo() {});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant function declaration with `let` binding',
      code: `
let foo = function bar() {};
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant function declaration with `var` binding',
      code: `
var foo = function bar() {};
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Redundant function declaration with the same name #docs',
      code: `
const foo = function foo() {};
`,
      output: `
function foo() {}
`,
      errors: [{ messageId: 'noRedundantFunctionDeclaration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant function declaration with different names #docs',
      code: `
const foo = function bar() {};
`,
      output: `
function foo() {}
`,
      errors: [{ messageId: 'noRedundantFunctionDeclaration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Exported redundant function declaration with the same name',
      code: `
export const foo = function foo() {};
`,
      output: `
export function foo() {}
`,
      errors: [{ messageId: 'noRedundantFunctionDeclaration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Exported redundant function declaration with different names',
      code: `
export const foo = function bar() {};
`,
      output: `
export function foo() {}
`,
      errors: [{ messageId: 'noRedundantFunctionDeclaration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant function declaration with default export',
      code: `
const foo = function bar() {};
export default foo;
`,
      output: `
function foo() {}
export default foo;
`,
      errors: [{ messageId: 'noRedundantFunctionDeclaration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant function declaration with multiple declarators (function declaration in first position)',
      code: `
const foo = function bar() {},
  bar = 42;
`,
      output: `
const 
  bar = 42;
function foo() {}
`,
      errors: [{ messageId: 'noRedundantFunctionDeclaration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant function declaration with multiple declarators (function declaration in center position)',
      code: `
const bar = 42,
  foo = function bar() {},
  quux = 105;
`,
      output: `
const bar = 42
  ,
  quux = 105;
function foo() {}
`,
      errors: [{ messageId: 'noRedundantFunctionDeclaration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant function declaration with multiple declarators (function declaration in last position)',
      code: `
const bar = 42,
  foo = function bar() {};
`,
      output: `
const bar = 42
  ;
function foo() {}
`,
      errors: [{ messageId: 'noRedundantFunctionDeclaration' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Redundant function declaration with multiple exported declarators',
      code: `
export const foo = function bar() {},
  bar = 42;
`,
      output: `
export const 
  bar = 42;
export function foo() {}
`,
      errors: [{ messageId: 'noRedundantFunctionDeclaration' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
