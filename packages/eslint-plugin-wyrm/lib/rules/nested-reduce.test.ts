import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './nested-reduce.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Simple `reduce` call #docs',
      code: `
[1, 2, 3].reduce((acc, cur) => {
  return acc + cur;
}, 0);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Simple `reduce` call inside a function inside another reduce #docs',
      code: `
const total = numbers.reduce((outerAcc, outerCur) => {
  function foo() {
    [1, 2, 3].reduce((acc, cur) => {
      return acc + cur;
    }, 0);
  }

  return outerAcc + outerCur;
}, 0);
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Nested `reduce` call #docs',
      code: `
const total = numbers.reduce((outerAcc, innerArray) => {
  return (
    outerAcc +
    innerArray.reduce((innerAcc, num) => {
      return innerAcc + num;
    }, 0)
  );
}, 0);
`,
      errors: [{ messageId: 'noNestedReduce' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
