import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './de-morgan.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Simple logical expression',
      code: `
foo && 24;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Logical expression with negated components #docs',
      code: `
!foo || !24;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a negation',
      code: `
+(foo && 24);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Double negation',
      code: `
!!(foo && 24);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Nullish coalescing logical expression',
      code: `
!(foo ?? 24);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Binary expression with non negatable operator',
      code: `
!(foo << 24);
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Negated conjunction #docs',
      code: `
!(foo && 24);
`,
      output: `
(!(foo) || !(24));
`,
      errors: [{ messageId: 'deMorgan' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Negated disjunction #docs',
      code: `
!(foo || 24);
`,
      output: `
(!(foo) && !(24));
`,
      errors: [{ messageId: 'deMorgan' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Negated conjunction with existing negation in left side',
      code: `
!(!foo && 24);
`,
      output: `
(foo || !(24));
`,
      errors: [{ messageId: 'deMorgan' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Negated conjunction with binary expression in left side',
      code: `
!(!foo && bar > 24);
`,
      output: `
(foo || bar <= 24);
`,
      errors: [{ messageId: 'deMorgan' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Negated conjunction with parent unary expression (but not a double negation)',
      code: `
+!(foo && 24);
`,
      output: `
+(!(foo) || !(24));
`,
      errors: [{ messageId: 'deMorgan' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Inverted equality check',
      code: `
!(foo == 24);
`,
      output: `
(foo != 24);
`,
      errors: [{ messageId: 'deMorgan' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
