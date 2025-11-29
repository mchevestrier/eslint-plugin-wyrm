import markdownPlugin from '@eslint/markdown';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-useless-use-strict.js';

const ruleTester = new RuleTester({
  plugins: { markdown: markdownPlugin },
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run(name, rule, {
  valid: [
    {
      name: "`'use strict'` directive in CJS file #docs",
      filename: 'file.cjs',
      code: `
'use strict';
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: "Not a `'use strict'` directive",
      filename: 'file.mjs',
      code: `
'use client';
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Not a directive',
      filename: 'file.mjs',
      code: `
const foo = 'use strict';
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      filename: 'file.cjs',
      name: "`'use strict'` as a class property",
      code: `
class Klass {
  'use strict';
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      filename: 'file.ts',
      name: "`'use strict'` directive in TS file #docs",
      code: `
'use strict';
`,
      errors: [{ messageId: 'noUseStrictInTS' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      filename: 'file.tsx',
      name: "`'use strict'` directive in TSX file",
      code: `
'use strict';
`,
      errors: [{ messageId: 'noUseStrictInTS' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      filename: 'file.mjs',
      name: "`'use strict'` directive in ESM file #docs",
      code: `
'use strict';
`,
      errors: [{ messageId: 'noUseStrictInESM' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      filename: 'file.js',
      name: "`'use strict'` directive in ESM file (`.js`)",
      code: `
'use strict';
`,
      errors: [{ messageId: 'noUseStrictInESM' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      filename: 'file.cjs',
      name: "`'use strict'` directive in class constructor #docs",
      code: `
class Klass {
  constructor() {
    'use strict';
  }
}
`,
      errors: [{ messageId: 'noUseStrictInClass' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      filename: 'file.cjs',
      name: "`'use strict'` directive in class method",
      code: `
class Klass {
  method() {
    'use strict';
  }
}
`,
      errors: [{ messageId: 'noUseStrictInClass' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
