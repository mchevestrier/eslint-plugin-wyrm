import path from 'node:path';

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-convoluted-boolean-expressions.js';

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
      name: 'Simple boolean XOR #docs',
      code: `
function foo(x: boolean, y: boolean) {
  return x !== y;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Simple boolean OR #docs',
      code: `
function foo(x: boolean, y: boolean) {
  return x || y;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Simple boolean AND #docs',
      code: `
function foo(x: boolean, y: boolean) {
  return x && y;
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Convoluted boolean XOR #docs',
      code: `
function foo(x: boolean, y: boolean) {
  return (x || y) && !(x && y);
}
`,
      output: `
function foo(x: boolean, y: boolean) {
  return x !== y;
}
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Convoluted boolean XOR, with distributed negation #docs',
      code: `
function foo(x: boolean, y: boolean) {
  return (x || y) && (!x || !y);
}
`,
      output: `
function foo(x: boolean, y: boolean) {
  return x !== y;
}
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Convoluted boolean XOR, reversed',
      code: `
function foo(x: boolean, y: boolean) {
  return !(x && y) && (x || y);
}
`,
      output: `
function foo(x: boolean, y: boolean) {
  return x !== y;
}
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Convoluted boolean XOR, left side reversed',
      code: `
function foo(x: boolean, y: boolean) {
  return (y || x) && !(x && y);
}
`,
      output: `
function foo(x: boolean, y: boolean) {
  return y !== x;
}
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Convoluted boolean XOR, right side reversed',
      code: `
function foo(x: boolean, y: boolean) {
  return (x || y) && !(y && x);
}
`,
      output: `
function foo(x: boolean, y: boolean) {
  return x !== y;
}
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Convoluted boolean XOR, both sides reversed',
      code: `
function foo(x: boolean, y: boolean) {
  return (y || x) && !(y && x);
}
`,
      output: `
function foo(x: boolean, y: boolean) {
  return y !== x;
}
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Convoluted boolean OR (XOR || AND) #docs',
      code: `
function foo(x: boolean, y: boolean) {
  return x !== y || (x && y);
}
`,
      output: `
function foo(x: boolean, y: boolean) {
  return x || y;
}
`,
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Convoluted boolean OR #docs',
      code: `
function foo(x: boolean, y: boolean) {
  return ((x || y) && !(x && y)) || (x && y);
}
`,
      output: [
        `
function foo(x: boolean, y: boolean) {
  return (x !== y) || (x && y);
}
`,
        `
function foo(x: boolean, y: boolean) {
  return x || y;
}
`,
      ],
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Convoluted boolean OR, with distributed negation',
      code: `
function foo(x: boolean, y: boolean) {
  return ((x || y) && (!x || !y)) || (x && y);
}
`,
      output: [
        `
function foo(x: boolean, y: boolean) {
  return (x !== y) || (x && y);
}
`,
        `
function foo(x: boolean, y: boolean) {
  return x || y;
}
`,
      ],
      errors: [{ messageId: 'noConvolutedLogicalExpression' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
