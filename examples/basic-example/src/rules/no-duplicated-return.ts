/* eslint-disable sonarjs/pseudo-random */

export function noDuplicatedReturn() {
  if (Math.sin(0)) return 'bar';

  if (Math.cos(0)) {
    // eslint-disable-next-line wyrm/no-duplicated-return
    return 'foo';
  }
  // eslint-disable-next-line wyrm/no-duplicated-return
  return 'foo';
}

/** A convoluted example where return values are actually not invariant (but the condition is still unnecessary) */
export function noDuplicatedReturn2() {
  let bar = 'ok';
  const changeBar = () => {
    if (Math.random() <= 0.5) {
      return false;
    }
    bar = 'KO';
    return true;
  };

  // eslint-disable-next-line sonarjs/no-all-duplicated-branches
  if (changeBar()) console.log(bar);
  else console.log(bar);

  // eslint-disable-next-line wyrm/no-duplicated-return
  if (changeBar()) return bar;
  // eslint-disable-next-line wyrm/no-duplicated-return
  return bar;
}

export function noDuplicatedReturn3() {
  if (Math.sin(0)) return 'bar';

  if (Math.cos(0)) {
    return 'foo';
  }

  console.log('ok');
  return 'foo';
}

export function noDuplicatedReturn4() {
  if (Math.sin(0)) return 'bar';

  // eslint-disable-next-line wyrm/prefer-early-return
  if (Math.cos(0)) {
    console.log('ok');
    return 'foo';
  }

  return 'foo';
}
