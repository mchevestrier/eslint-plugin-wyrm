import { RuleTester } from '@typescript-eslint/rule-tester';
import * as vitest from 'vitest';

// See https://typescript-eslint.io/packages/rule-tester/#vitest

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.itSkip = vitest.it.skip;
RuleTester.describe = vitest.describe;
RuleTester.describeSkip = vitest.describe.skip;
