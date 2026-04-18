import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './conditional-boolean.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Branch has differences other than boolean values #docs',
      code: `
if (foo) {
  doStuff('yes', true);
} else {
  doStuff('no', false);
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Both boolean literals have the same value',
      code: `
if (foo) {
  doStuff(false);
} else {
  doStuff(false);
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Conditional boolean in call expression argument #docs',
      code: `
if (foo) {
  doStuff(true);
} else {
  doStuff(false);
}
`,
      output: `
doStuff(!!(foo));
`,
      errors: [
        {
          messageId: 'noConditionalBoolean',
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conditional assignment of a boolean literal #docs',
      code: `
let bar;
if (foo) {
  bar = true;
} else {
  bar = false;
}
`,
      output: `
let bar;
bar = !!(foo);
`,
      errors: [
        {
          messageId: 'noConditionalBoolean',
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a negated condition',
      code: `
if (foo) {
  doStuff(false);
} else {
  doStuff(true);
}
`,
      output: `
doStuff(!(foo));
`,
      errors: [
        {
          messageId: 'noConditionalBoolean',
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With several boolean literals',
      code: `
if (foo) {
  doStuff(false, true);
} else {
  doStuff(true, false);
}
`,
      output: `
doStuff(!(foo), !!(foo));
`,
      errors: [
        {
          messageId: 'noConditionalBoolean',
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With inline branches',
      code: `
if (foo) doStuff(false, true);
else doStuff(true, false);
`,
      output: `
doStuff(!(foo), !!(foo));
`,
      errors: [
        {
          messageId: 'noConditionalBoolean',
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an inline else',
      code: `
if (foo) {
  doStuff(false, true);
} else doStuff(true, false);
`,
      output: `
doStuff(!(foo), !!(foo));
`,
      errors: [
        {
          messageId: 'noConditionalBoolean',
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
