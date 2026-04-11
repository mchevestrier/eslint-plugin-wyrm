import path from 'node:path';

import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-else-never.js';

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      errorOnTypeScriptSyntacticAndSemanticIssues: true,
      project: './tsconfig.json',
      projectService: false,
      tsconfigRootDir: path.join(import.meta.dirname, './fixtures'),
    },
  },
});

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'No `else` block necessary #docs',
      code: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) throwsError();
foo();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty consequent block',
      code: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
} else {
  foo();
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Consequent block does not always return `never`',
      code: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
  if (Math.random()) throwsError();
} else {
  foo();
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`catch` does not return `never`',
      code: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
  try {
    throwsError();
  } catch {}
} else {
  foo();
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`try` does not always return `never`',
      code: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
  try {
    //
  } catch {
    throwsError();
  }
} else {
  foo();
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Statement that does not return `never`',
      code: `
function returnsError() {
  return Error('Oh no');
}

if (cond) returnsError();
else foo();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a switch statement that sometimes returns `never`',
      code: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
  switch (bar) {
    case 'a':
      throwsError();
    case 'b':
      console.log('no return never here');
      break;
    default:
      throwsError();
  }
} else {
  foo();
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Unnecessary `else` block after returning `never` #docs',
      code: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) throwsError();
else foo();
`,
      output: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) throwsError();
 foo();
`,
      errors: [{ messageId: 'noElseNever' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unnecessary `else` block after returning `never` (block condition)',
      code: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
  throwsError();
} else {
  foo();
}
`,
      output: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
  throwsError();
}  
foo();
`,
      errors: [{ messageId: 'noElseNever' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unnecessary `else if` block after returning `never`',
      code: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
  throwsError();
} else if (quux) {
  foo();
}
`,
      output: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
  throwsError();
}  if (quux) {
  foo();
}
`,
      errors: [{ messageId: 'noElseNever' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unnecessary `else` multiline block after returning `never` (block condition)',
      code: `
function throwsError(): never {
  throw Error('Oh no');
}

while (true) {
  if (cond) {
    throwsError();
  } else {
    foo();
    bar();
  }
}
`,
      output: `
function throwsError(): never {
  throw Error('Oh no');
}

while (true) {
  if (cond) {
    throwsError();
  }  
  foo();
  bar();
}
`,
      errors: [{ messageId: 'noElseNever' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Always returning `never` from a `for` loop',
      code: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
  for (let i = 0; i < 2; i++) {
    throwsError();
  }
} else {
  foo();
}
`,
      output: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
  for (let i = 0; i < 2; i++) {
    throwsError();
  }
}  
foo();
`,
      errors: [{ messageId: 'noElseNever' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Always returning `never` from a `for of` loop',
      code: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
  for (const _ of []) {
    throwsError();
  }
} else {
  foo();
}
`,
      output: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
  for (const _ of []) {
    throwsError();
  }
}  
foo();
`,
      errors: [{ messageId: 'noElseNever' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Always returning `never` from a `for in` loop',
      code: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
  for (const _ in {}) {
    throwsError();
  }
} else {
  foo();
}
`,
      output: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
  for (const _ in {}) {
    throwsError();
  }
}  
foo();
`,
      errors: [{ messageId: 'noElseNever' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Always returning `never` from a `do while` loop',
      code: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
  do {
    throwsError();
  } while (true);
} else {
  foo();
}
`,
      output: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
  do {
    throwsError();
  } while (true);
}  
foo();
`,
      errors: [{ messageId: 'noElseNever' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Always returning `never` from a `while` loop',
      code: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
  while (true) {
    debugger;
    throwsError();
  }
} else {
  foo();
}
`,
      output: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
  while (true) {
    debugger;
    throwsError();
  }
}  
foo();
`,
      errors: [{ messageId: 'noElseNever' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Always returning `never` from an `if` statement',
      code: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
  if (foo) {
    throwsError();
  } else {
    throwsError();
  }
} else {
  foo();
}
`,
      output: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
  if (foo) {
    throwsError();
  }  
  throwsError();
}  
foo();
`,
      errors: [{ messageId: 'noElseNever' }, { messageId: 'noElseNever' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Always returning `never` from a `try` statement with no finalizer',
      code: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
  try {
    throwsError();
  } catch {
    throwsError();
  }
} else {
  foo();
}
`,
      output: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
  try {
    throwsError();
  } catch {
    throwsError();
  }
}  
foo();
`,
      errors: [{ messageId: 'noElseNever' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Always returning `never` from a `try` statement with a finalizer',
      code: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
  try {
  } catch {
  } finally {
    throwsError();
  }
} else {
  foo();
}
`,
      output: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
  try {
  } catch {
  } finally {
    throwsError();
  }
}  
foo();
`,
      errors: [{ messageId: 'noElseNever' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a switch statement that always returns `never`',
      code: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
  switch (bar) {
    case 'a':
      throwsError();
    case 'b':
      throwsError();
    default:
      throwsError();
  }
} else {
  foo();
}
`,
      output: `
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) {
  switch (bar) {
    case 'a':
      throwsError();
    case 'b':
      throwsError();
    default:
      throwsError();
  }
}  
foo();
`,
      errors: [{ messageId: 'noElseNever' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
