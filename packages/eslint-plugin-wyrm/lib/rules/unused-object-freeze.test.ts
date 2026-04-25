import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './unused-object-freeze.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Used `Object.freeze()` #docs',
      code: `
const fnord = Object.freeze({ foo: 42 });
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Object.freeze()` with side-effect #docs',
      code: `
const quux = { bar: 105 };
Object.freeze(quux);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'No argument',
      code: `
Object.freeze();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Call expression is not a member expression',
      code: `
quux({ foo: 42 });
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Object is not an identifier',
      code: `
(1 ? Object : Quux).freeze({ foo: 42 });
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Method is not an identifier',
      code: `
Object['freeze']({ foo: 42 });
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not `Object`',
      code: `
Quux.freeze({ foo: 42 });
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not `freeze`',
      code: `
Object.quux({ foo: 42 });
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Unused `Object.freeze()` #docs',
      code: `
Object.freeze({ foo: 42 });
`,
      errors: [{ messageId: 'noUnusedObjectFreeze' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
