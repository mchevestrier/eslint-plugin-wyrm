import { RuleTester } from '@typescript-eslint/rule-tester';

import { checkFormatting } from '../utils/checkFormatting.js';

import rule, { name } from './useless-mock.js';

const ruleTester = new RuleTester();

ruleTester.run(name, rule, {
  valid: [
    {
      name: 'Useful Jest mock #docs',
      code: `
jest.mock('./foo', () => {
  const mod = jest.requireActual('./foo');
  return {
    ...mod,
    fooFunction: jest.fn(),
  };
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'No argument',
      code: `
jest.mock();
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Only one argument',
      code: `
jest.mock('./foo');
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With no return',
      code: `
jest.mock('./foo', () => {});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Callee property is not an identifier',
      code: `
vi['mock']('./foo', async (importOriginal) => await importOriginal());
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'No specifier',
      code: `
const fooModule = './foo';
vi.mock(fooModule, async (importOriginal) => await importOriginal());
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Returning an undeclared identifier',
      code: `
vi.mock('./foo', async (importOriginal) => mod);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Returning an imported identifier',
      code: `
import mod from './fooMock';
vi.mock('./foo', async (importOriginal) => mod);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Returning an uninitialized identifier',
      code: `
vi.mock('./foo', async (importOriginal) => {
  let mod;
  return mod;
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful Jest mock with mocked module #docs',
      code: `
jest.mock('./foo', () => {
  const mod = jest.requireActual('./mocked-foo');
  return mod;
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful Jest mock with mocked module (direct return)',
      code: `
jest.mock('./foo', () => {
  return jest.requireActual('./mocked-foo');
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful Jest mock (module is possibly mutated)',
      code: `
jest.mock('moment-timezone', () => {
  const moment = jest.requireActual('moment-timezone');
  moment.tz.setDefault('America/Los_Angeles');
  return moment;
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful Jest mock (module is directly called)',
      code: `
jest.mock('moment-timezone', () => {
  const moment = jest.requireActual('moment-timezone');
  moment();
  return moment;
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful Jest mock (module is reassigned)',
      code: `
jest.mock('moment-timezone', () => {
  const moment = jest.requireActual('moment-timezone');
  moment.tz = { setDefault() {} };
  return moment;
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful Vitest mock',
      code: `
vi.mock('./foo', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    fooFunction: vi.fn(),
  };
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful object property',
      code: `
vi.mock('./foo', async (importOriginal) => {
  const mod = await importOriginal();
  const notMod = { fooFunction() {} };
  return {
    ...mod,
    fooFunction: notMod.fooFunction,
  };
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useful Vitest mock (with one useless property and one useful property)',
      code: `
vi.mock('./foo', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    fooFunction: vi.fn(mod.fooFunction),
    barFunction: vi.fn(),
  };
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Without a function literal',
      code: `
const func = async (importOriginal) => {
  return await importOriginal();
};
vi.mock('./foo', func);
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Returning an empty object literal',
      code: `
vi.mock('./foo', async (importOriginal) => {
  return {};
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Object key is not an identifier',
      code: `
vi.mock('./foo', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ['fooFunction']: vi.fn(mod.fooFunction),
  };
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an `if` statement',
      code: `
vi.mock('./foo', async (importOriginal) => {
  if (Math.random()) {
    return await importOriginal();
  } else {
    return {};
  }
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `try` block',
      code: `
vi.mock('./foo', async (importOriginal) => {
  try {
    return {};
  } catch {
    return await importOriginal();
  }
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `catch`',
      code: `
vi.mock('./foo', async (importOriginal) => {
  try {
    return importOriginal();
  } catch {
    return {};
  } finally {
    return await importOriginal();
  }
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `finally`',
      code: `
vi.mock('./foo', async (importOriginal) => {
  try {
    return await importOriginal();
  } catch {
    return importOriginal();
  } finally {
    return {};
  }
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `do...while` loop',
      code: `
vi.mock('./foo', async (importOriginal) => {
  do {
    return {};
  } while (Math.random());
  return await importOriginal();
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `while` loop',
      code: `
vi.mock('./foo', async (importOriginal) => {
  while (Math.random()) {
    return {};
  }
  return await importOriginal();
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `for` loop',
      code: `
vi.mock('./foo', async (importOriginal) => {
  for (let i = 0; i < 10; i++) {
    return {};
  }
  return await importOriginal();
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `for...in` loop',
      code: `
vi.mock('./foo', async (importOriginal) => {
  for (const x in {}) {
    return {};
  }
  return await importOriginal();
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `for...of` loop',
      code: `
vi.mock('./foo', async (importOriginal) => {
  for (const x of []) {
    return {};
  }
  return await importOriginal();
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `switch` statement',
      code: `
vi.mock('./foo', async (importOriginal) => {
  switch (Math.random()) {
    case 1:
      return await importOriginal();
    case 2:
      return await importOriginal();
    default:
      return await importOriginal();
  }
  return {};
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `switch` statement (one case is useful)',
      code: `
vi.mock('./foo', async (importOriginal) => {
  switch (Math.random()) {
    case 1:
      return {};
    case 2:
      return await importOriginal();
    default:
      return await importOriginal();
  }
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `switch` statement (the default case is useful)',
      code: `
vi.mock('./foo', async (importOriginal) => {
  switch (Math.random()) {
    case 1:
      return await importOriginal();
    case 2:
      return await importOriginal();
    default:
      return {};
  }
});
`,
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `switch` statement with no `default` case',
      code: `
vi.mock('./foo', async (importOriginal) => {
  switch (Math.random()) {
    case 1:
      return await importOriginal();
    case 2:
      return await importOriginal();
  }
  return {};
});
`,
      after() {
        checkFormatting(this);
      },
    },
  ],
  invalid: [
    {
      name: 'Useless Jest module mock #docs',
      code: `
jest.mock('./foo', () => {
  return jest.requireActual('./foo');
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useless Jest module mock (with inline body)',
      code: `
jest.mock('./foo', () => jest.requireActual('./foo'));
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useless Jest module mock (with assignment)',
      code: `
jest.mock('./foo', () => {
  const mod = jest.requireActual('./foo');

  return mod;
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With object spread and no additional property',
      code: `
jest.mock('./foo', () => {
  const mod = jest.requireActual('./foo');
  return {
    ...mod,
  };
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With object spread and another function mocked to its actual implementation',
      code: `
jest.mock('./foo', () => {
  const mod = jest.requireActual('./foo');
  return {
    ...mod,
    fooFunction: jest.fn(mod.fooFunction),
  };
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With assignment in outer scope',
      code: `
const mod = jest.requireActual('./foo');
jest.mock('./foo', () => {
  return mod;
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a function expression',
      code: `
jest.mock('./foo', function () {
  const mod = jest.requireActual('./foo');
  return mod;
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useless Vitest module mock #docs',
      code: `
vi.mock('foo', async (importOriginal) => {
  return await importOriginal();
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useless Vitest module mock (with import())',
      code: `
vi.mock(import('foo'), async (importOriginal) => {
  return await importOriginal();
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useless Vitest mock (direct return)',
      code: `
vi.mock('./foo', async (importOriginal) => {
  return importOriginal();
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useless Vitest mock (with assignment)',
      code: `
vi.mock('./foo', async (importOriginal) => {
  const mod = await importOriginal();
  return mod;
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useless Vitest mock (with object spread)',
      code: `
vi.mock('./foo', async (importOriginal) => {
  const mod = await importOriginal();
  return { ...mod };
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useless Vitest mock (with object spread and additional useless property)',
      code: `
vi.mock('./foo', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    fooFunction: vi.fn(mod.fooFunction),
  };
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With useless property calling importOriginal again',
      code: `
vi.mock('./foo', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    fooFunction: vi.fn((await importOriginal()).fooFunction),
  };
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With useless property calling requireActual again',
      code: `
jest.mock('./foo', () => {
  const mod = jest.requireActual('./foo');
  return {
    ...mod,
    fooFunction: jest.fn(jest.requireActual('./foo').fooFunction),
  };
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useless property without jest.fn()',
      code: `
jest.mock('./foo', () => {
  const mod = jest.requireActual('./foo');
  return {
    ...mod,
    fooFunction: jest.requireActual('./foo').fooFunction,
  };
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useless property without vi.fn()',
      code: `
vi.mock('./foo', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    fooFunction: mod.fooFunction,
  };
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With just a useless property',
      code: `
vi.mock('./foo', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    fooFunction: vi.fn(mod.fooFunction),
  };
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'Useless Jest mock (module is not possibly mutated)',
      code: `
jest.mock('moment-timezone', () => {
  const moment = jest.requireActual('moment-timezone');
  moment.tz.setDefault;
  return moment;
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `as`',
      code: `
vi.mock('./foo', (async (importOriginal) => {
  return await importOriginal();
}) as any);
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `satisfies`',
      code: `
vi.mock('./foo', (async (importOriginal) => {
  return await importOriginal();
}) satisfies any);
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With an `if` statement',
      code: `
vi.mock('./foo', async (importOriginal) => {
  if (Math.random()) {
    return await importOriginal();
  } else {
    return importOriginal();
  }
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `try` block',
      code: `
vi.mock('./foo', async (importOriginal) => {
  try {
    return await importOriginal();
  } catch {
    return importOriginal();
  }
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With `finally`',
      code: `
vi.mock('./foo', async (importOriginal) => {
  try {
    return await importOriginal();
  } catch {
    return importOriginal();
  } finally {
    return await importOriginal();
  }
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `do...while` loop',
      code: `
vi.mock('./foo', async (importOriginal) => {
  do {
    if (Math.random()) return await importOriginal();
  } while (Math.random());
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `while` loop',
      code: `
vi.mock('./foo', async (importOriginal) => {
  while (Math.random()) {
    if (Math.random()) return await importOriginal();
  }
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `for` loop',
      code: `
vi.mock('./foo', async (importOriginal) => {
  for (let i = 0; i < 10; i++) {
    if (Math.random()) return await importOriginal();
  }
  return await importOriginal();
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `for...in` loop',
      code: `
vi.mock('./foo', async (importOriginal) => {
  for (const x in {}) {
    if (Math.random()) return await importOriginal();
  }
  return await importOriginal();
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `for...of` loop',
      code: `
vi.mock('./foo', async (importOriginal) => {
  for (const x of []) {
    if (Math.random()) return await importOriginal();
  }
  return await importOriginal();
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `switch` statement',
      code: `
vi.mock('./foo', async (importOriginal) => {
  switch (Math.random()) {
    case 1:
      return await importOriginal();
    case 2:
      if (Math.random()) return await importOriginal();
    default:
      return await importOriginal();
  }
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
    {
      name: 'With a `switch` statement with no `default` case',
      code: `
vi.mock('./foo', async (importOriginal) => {
  switch (Math.random()) {
    case 1:
      return await importOriginal();
    case 2:
      return await importOriginal();
  }
  return await importOriginal();
});
`,
      errors: [{ messageId: 'uselessMock' }],
      after() {
        checkFormatting(this);
      },
    },
  ],
});
