import { RuleTester } from '@typescript-eslint/rule-tester';
import * as vitest from 'vitest';

// See https://typescript-eslint.io/packages/rule-tester/#vitest

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.itSkip = vitest.it.skip;
RuleTester.describe = vitest.describe;
RuleTester.describeSkip = vitest.describe.skip;

// Fail on console

const { vi, beforeEach, afterEach, expect } = vitest;

function noop() {
  // noop
}

const methods: Array<keyof typeof console> = [
  'log',
  'assert',
  'debug',
  'info',
  'warn',
  'error',
];

beforeEach(() => {
  for (const method of methods) {
    vi.spyOn(console, method).mockImplementation(noop);
  }
});

afterEach(() => {
  for (const method of methods) {
    expect(vi.spyOn(console, method)).not.toHaveBeenCalled();
  }
});
