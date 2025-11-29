import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-useless-computed-key.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'String literal key is not computed',
      code: `
const obj = { 'foobar': 42 };
`,
      after() {
        // Not formatted
      },
    },
    {
      name: 'String literal key #docs (with dash)',
      code: `
const obj = { 'foo-bar': 42 };
`,
      after() {
        // Not formatted
      },
    },
    {
      name: 'Identifier key #docs',
      code: `
const obj = { foobar: 42 };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful computed key #docs',
      code: `
const obj = { ['foo' + 'bar']: 42 };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Number literal computed key',
      code: `
const obj = { [105]: 42 };
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Useless computed key',
      code: `
const obj = { ['foobar']: 42 };
`,
      output: `
const obj = { 'foobar': 42 };
`,
      errors: [{ messageId: 'noUselessComputedKey' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useless computed key #docs (with dash)',
      code: `
const obj = { ['foo-bar']: 42 };
`,
      output: `
const obj = { 'foo-bar': 42 };
`,
      errors: [{ messageId: 'noUselessComputedKey' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useless computed key (with period)',
      code: `
const obj = { ['foo.bar']: 42 };
`,
      output: `
const obj = { 'foo.bar': 42 };
`,
      errors: [{ messageId: 'noUselessComputedKey' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
