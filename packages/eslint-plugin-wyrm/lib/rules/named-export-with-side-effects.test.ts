import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './named-export-with-side-effects.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Named export but no side effect #docs',
      code: `
export const foo = 42;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Side effect but no named export #docs',
      code: `
try {
  await fetch('https://example.com/');
} finally {
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Named export and some statements with no side effect',
      code: `
import baz from './baz.js';

('not a side effect');

export const foo = 42;

('not a side effect');
('not a side effect');

return 105;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an assignment',
      code: `
import baz from './baz.js';

export const foo = 42;

baz = 105;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a call expression (not strict by default)',
      code: `
export const foo = 42;
console.log('foo');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a call expression (strict option explicitly disabled)',
      options: [{ strict: false }],
      code: `
export const foo = 42;
console.log('foo');
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Named export and side effect in the same file #docs',
      code: `
export const foo = 42;

try {
  await fetch('https://example.com/');
} finally {
}
`,
      errors: [{ messageId: 'namedExportWithSideEffects' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Several named exports and side effect in the same file',
      code: `
export const foo = 42;
const bar = 105;
export { bar };

try {
  await fetch('https://example.com/');
} finally {
}
`,
      errors: [{ messageId: 'namedExportWithSideEffects' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Named export and several side effects in the same file',
      code: `
export const foo = 42;

try {
  await fetch('https://example.com/');
} finally {
}

await quux();
`,
      errors: [
        { messageId: 'namedExportWithSideEffects' },
        { messageId: 'namedExportWithSideEffects' },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a call expression (strict option enabled)',
      options: [{ strict: true }],
      code: `
export const foo = 42;
console.log('foo');
`,
      errors: [{ messageId: 'namedExportWithSideEffects' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an `await` expression',
      code: `
export const foo = 42;
await quux;
`,
      errors: [{ messageId: 'namedExportWithSideEffects' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an update expression',
      code: `
export const foo = 42;
quux++;
`,
      errors: [{ messageId: 'namedExportWithSideEffects' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an if statement',
      code: `
export const foo = 42;
if (true) {
  debugger;
  ('not a side effect');
}
`,
      errors: [{ messageId: 'namedExportWithSideEffects' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an if statement (alternate block with no side effects)',
      code: `
export const foo = 42;
if (true) {
  debugger;
  ('not a side effect');
} else {
  ('not a side effect');
}
`,
      errors: [{ messageId: 'namedExportWithSideEffects' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an if statement (side effects in alternate block only)',
      code: `
export const foo = 42;
if (true) {
  //
} else {
  ('not a side effect');
  debugger;
}
`,
      errors: [{ messageId: 'namedExportWithSideEffects' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `break` statement',
      code: `
export const foo = 42;
break;
`,
      errors: [{ messageId: 'namedExportWithSideEffects' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `continue` statement',
      code: `
export const foo = 42;
continue;
`,
      errors: [{ messageId: 'namedExportWithSideEffects' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `debugger` statement',
      code: `
export const foo = 42;
debugger;
`,
      errors: [{ messageId: 'namedExportWithSideEffects' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `switch` statement',
      code: `
export const foo = 42;
switch (true) {
  case true:
  case false:
  default:
  // Do nothing
}
`,
      errors: [{ messageId: 'namedExportWithSideEffects' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `for` loop',
      code: `
export const foo = 42;
for (let i = 0; i < 1; i++) {}
`,
      errors: [{ messageId: 'namedExportWithSideEffects' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `for...in` loop',
      code: `
export const foo = 42;
for (const x in {}) {
}
`,
      errors: [{ messageId: 'namedExportWithSideEffects' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `for...of` loop',
      code: `
export const foo = 42;
for (const x of []) {
}
`,
      errors: [{ messageId: 'namedExportWithSideEffects' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `do...while` loop',
      code: `
export const foo = 42;
do {} while (1);
`,
      errors: [{ messageId: 'namedExportWithSideEffects' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `while` loop',
      code: `
export const foo = 42;
while (1) {}
`,
      errors: [{ messageId: 'namedExportWithSideEffects' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `throw` statement',
      code: `
export const foo = 42;
throw Error('foo');
`,
      errors: [{ messageId: 'namedExportWithSideEffects' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
