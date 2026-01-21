import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './unused-object-assign.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Used `Object.assign()` #docs',
      code: `
const fnord = Object.assign({}, { foo: 42 });
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`Object.assign()` with side-effect #docs',
      code: `
const quux = { bar: 105 };
Object.assign(quux, { foo: 42 });
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'No argument',
      code: `
Object.assign();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Call expression is not a member expression',
      code: `
quux({}, { foo: 42 });
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Object is not an identifier',
      code: `
(1 ? Object : Quux).assign({}, { foo: 42 });
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Method is not an identifier',
      code: `
Object['assign']({}, { foo: 42 });
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not `Object`',
      code: `
Quux.assign({}, { foo: 42 });
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not `assign`',
      code: `
Object.quux({}, { foo: 42 });
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Unused `Object.assign()` #docs',
      code: `
Object.assign({}, { foo: 42 });
`,
      errors: [{ messageId: 'noUnusedObjectAssign' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
