import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './no-duplicated-return.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'No duplicated return #docs',
      code: `function foo() {
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
      code: `function foo() {
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
      code: `function foo() {
  console.log('ok');
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: '`if` statement is the last statement',
      code: `function foo() {
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
      code: `function foo() {
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
      code: `function foo() {
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
      name: 'Currently the rule depends on consistent formatting',
      code: `function foo() {
  if (Math.random()) return "";
  return '';
}
`,
      after() {
        // Not formatted
      },
    },
    {
      name: 'With an arrow function and no block statement',
      code: `const foo = () => 42;
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With empty returns in consequent and alternate branches',
      code: `function foo() {
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
      code: `function foo() {
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
      code: `function foo() {
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
      code: `function foo() {
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
      code: `function foo() {
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
  ],
  invalid: [
    {
      name: 'Return value is the same for the early return and the final return #docs',
      code: `function foo() {
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
      code: `function foo() {
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
      code: `const foo = () => {
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
      code: `const foo = function () {
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
      code: `function foo() {
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
      code: `function foo() {
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
      code: `function foo() {
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
      name: 'With duplicated branches and empty returns (with a redundant return statement in the subsequent branch)',
      code: `function foo() {
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
      code: `function foo() {
  if (Math.random()) return;
  return;
}
`,
      errors: [{ messageId: 'noDuplicatedReturn' }, { messageId: 'noDuplicatedReturn' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
