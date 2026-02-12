import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-duplicated-return.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'No duplicated return #docs',
      code: `
function foo() {
  if (Math.random()) return null;
  if (Math.random()) return null;
  return 42;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'No early return in branch',
      code: `
function foo() {
  if (Math.random()) console.log('ok');
  console.log('ok');
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'No `if` statement',
      code: `
function foo() {
  console.log('ok');
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`if` statement is the last statement',
      code: `
function foo() {
  console.log('ok');
  if (Math.random()) {
    console.log('ok');
    return;
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an alternate branch',
      code: `
function foo() {
  if (Math.random()) {
    console.log('ok');
    return;
  } else {
    console.log('no');
  }
  console.log('ok');
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With the same statements but not the same return values',
      code: `
function foo() {
  if (Math.random()) {
    console.log('ok');
    return 42;
  }
  console.log('ok');
  return 105;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an arrow function and no block statement',
      code: `
const foo = () => 42;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With empty returns in consequent and alternate branches',
      code: `
function foo() {
  if (Math.random()) {
    if (Math.random()) {
      console.log('ok');
      return;
    } else {
      console.log('ok');
      return;
    }
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With empty return in consequent branch but no alternate branch',
      code: `
function foo() {
  if (Math.random()) {
    if (Math.random()) {
      console.log('ok');
      return;
    }
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With empty return in `try` block but not in `catch` block',
      code: `
function foo() {
  if (Math.random()) {
    try {
      JSON.stringify('{}');
      return;
    } catch {}
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With empty return in `try` block and no `catch` block',
      code: `
function foo() {
  if (Math.random()) {
    try {
      JSON.stringify('{}');
      return;
    } finally {
    }
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `finally` block that always returns',
      code: `
function foo() {
  if (Math.random()) {
    try {
      JSON.stringify('{}');
    } finally {
      return;
    }
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'An empty `yield` statement is not ignored',
      code: `
function foo() {
  if (Math.random()) {
    console.log('ok');
    return;
  }
  console.log('ok');
  yield;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Without semicolons',
      code: `
function foo() {
  if (Math.random()) {
    yield
    Foo()
    return
  }
  yieldFoo()
}
`,
      after() {
        // Not formatted
      },
    },
    {
      name: 'With different template literals',
      code: `
function foo() {
  if (Math.random()) {
    return \`
\`;
  }
  return \`
   \`;
}
`,
      after() {
        // Not formatted
      },
    },
    {
      name: 'With duplicate `if`/`else` blocks, not always returning',
      code: `
function foo() {
  if (Math.random()) {
    if (Math.cos(0)) {
      return 42;
    } else {
      console.log(105);
    }
  }
  if (Math.cos(0)) {
    return 42;
  } else {
    console.log(105);
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With duplicate `try`/`catch` blocks, not always returning',
      code: `
function foo() {
  if (Math.random()) {
    try {
      JSON.parse('{}');
    } catch {
      return 105;
    }
  }
  try {
    JSON.parse('{}');
  } catch {
    return 105;
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With duplicate `try`/`catch`/`finally` blocks, but only returning in `try` block',
      code: `
function foo() {
  if (Math.random()) {
    try {
      return JSON.parse('{}');
    } catch {
      console.log('oh no');
    } finally {
      console.log('done');
    }
  }
  try {
    return JSON.parse('{}');
  } catch {
    console.log('oh no');
  } finally {
    console.log('done');
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With duplicate `try`/`catch`/`finally` blocks, but only returning in `catch` block',
      code: `
function foo() {
  if (Math.random()) {
    try {
      JSON.parse('{}');
    } catch {
      return 105;
    } finally {
      console.log('done');
    }
  }
  try {
    JSON.parse('{}');
  } catch {
    return 105;
  } finally {
    console.log('done');
  }
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'TypeScript nodes with different types',
      code: `
function foo() {
  if (Math.random()) {
    return ("bar" as unknown)?.toUpperCase();
  }
  return ('bar' as any)?.toUpperCase();
}
`,
      after() {
        // Not formatted
      },
    },
    {
      name: 'Returning different strings',
      code: `
function foo() {
  if (Math.random()) {
    return "bar";
  }
  return 'baz';
}
`,
      after() {
        // Not formatted
      },
    },
    {
      name: 'Returning different identifiers',
      code: `
function foo() {
  if (Math.random()) {
    return bar;
  }
  return baz;
}
`,
      after() {
        // Not formatted
      },
    },
    {
      name: 'With a switch statement that always returns',
      code: `
function foo() {
  if (Math.random()) {
    switch (bar) {
      case 'a':
        return 1;
      case 'b':
        return 2;
      default:
        return 3;
    }
  }
  console.log('ok');
}
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Return value is the same for the early return and the final return #docs',
      code: `
function foo() {
  if (Math.random()) return null;
  return null;
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With several early returns',
      code: `
function foo() {
  if (Math.random()) return null;
  if (Math.random()) return null;
  return null;
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an arrow function',
      code: `
const foo = () => {
  if (Math.random()) return null;
  return null;
};
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a function expression',
      code: `
const foo = function () {
  if (Math.random()) return null;
  return null;
};
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'A convoluted example where return values are actually not invariant (but the condition is still unnecessary)',
      code: `
function foo() {
  let bar = 'ok';
  const changeBar = () => {
    if (Math.random() > 0.5) {
      bar = 'KO';
      return true;
    }
    return false;
  };

  if (changeBar()) return bar;
  return bar;
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With duplicated branches and empty returns #docs',
      code: `
function foo() {
  if (Math.random()) {
    console.log('ok');
    return;
  }
  console.log('ok');
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With duplicated branches and a comment in one of the branches',
      code: `
function foo() {
  if (Math.random()) {
    // This comment only appears here
    console.log('ok');
    return;
  }
  console.log('ok');
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With duplicated branches and a comment inside statements in one of the branches',
      code: `
function foo() {
  if (Math.random()) {
    console.log('ok1');
    // This comment only appears here
    console.log('ok2');
    return;
  }
  console.log('ok1');
  console.log('ok2');
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With duplicated branches and empty returns (with a redundant return statement in the subsequent branch)',
      code: `
function foo() {
  if (Math.random()) {
    console.log('ok');
    return;
  }
  console.log('ok');
  return;
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With two empty returns',
      code: `
function foo() {
  if (Math.random()) return;
  return;
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With duplicate `if`/`else` blocks',
      code: `
function foo() {
  if (Math.random()) {
    if (Math.cos(0)) {
      return 42;
    } else {
      return 105;
    }
  }
  if (Math.cos(0)) {
    return 42;
  } else {
    return 105;
  }
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With duplicate `try`/`catch` blocks',
      code: `
function foo() {
  if (Math.random()) {
    try {
      return JSON.parse('{}');
    } catch {
      return 105;
    }
  }
  try {
    return JSON.parse('{}');
  } catch {
    return 105;
  }
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With duplicate `try`/`finally` blocks, always returning in `try` block',
      code: `
function foo() {
  if (Math.random()) {
    try {
      return JSON.parse('{}');
    } finally {
      console.log(105);
    }
  }
  try {
    return JSON.parse('{}');
  } finally {
    console.log(105);
  }
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With duplicate `try`/`finally` blocks, always returning in `finally` block',
      code: `
function foo() {
  if (Math.random()) {
    try {
      JSON.parse('{}');
    } finally {
      return 105;
    }
  }
  try {
    JSON.parse('{}');
  } finally {
    return 105;
  }
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With duplicate `try`/`catch`/`finally` blocks, always returning in `try`/`catch`',
      code: `
function foo() {
  if (Math.random()) {
    try {
      return JSON.parse('{}');
    } catch {
      return 105;
    } finally {
      console.log('done');
    }
  }
  try {
    return JSON.parse('{}');
  } catch {
    return 105;
  } finally {
    console.log('done');
  }
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Leading or trailing space is trimmed from statements',
      code: `
function foo() {
  if (Math.random()) {
    console.log('ok');    
    console.log('ok');
    return;
  }
  console.log('ok');
  console.log('ok');
  return;
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        // Not formatted
      },
    },
    {
      name: 'With a `for` loop',
      code: `
function foo() {
  if (Math.random()) {
    for (;;) {
      console.log('ok');
      console.log('ok');
    }
    return;
  }
  for (;;) {
    console.log('ok');
    console.log('ok');
  }
  return;
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `for of` loop',
      code: `
function foo() {
  if (Math.random()) {
    for (const _ of []) {
      console.log('ok');
      console.log('ok');
    }
    return;
  }
  for (const _ of []) {
    console.log('ok');
    console.log('ok');
  }
  return;
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `for in` loop',
      code: `
function foo() {
  if (Math.random()) {
    for (const _ in {}) {
      console.log('ok');
      console.log('ok');
    }
    return;
  }
  for (const _ in {}) {
    console.log('ok');
    console.log('ok');
  }
  return;
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `while` loop',
      code: `
function foo() {
  if (Math.random()) {
    while (0) {
      console.log('ok');
      console.log('ok');
    }
    return;
  }
  while (0) {
    console.log('ok');
    console.log('ok');
  }
  return;
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `do while` loop',
      code: `
function foo() {
  if (Math.random()) {
    do {
      console.log('ok');
      console.log('ok');
    } while (0);
    return;
  }
  do {
    console.log('ok');
    console.log('ok');
  } while (0);
  return;
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'The rule does not depend on consistent formatting',
      code: `
function foo() {
  if (Math.random()) return "";
  return '';
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        // Not formatted
      },
    },
    {
      name: 'The rule does not depend on consistent spacing',
      code: `
function foo() {
  if (Math.random()) return  '';
  return '';
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        // Not formatted
      },
    },
    {
      name: 'Comparing statements with TypeScript nodes',
      code: `
function foo() {
  if (Math.random()) {
    return 'foo' as any;
  }
  return 'foo' as any;
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Comparing statements with TypeScript nodes and inconsistent formatting',
      code: `
function foo() {
  if (Math.random()) {
    return "foo" as any;
  }
  return 'foo' as any;
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        // Not formatted
      },
    },
    {
      name: 'TypeScript nodes - assignment expression',
      code: `
let bar;
function foo() {
  if (Math.random()) {
    bar = "bar" as any;
    return;
  }
  bar = 'bar' as any;
  return;
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        // Not formatted
      },
    },
    {
      name: 'TypeScript nodes - conditional expression',
      code: `
function foo() {
  if (Math.random()) {
    return 1 ? "bar" as any : "foo" as any;
  }
  return 1 ? 'bar' as any : 'foo' as any;
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        // Not formatted
      },
    },
    {
      name: 'TypeScript nodes - chain expression',
      code: `
function foo() {
  if (Math.random()) {
    return ("bar" as any)?.toUpperCase();
  }
  return ('bar' as any)?.toUpperCase();
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        // Not formatted
      },
    },
  ],
});
