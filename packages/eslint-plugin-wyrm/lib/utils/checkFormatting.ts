/* eslint-disable unicorn/no-instanceof-builtins, sonarjs/no-primitive-wrappers */

/* v8 ignore file -- @preserve */

import type { InvalidTestCase, ValidTestCase } from '@typescript-eslint/rule-tester';
import { diffStringsUnified } from 'jest-diff';
import * as prettier from 'prettier';
import { afterAll } from 'vitest';

type TestCase = { name: string; code: string };
const testCases: TestCase[] = [];

type AnyTestCase =
  | string
  // To be able to call checkFormatting(this) without too much TypeScript clutter
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  | String
  | ValidTestCase<readonly unknown[]>
  | InvalidTestCase<string, readonly unknown[]>;

/** Ensure that code samples respect formatting */
export function checkFormatting(testCase: AnyTestCase) {
  // Ignore formatting checks in mutation testing
  if (typeof process.env['STRYKER_MUTATOR'] !== 'undefined') return;

  const code = extractSourceFromTestCase(testCase);
  const name = extractNameFromTestCase(testCase) ?? code;
  testCases.push({ code, name });
}

function extractSourceFromTestCase(testCase: AnyTestCase): string {
  if (typeof testCase === 'string') return testCase;
  if (testCase instanceof String) return testCase.toString();
  return testCase.code;
}

function extractNameFromTestCase(testCase: AnyTestCase): string | undefined {
  if (typeof testCase === 'string') return undefined;
  if (testCase instanceof String) return undefined;
  return testCase.name;
}

afterAll(async () => {
  for (const testCase of testCases) {
    await checkWithPrettier(testCase);
  }
});

async function checkWithPrettier(testCase: TestCase) {
  const { name, code } = testCase;

  const baseConfig = await prettier.resolveConfig(import.meta.dirname);
  const config: prettier.Config = {
    ...baseConfig,
    parser: 'typescript',
  };

  const formatted = await prettier.format(code, config);
  const formattedWithNewLine = `\n${formatted}`;

  if (formattedWithNewLine === code) return;

  const diff = diffStringsUnified(formattedWithNewLine, code);

  const msg = `
> "${name}"
Code sample is not properly formatted:
--------------
${diff}
--------------
Please update the test case code to respect proper formatting.
`;

  throw Error(msg);
}
