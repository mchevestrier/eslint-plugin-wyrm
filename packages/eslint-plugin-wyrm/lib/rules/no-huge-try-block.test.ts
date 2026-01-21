import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-huge-try-block.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: '`try` block spanning 20 lines #docs',
      code: `
try {
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
} catch {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`try` block spanning 3 lines (with `options.maxTryLines: 3`)',
      options: [{ maxTryLines: 3, maxCatchLines: Infinity, maxFinallyLines: Infinity }],
      code: `
try {
  foo();
} catch {
  foo();
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`catch` block spanning 3 lines (with `options.maxCatchLines: 3`)',
      options: [{ maxTryLines: Infinity, maxCatchLines: 3, maxFinallyLines: Infinity }],
      code: `
try {
  foo();
} catch {
  foo();
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`finally` block spanning 3 lines (with `options.maxFinallyLines: 3`)',
      options: [{ maxTryLines: Infinity, maxCatchLines: Infinity, maxFinallyLines: 3 }],
      code: `
try {
  foo();
} finally {
  foo();
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: '`try` block spanning 21 lines #docs',
      code: `
try {
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
} catch {}
`,
      errors: [{ messageId: 'noHugeTryBlock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`try` block spanning 3 lines (with `options.maxTryLines: 2`)',
      options: [{ maxTryLines: 2, maxCatchLines: Infinity, maxFinallyLines: Infinity }],
      code: `
try {
  foo();
} catch {}
`,
      errors: [{ messageId: 'noHugeTryBlock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`catch` block spanning 3 lines (with `options.maxCatchLines: 2`)',
      options: [{ maxTryLines: Infinity, maxCatchLines: 2, maxFinallyLines: Infinity }],
      code: `
try {
} catch {
  foo();
}
`,
      errors: [{ messageId: 'noHugeCatchBlock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`finally` block spanning 3 lines (with `options.maxFinallyLines: 2`)',
      options: [{ maxTryLines: Infinity, maxCatchLines: Infinity, maxFinallyLines: 2 }],
      code: `
try {
} finally {
  foo();
}
`,
      errors: [{ messageId: 'noHugeFinallyBlock' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
