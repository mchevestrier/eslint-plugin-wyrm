import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-constant-template-expression.js';

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ['*.ts*'],
      },
      errorOnTypeScriptSyntacticAndSemanticIssues: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
});

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Template expression typed as string #docs',
      code: `declare const foo: string;
const str = \`\${foo}_baz\`;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Template expression typed as boolean',
      code: `declare const foo: boolean;
const str = \`\${foo}_baz\`;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Template expression with a constant BigInt value',
      code: `const n = 42n;
const str = \`\${n}_baz\`;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Template expression with a 10 character string value (as long as the default `minAllowedLength` value) #docs',
      code: `const n = 'aaaaaaaaaa';
const str = \`\${n}_baz\`;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an empty string (`minAllowedLength: 0`)',
      options: [{ minAllowedLength: 0 }],
      code: `const foo = '';
const str = \`\${foo}_baz\`;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a 4 character string (`minAllowedLength: 3`)',
      options: [{ minAllowedLength: 3 }],
      code: `const foo = '1234';
const str = \`\${foo}_baz\`;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a 4 character string (`minAllowedLength: 4`)',
      options: [{ minAllowedLength: 4 }],
      code: `const foo = '1234';
const str = \`\${foo}_baz\`;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Reusing an identifier is allowed',
      code: `const foo = 'foobar';
const str1 = \`\${foo}_baz\`;
const str2 = \`\${foo}_quux\`;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Using an exported identifier is allowed',
      code: `export const foo = 'foobar';
const str = \`\${foo}_baz\`;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'A template literal with spaces is allowed',
      code: `export const foo = 'foobar';
const str = \`Value: \${foo}\`;
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Template expression with a constant string value #docs',
      code: `const foo = 'foobar';
const str = \`\${foo}_baz\`;
`,
      errors: [
        {
          messageId: 'noConstantTemplateExpression',
          suggestions: [
            {
              messageId: 'replaceByString',
              data: { value: 'foobar' },
              output: `const foo = 'foobar';
const str = \`foobar_baz\`;
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Template expression with a constant number value #docs',
      code: `const n = 42;
const str = \`\${n}_baz\`;
`,
      errors: [
        {
          messageId: 'noConstantTemplateExpression',
          suggestions: [
            {
              messageId: 'replaceByString',
              data: { value: '42' },
              output: `const n = 42;
const str = \`42_baz\`;
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Template expression with a constant boolean value #docs',
      code: `const bool = true;
const str = \`\${bool}_baz\`;
`,
      errors: [
        {
          messageId: 'noConstantTemplateExpression',
          suggestions: [
            {
              messageId: 'replaceByString',
              data: { value: 'true' },
              output: `const bool = true;
const str = \`true_baz\`;
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With spaces inside',
      code: `const foo = 'foobar';
const str = \`Ok_\${notLiteral}_Ok_\${    foo    }_baz\`;
`,
      errors: [
        {
          messageId: 'noConstantTemplateExpression',
          suggestions: [
            {
              messageId: 'replaceByString',
              data: { value: 'foobar' },
              output: `const foo = 'foobar';
const str = \`Ok_\${notLiteral}_Ok_foobar_baz\`;
`,
            },
          ],
        },
      ],
      after() {
        // Not formatted
      },
    },
    {
      name: 'With an empty string',
      code: `const foo = '';
const str = \`\${foo}_baz\`;
`,
      errors: [
        {
          messageId: 'noConstantTemplateExpression',
          suggestions: [
            {
              messageId: 'replaceByString',
              data: { value: '' },
              output: `const foo = '';
const str = \`_baz\`;
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a 4 character string (`minAllowedLength: 5`)',
      options: [{ minAllowedLength: 5 }],
      code: `const foo = '1234';
const str = \`\${foo}_baz\`;
`,
      errors: [
        {
          messageId: 'noConstantTemplateExpression',
          suggestions: [
            {
              messageId: 'replaceByString',
              data: { value: '1234' },
              output: `const foo = '1234';
const str = \`1234_baz\`;
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a 14 character string (`minAllowedLength: 15`) #docs',
      options: [{ minAllowedLength: 15 }],
      code: `const foo = '12345678901234';
const str = \`\${foo}_baz\`;
`,
      errors: [
        {
          messageId: 'noConstantTemplateExpression',
          suggestions: [
            {
              messageId: 'replaceByString',
              data: { value: '12345678901234' },
              output: `const foo = '12345678901234';
const str = \`12345678901234_baz\`;
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a literal string value as the expression',
      code: `const str = \`\${'foobar'}_baz\`;
`,
      errors: [
        {
          messageId: 'noConstantTemplateExpression',
          suggestions: [
            {
              messageId: 'replaceByString',
              data: { value: 'foobar' },
              output: `const str = \`foobar_baz\`;
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a literal number value as the expression',
      code: `const str = \`\${42}_baz\`;
`,
      errors: [
        {
          messageId: 'noConstantTemplateExpression',
          suggestions: [
            {
              messageId: 'replaceByString',
              data: { value: '42' },
              output: `const str = \`42_baz\`;
`,
            },
          ],
        },
      ],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
