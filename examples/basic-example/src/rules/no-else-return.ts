/* eslint-disable unicorn/prefer-ternary */
/* eslint-disable wyrm/no-unbound-catch-error, wyrm/prefer-early-return */

export function noElseReturn1(n: number) {
  if (!n) return 'ok';
  // eslint-disable-next-line wyrm/no-else-return, no-else-return
  else return 'no';
}

export function noElseReturn2(n: number) {
  if (!n) return;
  // eslint-disable-next-line wyrm/no-else-return, no-else-return
  else console.log('no');
}

export function noElseReturn3(n: number) {
  if (!n) {
    console.log('ok');
    // eslint-disable-next-line sonarjs/no-redundant-jump
    return;
  }
  // eslint-disable-next-line wyrm/no-else-return, no-else-return
  else console.log('no');
}

export function noElseReturn4(n: number) {
  if (!n) {
    console.log('ok');
    return 'ok';
  }
  // eslint-disable-next-line wyrm/no-else-return, no-else-return
  else if (n === 3) console.log('no');
  return 'no';
}

export function noElseReturn5(n: number) {
  if (!n) {
    console.log('ok');
    // eslint-disable-next-line sonarjs/no-redundant-jump
    return;
  }
  // eslint-disable-next-line wyrm/no-else-return, no-else-return
  else if (n === 3) console.log('no');
}

export function noElseReturn6(n: number) {
  if (!n) return;
  // eslint-disable-next-line wyrm/no-else-return, no-else-return
  else if (n === 3) console.log('no');
}

export function noElseReturn7(n: number) {
  if (n === 42) {
    try {
      return JSON.stringify(n);
    } catch {
      return '0';
    }
    // eslint-disable-next-line wyrm/no-else-return
  } else {
    return '105';
  }
}
