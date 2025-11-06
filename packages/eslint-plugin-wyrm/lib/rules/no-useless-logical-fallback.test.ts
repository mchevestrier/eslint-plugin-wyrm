import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-useless-logical-fallback.js';

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
      name: '`null` with default to `undefined` #docs',
      code: `function quux(foo: string | null) {
  return foo ?? undefined;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`undefined` with default to `null` #docs',
      code: `function quux(foo: string | undefined) {
  return foo ?? null;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`|| false` when the left side is not exclusively a boolean',
      code: `function quux(foo: boolean | number) {
  return foo || false;
}
`,
    },
  ],
  invalid: [
    {
      name: 'With `?? undefined` #docs',
      code: `function quux(foo: string | undefined) {
  return foo ?? undefined;
}
`,
      errors: [
        {
          messageId: 'noUselessNullishFallback',
          suggestions: [
            {
              messageId: 'removeNullishFallback',
              data: { expression: '?? undefined' },
              output: `function quux(foo: string | undefined) {
  return foo;
}
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
      name: 'With `?? null` #docs',
      code: `function quux(foo: string | null) {
  return foo ?? null;
}
`,
      errors: [
        {
          messageId: 'noUselessNullishFallback',
          suggestions: [
            {
              messageId: 'removeNullishFallback',
              data: { expression: '?? null' },
              output: `function quux(foo: string | null) {
  return foo;
}
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
      name: 'With `|| false` #docs',
      code: `function quux(foo: boolean) {
  return foo || false;
}
`,
      errors: [
        {
          messageId: 'noUselessNullishFallback',
          suggestions: [
            {
              messageId: 'removeNullishFallback',
              data: { expression: '|| false' },
              output: `function quux(foo: boolean) {
  return foo;
}
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
      name: 'With `&& true` #docs',
      code: `function quux(foo: boolean) {
  return foo && true;
}
`,
      errors: [
        {
          messageId: 'noUselessNullishFallback',
          suggestions: [
            {
              messageId: 'removeNullishFallback',
              data: { expression: '&& true' },
              output: `function quux(foo: boolean) {
  return foo;
}
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
      name: 'With `&& false` (constant expression) #docs',
      code: `function quux(foo: boolean) {
  return foo && false;
}
`,
      errors: [
        {
          messageId: 'noConstantExpression',
          suggestions: [
            {
              messageId: 'removeNullishFallback',
              data: { expression: '&& false' },
              output: `function quux(foo: boolean) {
  return foo;
}
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
      name: 'With `|| true` (constant expression) #docs',
      code: `function quux(foo: boolean) {
  return foo || true;
}
`,
      errors: [
        {
          messageId: 'noConstantExpression',
          suggestions: [
            {
              messageId: 'removeNullishFallback',
              data: { expression: '|| true' },
              output: `function quux(foo: boolean) {
  return foo;
}
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
