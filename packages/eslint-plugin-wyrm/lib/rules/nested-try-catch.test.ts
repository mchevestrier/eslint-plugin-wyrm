import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './nested-try-catch.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Simple try/catch block #docs',
      code: `
try {
  foo();
} catch {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'A try/catch block inside a scope block',
      code: `
{
  try {
    foo();
  } catch {}
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'A try/catch block inside a function inside a try/catch block #docs',
      code: `
try {
  function bar() {
    try {
      foo();
    } catch {}
  }
} catch {}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'A try/catch statement inside another try block #docs',
      code: `
try {
  try {
    foo();
  } catch {}
} catch {}
`,
      errors: [{ messageId: 'noNestedTryCatch' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'A try/catch statement inside a catch clause #docs',
      code: `
try {
  foo();
} catch {
  try {
    foo();
  } catch {}
}
`,
      errors: [{ messageId: 'noNestedTryCatch' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'A try/catch statement inside a finally clause #docs',
      code: `
try {
  foo();
} finally {
  try {
    foo();
  } catch {}
}
`,
      errors: [{ messageId: 'noNestedTryCatch' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
