import { RuleTester } from '@typescript-eslint/rule-tester';
import * as vitest from 'vitest';
import vitestFailOnConsole from 'vitest-fail-on-console';

import type { VitestFailOnConsole } from '../types/vitest-fail-on-console.js';

// See https://typescript-eslint.io/packages/rule-tester/#vitest

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.itSkip = vitest.it.skip;
RuleTester.describe = vitest.describe;
RuleTester.describeSkip = vitest.describe.skip;

// Imported types are broken
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const failOnConsole = vitestFailOnConsole as unknown as VitestFailOnConsole;

failOnConsole({
  shouldFailOnAssert: true,
  shouldFailOnDebug: true,
  shouldFailOnInfo: true,
  shouldFailOnWarn: true,
  shouldFailOnError: true,
});
