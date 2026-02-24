import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './export-using.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Not exported #docs',
      code: `
using foo = new Disposable();

const bar = 42;
export { bar };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not exported (with `await using`)',
      code: `
await using foo = new Disposable();

const bar = 42;
export { bar };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not declared with `using`',
      code: `
const foo = new Disposable();
export { foo };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Direct named export of a variable not declared with `using`',
      code: `
export const foo = new Disposable();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Local export specifier is a string literal',
      code: `
using foo = new Disposable();
export { 'foo' } from './foo.js';
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Exporting a variable shadowing a variable declared with `using`',
      code: `
using foo = new Disposable();

const foo = 42;
export { foo };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Default export of a function shadowing a variable declared with `await using`',
      code: `
await using foo = new Disposable();

export default function foo() {}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Exporting an unresolved identifier',
      code: `
using foo = new Disposable();

export { bar };
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Exporting an imported identifier',
      code: `
import { bar } from './bar.js';

using foo = new Disposable();

export { bar };
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'With a named export of an identifier declared with `using` #docs',
      code: `
using foo = new Disposable();
export { foo };
`,
      errors: [{ messageId: 'noExportUsing' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a named export of an identifier declared with `await using`',
      code: `
await using foo = new Disposable();
export { foo };
`,
      errors: [{ messageId: 'noExportUsing' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a default export of an identifier declared with `using`',
      code: `
using foo = new Disposable();
export default foo;
`,
      errors: [{ messageId: 'noExportUsing' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a default export of an identifier declared with `await using` #docs',
      code: `
await using foo = new Disposable();
export default foo;
`,
      errors: [{ messageId: 'noExportUsing' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Direct named export of a variable declared with `using` (invalid in JS) #docs',
      code: `
export using foo = new Disposable();
`,
      errors: [{ messageId: 'noExportUsing' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Direct named export of a variable declared with `await using` (invalid in JS)',
      code: `
export await using foo = new Disposable();
`,
      errors: [{ messageId: 'noExportUsing' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
