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
    {
      name: 'Iterative accumulation with other statements',
      code: `
function foo(strings: Iterator<string>) {
  const arr = [];
  for (const str of strings) {
    console.log(str);
    arr.push(str);
  }
  return arr;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Iteration without accumulation',
      code: `
function foo(strings: Iterator<string>) {
  const arr = [];
  for (const str of strings) {
    console.log(str);
    arr.push('ok');
  }
  return arr;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a statement between the declaration and the `for` loop',
      code: `
function foo(strings: Iterator<string>) {
  const arr = [];
  const items = strings.filter((str) => str === 'quux');
  for (const str of strings) {
    arr.push(str);
  }
  console.log(items);
  return arr;
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
    {
      name: 'Pushed element is not a simple identifier #docs',
      code: `
function foo(numbers: Iterator<number>) {
  const arr = [];
  for (const n of numbers) {
    arr.push(n + 2);
  }
  return arr;
}
`,
      output: `
function foo(numbers: Iterator<number>) {
  const arr = Array.from(numbers, (n) => (n + 2));
  
  return arr;
}
`,
      errors: [{ messageId: 'preferArrayFrom', data: { func: 'Array.from' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Pushed element is an object literal',
      code: `
function foo(numbers: Iterator<number>) {
  const arr = [];
  for (const n of numbers) {
    arr.push({ n });
  }
  return arr;
}
`,
      output: `
function foo(numbers: Iterator<number>) {
  const arr = Array.from(numbers, (n) => ({ n }));
  
  return arr;
}
`,
      errors: [{ messageId: 'preferArrayFrom', data: { func: 'Array.from' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With left side destructuring',
      code: `
function foo(numbers: Iterator<number>) {
  const arr = [];
  for (const [n, i] of numbers.entries()) {
    arr.push(n + i);
  }
  return arr;
}
`,
      output: `
function foo(numbers: Iterator<number>) {
  const arr = Array.from(numbers.entries(), ([n, i]) => (n + i));
  
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
