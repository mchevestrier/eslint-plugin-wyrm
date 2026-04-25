import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './comment-duplicate-leading-space.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Only one leading space #docs',
      code: `
// Only one leading space
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Two spaces but not leading #docs',
      code: `
// Two spaces  but not leading
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Three leading spaces #docs',
      code: `
//   Three leading spaces
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Four leading spaces',
      code: `
//   Four leading spaces
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With JSDoc',
      code: `
/**  Duplicate leading space */
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Only one leading space in a block comment',
      code: `
/* Only one leading space */
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Duplicate leading space after a line break',
      code: `
/* 
  Duplicate leading space
*/
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Duplicate leading space before a line break',
      code: `
/*  
  Duplicate leading space
*/
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Duplicate leading space #docs',
      code: `
//  Duplicate leading space
`,
      output: `
// Duplicate leading space
`,
      errors: [{ messageId: 'duplicateSpace' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Duplicate leading space in a block comment #docs',
      code: `
/*  Duplicate leading space */
`,
      output: `
/* Duplicate leading space */
`,
      errors: [{ messageId: 'duplicateSpace' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Lowercase',
      code: `
//  duplicate leading space
`,
      output: `
// duplicate leading space
`,
      errors: [{ messageId: 'duplicateSpace' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
