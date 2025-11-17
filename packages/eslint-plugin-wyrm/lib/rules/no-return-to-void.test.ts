import path from 'node:path';

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-return-to-void.js';

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
      name: 'With no return from `forEach` callback #docs',
      code: `
[1, 2, 3].forEach((it) => {
  console.log(it);
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a return from `map` callback',
      code: `
[1, 2, 3].map((it) => {
  return it + 2;
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Callback is not passed to anything',
      code: `
const cb = (it): void => {
  return 42;
};
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With empty return from `forEach` callback #docs',
      code: `
[1, 2, 3].forEach((it) => {
  return;
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an `any` typed callback',
      code: `
function foo(fn: any) {
  fn();
}
foo(() => {
  if (Math.random()) return;
  return undefined;
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Callee accepts no param',
      code: `
function foo() {
  fn();
}
foo(() => {
  if (Math.random()) return;
  return undefined;
});
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'With return from `forEach` callback #docs',
      code: `
[1, 2, 3].forEach((it) => {
  return 42;
});
`,
      errors: [{ messageId: 'noReturnToVoid' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a function expression',
      code: `
[1, 2, 3].forEach(function (it) {
  return 42;
});
`,
      errors: [{ messageId: 'noReturnToVoid' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a block body',
      code: `
function foo(fn: () => void) {
  fn();
}
foo(() => {
  return 42;
});
`,
      errors: [{ messageId: 'noReturnToVoid' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an inline body',
      code: `
function foo(fn: () => void) {
  fn();
}
foo(() => 42);
`,
      errors: [{ messageId: 'noReturnToVoid' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `return undefined` from `forEach` callback #docs',
      code: `
[1, 2, 3].forEach((it) => {
  return undefined;
});
`,
      errors: [{ messageId: 'noReturnToVoid' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With return in `while` loop',
      code: `
[1, 2].forEach((it) => {
  while (1) {
    return 42;
  }
});
`,
      errors: [{ messageId: 'noReturnToVoid' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With return in `for` loop',
      code: `
[1, 2].forEach((it) => {
  for (let i = 0; i < it; i++) {
    return 42;
  }
});
`,
      errors: [{ messageId: 'noReturnToVoid' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With return in `for...in` loop',
      code: `
[1, 2].forEach((it) => {
  for (let k in it) {
    return 42;
  }
});
`,
      errors: [{ messageId: 'noReturnToVoid' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With return in `for...of` loop',
      code: `
[1, 2].forEach((it) => {
  for (let n of [it]) {
    return 42;
  }
});
`,
      errors: [{ messageId: 'noReturnToVoid' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With return in `try` block',
      code: `
[1, 2].forEach((it) => {
  try {
    return 42;
  } catch {
    console.log('oh no!');
  }
});
`,
      errors: [{ messageId: 'noReturnToVoid' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With return in `catch` block',
      code: `
[1, 2].forEach((it) => {
  try {
    JSON.parse('{');
  } catch {
    return 42;
  }
});
`,
      errors: [{ messageId: 'noReturnToVoid' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With return in `finally` block',
      code: `
[1, 2].forEach((it) => {
  try {
    JSON.parse('{}');
  } finally {
    return 42;
  }
});
`,
      errors: [{ messageId: 'noReturnToVoid' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With some undefined return from `forEach` callback #docs',
      code: `
[1, 2, 3].forEach((it) => {
  if (Math.cos(0)) return 42;
  return undefined;
});
`,
      errors: [{ messageId: 'noReturnToVoid' }, { messageId: 'noReturnToVoid' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
