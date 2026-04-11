import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './prefer-string-join.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Using `String.prototype.join` #docs',
      code: `
function foo(strings: string[]) {
  let res = strings.join();
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
      name: 'Not using `String.prototype.join` #docs',
      code: `
function foo(strings: string[]) {
  let res = '';
  for (const str of strings) {
    res += str;
  }
  return res;
}
`,
      output: `
function foo(strings: string[]) {
  let res = strings.join();
  
  return res;
}
`,
      errors: [{ messageId: 'preferJoin', data: { fixed: 'strings.join()' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a non empty initial value #docs',
      code: `
function foo(strings: string[]) {
  let res = 'quux';
  for (const str of strings) {
    res += str;
  }
  return res;
}
`,
      output: `
function foo(strings: string[]) {
  let res = 'quux'.concat(strings.join());
  
  return res;
}
`,
      errors: [{ messageId: 'preferJoin', data: { fixed: 'strings.join()' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `for` loop with no block body',
      code: `
function foo(strings: string[]) {
  let res = '';
  for (const str of strings) res += str;
  return res;
}
`,
      output: `
function foo(strings: string[]) {
  let res = strings.join();
  
  return res;
}
`,
      errors: [{ messageId: 'preferJoin', data: { fixed: 'strings.join()' } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      // eslint-disable-next-line internal/no-test-skip
      skip: true,
      name: '`for` loop with a separator',
      code: `
function foo(strings: string[]) {
  let res = '';
  for (let i = 0; i < strings.length; i++) {
    res += strings[i];
    if (i < strings.length - 1) {
      res += '.';
    }
  }
  return res;
}
`,
      output: `
function foo(strings: string[]) {
  let res = strings.join('.');
  
  return res;
}
`,
      errors: [{ messageId: 'preferJoin', data: { fixed: "strings.join('.')" } }],
      after() {
        checkFormatting(this);
      },
    },
    {
      // eslint-disable-next-line internal/no-test-skip
      skip: true,
      name: '`Array.prototype.reduce` loop with a separator',
      code: `
function foo(strings: string[]) {
  return strings.reduce((acc, curr, i) => {
    return acc + (i > 0 ? '.' : '') + curr;
  }, '');
}
`,
      output: `
function foo(strings: string[]) {
  let res = strings.join('.');
  
  return res;
}
`,
      errors: [{ messageId: 'preferJoin', data: { fixed: "strings.join('.')" } }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
