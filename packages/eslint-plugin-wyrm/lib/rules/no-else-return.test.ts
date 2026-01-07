import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-else-return.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'No `else` block necessary #docs',
      code: `
if (cond) return 'ok';
foo();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Empty consequent block',
      code: `
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
      name: 'Consequent block does not always return',
      code: `
if (cond) {
  if (Math.random()) return 'ok';
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
      name: 'Unnecessary `else` block after `return` #docs',
      code: `
if (cond) return 'ok';
else foo();
`,
      output: `
if (cond) return 'ok';
 foo();
`,
      errors: [{ messageId: 'noElseReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unnecessary `else` block after empty `return` #docs',
      code: `
if (cond) return;
else foo();
`,
      output: `
if (cond) return;
 foo();
`,
      errors: [{ messageId: 'noElseReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unnecessary `else` block after `return` (block condition)',
      code: `
if (cond) {
  return 'ok';
} else {
  foo();
}
`,
      output: `
if (cond) {
  return 'ok';
}  
foo();
`,
      errors: [{ messageId: 'noElseReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unnecessary `else if` block after `return`',
      code: `
if (cond) {
  return 'ok';
} else if (quux) {
  foo();
}
`,
      output: `
if (cond) {
  return 'ok';
}  if (quux) {
  foo();
}
`,
      errors: [{ messageId: 'noElseReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Unnecessary `else` multiline block after `return` (block condition)',
      code: `
while (true) {
  if (cond) {
    return 'ok';
  } else {
    foo();
    bar();
  }
}
`,
      output: `
while (true) {
  if (cond) {
    return 'ok';
  }  
  foo();
  bar();
}
`,
      errors: [{ messageId: 'noElseReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Always returning from a `for` loop',
      code: `
if (cond) {
  for (let i = 0; i < 2; i++) {
    return;
  }
} else {
  foo();
}
`,
      output: `
if (cond) {
  for (let i = 0; i < 2; i++) {
    return;
  }
}  
foo();
`,
      errors: [{ messageId: 'noElseReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Always returning from a `for of` loop',
      code: `
if (cond) {
  for (const _ of []) {
    return;
  }
} else {
  foo();
}
`,
      output: `
if (cond) {
  for (const _ of []) {
    return;
  }
}  
foo();
`,
      errors: [{ messageId: 'noElseReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Always returning from a `for in` loop',
      code: `
if (cond) {
  for (const _ in {}) {
    return;
  }
} else {
  foo();
}
`,
      output: `
if (cond) {
  for (const _ in {}) {
    return;
  }
}  
foo();
`,
      errors: [{ messageId: 'noElseReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Always returning from a `do while` loop',
      code: `
if (cond) {
  do {
    return;
  } while (true);
} else {
  foo();
}
`,
      output: `
if (cond) {
  do {
    return;
  } while (true);
}  
foo();
`,
      errors: [{ messageId: 'noElseReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Always returning from a `while` loop',
      code: `
if (cond) {
  while (true) {
    debugger;
    return;
  }
} else {
  foo();
}
`,
      output: `
if (cond) {
  while (true) {
    debugger;
    return;
  }
}  
foo();
`,
      errors: [{ messageId: 'noElseReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Always returning from a `try` statement with no finalizer',
      code: `
if (cond) {
  try {
    return;
  } catch {
    return;
  }
} else {
  foo();
}
`,
      output: `
if (cond) {
  try {
    return;
  } catch {
    return;
  }
}  
foo();
`,
      errors: [{ messageId: 'noElseReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Always returning from a `try` statement with a finalizer',
      code: `
if (cond) {
  try {
  } catch {
  } finally {
    return;
  }
} else {
  foo();
}
`,
      output: `
if (cond) {
  try {
  } catch {
  } finally {
    return;
  }
}  
foo();
`,
      errors: [{ messageId: 'noElseReturn' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
