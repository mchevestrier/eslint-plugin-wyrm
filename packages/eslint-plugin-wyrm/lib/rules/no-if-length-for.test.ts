import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-if-length-for.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: '`for..of` loop with no condition #docs',
      code: `
for (const x of arr) {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`for..of` loop with other statements inside the consequent block',
      code: `
if (arr.length) {
  for (const x of arr) {
  }

  console.log('ok');
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`for..of` loop with alternate block',
      code: `
if (arr.length) {
  for (const x of arr) {
  }
} else {
  console.log('no');
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With optional property access (truthiness check)',
      code: `
if (arr?.length) {
  for (const x of arr) {
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With optional property access (equality)',
      code: `
if (arr?.length !== 0) {
  for (const x of arr) {
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `for...in` loop',
      code: `
if (arr.length !== 0) {
  for (const x in arr) {
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `> 1`',
      code: `
if (arr.length > 1) {
  for (const x of arr) {
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `>= 0`',
      code: `
if (arr.length >= 0) {
  for (const x of arr) {
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Identifiers are different',
      code: `
if (foo.length > 0) {
  for (const x of bar) {
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Identifiers are different (with `forEach`)',
      code: `
if (foo.length > 0) {
  bar.forEach((x) => {});
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Object inside loop is not an identifier',
      code: `
if (foo.length > 0) {
  [].forEach((x) => {});
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Right side of for loop is not an identifier',
      code: `
if (foo.length > 0) {
  for (const x of []) {
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Property is not an identifier',
      code: `
if (arr['length'] > 0) {
  for (const x of arr) {
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Property is not length',
      code: `
if (arr.foo > 0) {
  for (const x of arr) {
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Object is not an identifier',
      code: `
if ([].length > 0) {
  for (const x of []) {
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Statement is not a loop',
      code: `
if (arr.length > 0) {
  debugger;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Expression statement but not a call expression',
      code: `
if (arr.length > 0) {
  42;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Statement is a simple call expression',
      code: `
if (arr.length > 0) {
  foo();
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Member expression but not a `forEach` loop',
      code: `
if (arr.length > 0) {
  arr.at(0);
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Method is not an identifier',
      code: `
if (arr.length > 0) {
  arr['forEach']((x) => {});
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: '`for..of` loop with array length truthiness check #docs',
      code: `
if (arr.length) {
  for (const x of arr) {
  }
}
`,
      output: `
for (const x of arr) {
  }
`,
      errors: [{ messageId: 'noIfLengthFor' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`for..of` loop with inline if',
      code: `
if (arr.length)
  for (const x of arr) {
  }
`,
      output: `
for (const x of arr) {
  }
`,
      errors: [{ messageId: 'noIfLengthFor' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `> 0` #docs',
      code: `
if (arr.length > 0) {
  for (const x of arr) {
  }
}
`,
      output: `
for (const x of arr) {
  }
`,
      errors: [{ messageId: 'noIfLengthFor' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `0 <`',
      code: `
if (0 < arr.length) {
  for (const x of arr) {
  }
}
`,
      output: `
for (const x of arr) {
  }
`,
      errors: [{ messageId: 'noIfLengthFor' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `!== 0` #docs',
      code: `
if (arr.length !== 0) {
  for (const x of arr) {
  }
}
`,
      output: `
for (const x of arr) {
  }
`,
      errors: [{ messageId: 'noIfLengthFor' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `0 !=`',
      code: `
if (0 != arr.length) {
  for (const x of arr) {
  }
}
`,
      output: `
for (const x of arr) {
  }
`,
      errors: [{ messageId: 'noIfLengthFor' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `forEach`',
      code: `
if (0 != arr.length) {
  arr.forEach((x) => {});
}
`,
      output: `
arr.forEach((x) => {});
`,
      errors: [{ messageId: 'noIfLengthFor' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
