import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './prefer-repeat.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Using `String.prototype.repeat` #docs',
      code: `
const x = '*'.repeat(3);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Array method is not an identifier',
      code: `
const x = Array['from']({ length: 3 }).reduce((acc) => \`\${acc}*\`, '');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`from` method not called on `Array`',
      code: `
const x = obj.from({ length: 3 }).reduce((acc) => \`\${acc}*\`, '');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`from` method not called on an identifier',
      code: `
const x = (1 ? Array : obj).from({ length: 3 }).reduce((acc) => \`\${acc}*\`, '');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Other array method called',
      code: `
const x = Array.of({ length: 3 }).reduce((acc) => \`\${acc}*\`, '');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Array.from` not called with an explicit length',
      code: `
const x = Array.from([1, 2, 3]).reduce((acc) => \`\${acc}*\`, '');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Array.from` called with an object literal without a length',
      code: `
const x = Array.from({}).reduce((acc) => \`\${acc}*\`, '');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`fill` method not called on call expression',
      code: `
foo.fill().reduce((acc) => \`\${acc}*\`, '');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`fill` method not called on instantiated array',
      code: `
Error()
  .fill()
  .reduce((acc) => \`\${acc}*\`, '');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`reduce` not called on call expression',
      code: `
const x = foo.reduce((acc) => \`\${acc}*\`, '');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`reduce` not called on called member expression',
      code: `
const x = foo().reduce((acc) => \`\${acc}*\`, '');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`reduce` called with no argument',
      code: `
const x = Array(3).fill().reduce();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`reduce` called with an identifier',
      code: `
const x = Array(3).fill().reduce(fn);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`reduce` callback does not accumulate anything',
      code: `
const x = Array(3)
  .fill()
  .reduce(() => 2, 0);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`reduce` callback does not return a string',
      code: `
const x = Array(3)
  .fill()
  .reduce((acc, n) => acc + n, 0);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`reduce` template literal does not repeat a literal string',
      code: `
const x = Array(3)
  .fill()
  .reduce((acc, n) => \`\${str}\${acc}\${str}\`, '');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`reduce` template literal only includes the accumulator parameter',
      code: `
const x = Array(3)
  .fill()
  .reduce((acc, n) => \`\${acc}\`, '');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`reduce` template literal repeats two different literal strings',
      code: `
const x = Array(3)
  .fill()
  .reduce((acc, n) => \`*\${acc}x\`, '');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`reduce` template literal does not accumulate',
      code: `
const x = Array(3)
  .fill()
  .reduce((acc, n) => \`\${str}*\`, '');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`reduce` template literal first expression is not an identifier',
      code: `
const x = Array(3)
  .fill()
  .reduce((acc, n) => \`\${foo()}*\`, '');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`reduce` returned call expression is not a member expression',
      code: `
const x = Array(3)
  .fill()
  .reduce((acc) => foo(acc), '');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`reduce` returns a method call but the method is not an identifier',
      code: `
const x = Array(3)
  .fill()
  .reduce((acc) => acc['concat']('*'), '');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`reduce` returns a method call but the method is not `concat`',
      code: `
const x = Array(3)
  .fill()
  .reduce((acc) => acc.padStart('*'), '');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`reduce` returns a `concat` method call but the object an identifier',
      code: `
const x = Array(3)
  .fill()
  .reduce((acc) => (1 ? acc : foo).concat('*'), '');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`reduce` returns a `concat` method call but the object is not the accumulator param',
      code: `
const x = Array(3)
  .fill()
  .reduce((acc) => foo.concat('*'), '');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`reduce` callback first argument is destructured',
      code: `
const x = Array(3)
  .fill()
  .reduce(({ length }, n) => length * n, 0);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`reduce` callback has no return statement',
      code: `
const x = Array(3)
  .fill()
  .reduce((acc, n) => {
    console.log(acc);
  }, 0);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`reduce` callback has an empty return',
      code: `
const x = Array(3)
  .fill()
  .reduce((acc, n) => {
    console.log(acc);
    return;
  }, 0);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not using `reduce` or `reduceRight`',
      code: `
const x = Array.from({ length: 3 }).map((acc) => \`\${acc}*\`, '');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not using `length`',
      code: `
const x = Array.from({ foo: 3 }).reduce((acc) => \`\${acc}*\`, '');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not using `fill`',
      code: `
const x = Array(3)
  .foo(undefined)
  .reduce((acc) => \`\${acc}*\`, '');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With several expressions in template',
      code: `
const x = Array.from({ length: 3 }).reduce((acc) => \`\${acc}*\${acc}*\`, '');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With no expressions in template',
      code: `
const x = Array.from({ length: 3 }).reduce((acc) => \`\`, '');
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Not using `String.prototype.repeat` #docs Array.from with reduce and suffix template expression',
      code: `
const x = Array.from({ length: 3 }).reduce((acc) => \`\${acc}*\`, '');
`,
      errors: [
        {
          messageId: 'preferRepeat',
          suggestions: [
            {
              messageId: 'replaceByRepeat',
              data: { fixed: "'*'.repeat(3)" },
              output: `
const x = '*'.repeat(3);
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
      name: 'Array.from with `reduce` and prefix template expression',
      code: `
const x = Array.from({ length: 3 }).reduce((acc) => \`*\${acc}\`, '');
`,
      errors: [
        {
          messageId: 'preferRepeat',
          suggestions: [
            {
              messageId: 'replaceByRepeat',
              data: { fixed: "'*'.repeat(3)" },
              output: `
const x = '*'.repeat(3);
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
      name: 'Array.from with `reduceRight` and prefix template expression',
      code: `
const x = Array.from({ length: 3 }).reduceRight((acc) => \`*\${acc}\`, '');
`,
      errors: [
        {
          messageId: 'preferRepeat',
          suggestions: [
            {
              messageId: 'replaceByRepeat',
              data: { fixed: "'*'.repeat(3)" },
              output: `
const x = '*'.repeat(3);
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
      name: 'Array.from with reduce and `String.prototype.concat`',
      code: `
const x = Array.from({ length: 3 }).reduce((acc) => acc.concat('*'), '');
`,
      errors: [
        {
          messageId: 'preferRepeat',
          suggestions: [
            {
              messageId: 'replaceByRepeat',
              data: { fixed: "'*'.repeat(3)" },
              output: `
const x = '*'.repeat(3);
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
      // eslint-disable-next-line internal/no-test-skip
      skip: true,
      name: '`Array().fill()` with `reduce` and `+`',
      code: `
const x = Array(3)
  .fill()
  .reduce((acc, _) => acc + '*', '');
`,
      errors: [
        {
          messageId: 'preferRepeat',
          suggestions: [
            {
              messageId: 'replaceByRepeat',
              data: { fixed: "'*'.repeat(3)" },
              output: `
const x = '*'.repeat(3);
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
      name: '`reduce` template literal repeats the same literal string twice',
      code: `
const x = Array(3)
  .fill()
  .reduce((acc, n) => \`*\${acc}*\`, '');
`,
      errors: [
        {
          messageId: 'preferRepeat',
          suggestions: [
            {
              messageId: 'replaceByRepeat',
              data: { fixed: "'**'.repeat(3)" },
              output: `
const x = '**'.repeat(3);
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
      name: 'With array constructor',
      code: `
const x = Array(3)
  .fill(undefined)
  .reduce((acc) => \`\${acc}*\`, '');
`,
      errors: [
        {
          messageId: 'preferRepeat',
          suggestions: [
            {
              messageId: 'replaceByRepeat',
              data: { fixed: "'*'.repeat(3)" },
              output: `
const x = '*'.repeat(3);
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
      name: 'With array constructor (new expression)',
      code: `
const x = new Array(3).fill(undefined).reduce((acc) => \`\${acc}*\`, '');
`,
      errors: [
        {
          messageId: 'preferRepeat',
          suggestions: [
            {
              messageId: 'replaceByRepeat',
              data: { fixed: "'*'.repeat(3)" },
              output: `
const x = '*'.repeat(3);
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
      name: 'With generic type argument',
      code: `
const x = Array.from({ length: 3 }).reduce<string>((acc) => \`\${acc}*\`, '');
`,
      errors: [
        {
          messageId: 'preferRepeat',
          suggestions: [
            {
              messageId: 'replaceByRepeat',
              data: { fixed: "'*'.repeat(3)" },
              output: `
const x = '*'.repeat(3);
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
      name: 'With accumulator parameter type annotation',
      code: `
const x = Array.from({ length: 3 }).reduce((acc: string) => acc.concat('&'), '');
`,
      errors: [
        {
          messageId: 'preferRepeat',
          suggestions: [
            {
              messageId: 'replaceByRepeat',
              data: { fixed: "'&'.repeat(3)" },
              output: `
const x = '&'.repeat(3);
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
      name: 'With return statement in `reduce` callback',
      code: `
const x = Array.from({ length: 3 }).reduce((acc: string) => {
  return acc.concat('&');
}, '');
`,
      errors: [
        {
          messageId: 'preferRepeat',
          suggestions: [
            {
              messageId: 'replaceByRepeat',
              data: { fixed: "'&'.repeat(3)" },
              output: `
const x = '&'.repeat(3);
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
      name: 'Inside a one-parameter function',
      code: `
function repeat(n: number) {
  return Array.from({ length: n }).reduce<string>((acc) => \`\${acc}Uw\`, '');
}
`,
      errors: [
        {
          messageId: 'preferRepeat',
          suggestions: [
            {
              messageId: 'replaceByRepeat',
              data: { fixed: "'Uw'.repeat(n)" },
              output: `
function repeat(n: number) {
  return 'Uw'.repeat(n);
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
      name: 'Inside a two-parameter function',
      code: `
function repeat(str: string, n: number) {
  return Array.from({ length: n }).reduce<string>((acc) => \`\${acc}\${str}\`, '');
}
`,
      errors: [
        {
          messageId: 'preferRepeat',
          suggestions: [
            {
              messageId: 'replaceByRepeat',
              data: { fixed: 'str.repeat(n)' },
              output: `
function repeat(str: string, n: number) {
  return str.repeat(n);
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
const x = Array.from({ length: 3 }).reduce(function (acc) {
  return \`\${acc}*\`;
}, '');
`,
      errors: [
        {
          messageId: 'preferRepeat',
          suggestions: [
            {
              messageId: 'replaceByRepeat',
              data: { fixed: "'*'.repeat(3)" },
              output: `
const x = '*'.repeat(3);
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
