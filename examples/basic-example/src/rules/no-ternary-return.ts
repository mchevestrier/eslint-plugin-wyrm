/* eslint-disable sonarjs/no-selector-parameter, sonarjs/no-nested-conditional */
/* eslint-disable unicorn/no-nested-ternary */

export function noTernaryReturn(cond: boolean) {
  // eslint-disable-next-line wyrm/no-ternary-return
  return cond ? 42 : 105;
}

export function noTernaryReturn2(cond1: boolean, cond2: boolean) {
  // eslint-disable-next-line wyrm/no-ternary-return
  return cond1 ? 42 : cond2 ? 105 : 0;
}
