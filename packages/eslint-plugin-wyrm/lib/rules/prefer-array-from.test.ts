import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './prefer-array-from.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Using `Array.from` #docs',
      code: `
function foo(strings: Iterator<string>) {
  let res = Array.from(strings);
  return res;
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Iterative accumulation #docs',
      code: `
function foo(strings: Iterator<string>) {
  const arr = [];
  for (const str of strings) {
    arr.push(str);
  }
  return arr;
}
`,
      output: `
function foo(strings: Iterator<string>) {
  const arr = Array.from(strings);
  
  return arr;
}
`,
      errors: [{ messageId: 'preferArrayFrom', data: { func: 'Array.from' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Async iterative accumulation #docs',
      code: `
function foo(strings: AsyncIterator<string>) {
  const arr = [];
  for await (const str of strings) {
    arr.push(str);
  }
  return arr;
}
`,
      output: `
function foo(strings: AsyncIterator<string>) {
  const arr = Array.fromAsync(strings);
  
  return arr;
}
`,
      errors: [{ messageId: 'preferArrayFrom', data: { func: 'Array.fromAsync' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a non empty initial array #docs',
      code: `
function foo(strings: Iterator<string>) {
  const arr = ['foo', 'bar'];
  for (const str of strings) {
    arr.push(str);
  }
  return arr;
}
`,
      output: `
function foo(strings: Iterator<string>) {
  const arr = ['foo', 'bar'].concat(Array.from(strings));
  
  return arr;
}
`,
      errors: [{ messageId: 'preferArrayFrom', data: { func: 'Array.from' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `for` loop with no block body',
      code: `
function foo(strings: Iterator<string>) {
  const arr = [];
  for (const str of strings) arr.push(str);
  return arr;
}
`,
      output: `
function foo(strings: Iterator<string>) {
  const arr = Array.from(strings);
  
  return arr;
}
`,
      errors: [{ messageId: 'preferArrayFrom', data: { func: 'Array.from' } }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
