import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-custom-url-parsing.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Simple ternary expression',
      code: `
foo ? bar : baz;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Add query params using the `URL` constructor #docs',
      code: `
const params = {
  foo: 'bar',
  baz: 'quux',
};
let u = new URL('/path/fnord', 'https://example.com');
Object.entries(params).forEach(([k, v]) => {
  u.searchParams.set(k, v);
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Simple call expression',
      code: `
foo();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Call expression on `?`, but not a member expression',
      code: `
foo('?');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Member expression property is not an identifier',
      code: `
foo['split']('?');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Splitting on a string literal',
      code: `
foo.split('ok');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Call expression on `?`, but not a suspicious method',
      code: `
foo.bar('?');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Simple ternary expression with string literals',
      code: `
foo ? 'bar' : 'baz';

foo ? 'foo' : '?';
foo ? 'foo' : '&';

foo ? '?' : 'baz';
foo ? '&' : 'baz';

foo ? '?' : '?';
foo ? '&' : '&';
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Conditional query param delimiter selection #docs',
      code: `
const params = {
  foo: 'bar',
  baz: 'quux',
};
let u = 'https://example.com/path/fnord';
Object.entries(params).forEach(([k, v], i) => {
  u += \`\${i === 0 ? '?' : '&'}\${k}=\${v}\`;
});
`,
      errors: [{ messageId: 'noCustomUrlParsing' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Conditional query param delimiter selection (reverse order)',
      code: `
i !== 0 ? '&' : '?';
`,
      errors: [{ messageId: 'noCustomUrlParsing' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Splitting on `?` delimiter #docs',
      code: `
url.split('?')[1];
`,
      errors: [{ messageId: 'noCustomUrlParsing' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Splitting on `?` delimiter (with destructuring)',
      code: `
const [basePath, queryString] = url.split('?');
`,
      errors: [{ messageId: 'noCustomUrlParsing' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`indexOf` on `?` delimiter',
      code: `
url.indexOf('?');
`,
      errors: [{ messageId: 'noCustomUrlParsing' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      // eslint-disable-next-line internal/no-test-skip
      skip: true,
      name: 'Interpolation of a query parameter',
      code: `
\`foo=\${encodeURIComponent(bar)}\`;
`,
      errors: [{ messageId: 'noCustomUrlParsing' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
