/* eslint-disable @typescript-eslint/prefer-nullish-coalescing, unicorn/prefer-default-parameters */

export function noExtraFalseFallback(cond1: boolean | undefined) {
  // eslint-disable-next-line wyrm/no-extra-false-fallback
  if (cond1 ?? false) {
    return 0;
  }

  return 42;
}

export function noExtraFalseFallback2(cond1: boolean | undefined) {
  // eslint-disable-next-line wyrm/no-extra-false-fallback, @typescript-eslint/no-unnecessary-condition, sonarjs/no-redundant-boolean
  if (cond1 || false) {
    return 0;
  }

  return 42;
}

export function noExtraFalseFallback3(cond1: string | undefined) {
  const test = cond1 || false;
  if (test) {
    return 0;
  }

  return 42;
}

export function noExtraFalseFallback4(arr: (string | null)[]) {
  // eslint-disable-next-line wyrm/no-extra-false-fallback
  return arr.some((item) => item ?? false);
}

export function noExtraFalseFallback5(arr: (string | undefined)[]) {
  // eslint-disable-next-line wyrm/no-extra-false-fallback, @typescript-eslint/no-unnecessary-condition
  return arr.some((item) => item || false);
}
