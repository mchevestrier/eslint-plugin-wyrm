import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './prefer-early-return.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'With early returns #docs',
      code: `function foo(cond1: boolean, cond2: boolean) {
  if (!cond1) return 42;
  if (cond2) return 105;
  return 0;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With several statements in consequent block',
      code: `function foo(cond1: boolean, cond2: boolean) {
  if (!cond1) return 42;

  if (cond2) {
    console.log('ok');
    console.log('ok');
    console.log('ok');
    return 105;
  }

  return 0;
}
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a wrapping `if` statement with an alternate branch',
      code: `function foo(cond1: boolean) {
  if (cond1) {
    console.log(42);
    console.log(105);
  } else {
    console.log(0);
  }
}
`,
    },
    {
      name: 'With no returns in if statement at all',
      code: `function foo(cond1: boolean, cond2: boolean) {
  if (cond1) {
    if (cond2) {
      console.log(105);
    }

    try {
      console.log(0);
    } catch {
      // Nothing to see here
    }

    // or
    if (cond2) {
      console.log(cond1);
    }
  } else {
    if (Math.cos(0) > 0.5) console.log(333);
    console.log(42);
  }

  return 17;
}
`,
    },
  ],
  invalid: [
    {
      name: 'Condition with more code than the alternate branch #docs',
      code: `function foo(cond1: boolean, cond2: boolean) {
  if (cond1) {
    if (cond2) return 105;
    return 0;
  }
  return 42;
}
`,
      output: `function foo(cond1: boolean, cond2: boolean) {
  if (!(cond1)) {
    return 42;
  } else {
    if (cond2) return 105;
    return 0;
  }
  
}
`,
      errors: [{ messageId: 'preferEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With more statements',
      code: `function foo(cond1: boolean, cond2: boolean) {
  console.log('Hello');
  if (!Math.random()) return 17;

  if (cond1) {
    if (cond2) {
      return 105;
    }
    return 0;
  }
  console.log(42);
  return 42;
}
`,
      output: `function foo(cond1: boolean, cond2: boolean) {
  console.log('Hello');
  if (!Math.random()) return 17;

  if (!(cond1)) {
    console.log(42);
    return 42;
  } else {
    if (cond2) {
      return 105;
    }
    return 0;
  }
  
}
`,
      errors: [{ messageId: 'preferEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an arrow function',
      code: `const foo = (cond1: boolean, cond2: boolean) => {
  if (cond1) {
    if (cond2) return 105;
    return 0;
  }
  return 42;
};
`,
      output: `const foo = (cond1: boolean, cond2: boolean) => {
  if (!(cond1)) {
    return 42;
  } else {
    if (cond2) return 105;
    return 0;
  }
  
};
`,
      errors: [{ messageId: 'preferEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a function expression',
      code: `const foo = function (cond1: boolean, cond2: boolean) {
  if (cond1) {
    if (cond2) return 105;
    return 0;
  }
  return 42;
};
`,
      output: `const foo = function (cond1: boolean, cond2: boolean) {
  if (!(cond1)) {
    return 42;
  } else {
    if (cond2) return 105;
    return 0;
  }
  
};
`,
      errors: [{ messageId: 'preferEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a return statement in the alternate block only #docs',
      code: `function foo(cond1: boolean, cond2: boolean) {
  if (cond1) {
    if (cond2) {
      console.log(105);
    }
    console.log(0);
  } else {
    console.log('ok');
    return 42;
  }

  console.log(17);

  return 17;
}
`,
      output: `function foo(cond1: boolean, cond2: boolean) {
  if (!(cond1)) {
    console.log('ok');
    return 42;
  } else {
    if (cond2) {
      console.log(105);
    }
    console.log(0);
  }

  console.log(17);

  return 17;
}
`,
      errors: [{ messageId: 'preferEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a long consequent block and a short alternate block',
      code: `function foo(cond1: boolean, cond2: boolean) {
  if (cond1) {
    if (cond2) {
      console.log(105);
      return 105;
    }
    if (shouldLogZero()) {
      console.log(0);
    }

    return 17;

    // Return isn't always the last statement
    function shouldLogZero() {
      return Math.random() > 0.5;
    }
  } else {
    quux();
    return 42;
    function quux() {}
  }
}
`,
      output: `function foo(cond1: boolean, cond2: boolean) {
  if (!(cond1)) {
    quux();
    return 42;
    function quux() {}
  } else {
    if (cond2) {
      console.log(105);
      return 105;
    }
    if (shouldLogZero()) {
      console.log(0);
    }

    return 17;

    // Return isn't always the last statement
    function shouldLogZero() {
      return Math.random() > 0.5;
    }
  }
}
`,
      errors: [{ messageId: 'preferEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a wrapping if statement',
      code: `function foo(cond1: boolean) {
  if (cond1) {
    console.log(42);
    console.log(105);
  }
}
`,
      output: `function foo(cond1: boolean) {
  if (!(cond1)) { return; } else {
    console.log(42);
    console.log(105);
  }
}
`,
      errors: [{ messageId: 'preferEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With conditional returns in alternate branch only',
      code: `function foo(cond1: boolean, cond2: boolean) {
  if (cond1) {
    if (cond2) {
      console.log(105);
    }

    try {
      console.log(0);
    } catch {
      // Nothing to see here
    }

    // or
    if (cond2) {
      console.log(cond1);
    }
  } else {
    if (Math.cos(0) > 0.5) return 333;
    else return 42;
  }

  return 17;
}
`,
      output: `function foo(cond1: boolean, cond2: boolean) {
  if (!(cond1)) {
    if (Math.cos(0) > 0.5) return 333;
    else return 42;
  } else {
    if (cond2) {
      console.log(105);
    }

    try {
      console.log(0);
    } catch {
      // Nothing to see here
    }

    // or
    if (cond2) {
      console.log(cond1);
    }
  }

  return 17;
}
`,
      errors: [{ messageId: 'preferEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `try` statement in an `else` branch that always returns',
      code: `function foo(cond1: boolean, cond2: boolean) {
  if (cond1) {
    if (cond2) {
      console.log(105);
    }

    try {
      console.log(0);
    } catch {
      // Nothing to see here
    }

    // or
    if (cond2) {
      console.log(cond1);
    }
  } else {
    try {
      return JSON.parse('{}');
    } catch {
      return 'Oops';
    }
  }

  return 17;
}
`,
      output: `function foo(cond1: boolean, cond2: boolean) {
  if (!(cond1)) {
    try {
      return JSON.parse('{}');
    } catch {
      return 'Oops';
    }
  } else {
    if (cond2) {
      console.log(105);
    }

    try {
      console.log(0);
    } catch {
      // Nothing to see here
    }

    // or
    if (cond2) {
      console.log(cond1);
    }
  }

  return 17;
}
`,
      errors: [{ messageId: 'preferEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With too many statements in consequent block',
      code: `function foo(cond1: boolean, cond2: boolean) {
  if (!cond1) return 42;

  if (cond2) {
    console.log('ok');
    console.log('ok');
    console.log('ok');
    console.log('ok');
    return 105;
  }

  return 0;
}
`,
      output: `function foo(cond1: boolean, cond2: boolean) {
  if (!cond1) return 42;

  if (!(cond2)) {
    return 0;
  } else {
    console.log('ok');
    console.log('ok');
    console.log('ok');
    console.log('ok');
    return 105;
  }

  
}
`,
      errors: [{ messageId: 'preferEarlyReturn' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
