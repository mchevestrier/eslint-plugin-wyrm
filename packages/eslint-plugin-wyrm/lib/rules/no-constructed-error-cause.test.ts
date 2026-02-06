import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-constructed-error-cause.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'No error cause',
      code: `
new Error('foo');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Error cause is an identifier #docs',
      code: `
new Error('foo', { cause: err });
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Error cause is a ternary condition',
      code: `
new Error('foo', { cause: err instanceof Error ? err : undefined });
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Custom error #docs',
      code: `
new QuuxError('foo', { cause: { key: 'ok' }, data: null });
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Callee is not an identifier',
      code: `
(1 ? Error : Quux)('foo', { cause: {} });
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Callee is not Error',
      code: `
Quux('foo', { cause: {} });
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Error options is not an object literal',
      code: `
const options = { cause: {} };
Error('foo', options);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Error options with no cause',
      code: `
Error('foo', {});
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Error cause is an object literal #docs',
      code: `
new Error('foo', { cause: { message: 'bar' } });
`,
      errors: [{ messageId: 'noConstructedErrorCause' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Error cause is a new instantiated error #docs',
      code: `
Error('foo', { cause: new Error('bar') });
`,
      errors: [{ messageId: 'noConstructedErrorCause' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Error cause is a new instantiated error (call expression)',
      code: `
new Error('foo', { cause: Error('bar') });
`,
      errors: [{ messageId: 'noConstructedErrorCause' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With several options',
      code: `
new Error('foo', { cause: { message: 'bar' }, fnord: 'quux' });
`,
      errors: [{ messageId: 'noConstructedErrorCause' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Error cause is a new instantiated object',
      code: `
Error('foo', { cause: new Quux('bar') });
`,
      errors: [{ messageId: 'noConstructedErrorCause' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
