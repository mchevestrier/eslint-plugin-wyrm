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
  ],
});
