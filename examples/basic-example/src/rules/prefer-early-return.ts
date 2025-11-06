export function preferEarlyReturn(cond1: boolean, cond2: boolean) {
  // eslint-disable-next-line wyrm/prefer-early-return
  if (cond1) {
    if (cond2) {
      return 105;
    }
    return 0;
  }
  return 42;
}

// eslint-disable-next-line shopify/prefer-early-return
export function preferEarlyReturn2(a: string) {
  // eslint-disable-next-line wyrm/prefer-early-return
  if (a) {
    console.log(a);
    console.log(a.toUpperCase());
  }
}

export function preferEarlyReturn3(cond1: boolean, cond2: boolean) {
  // eslint-disable-next-line wyrm/prefer-early-return
  if (cond1) {
    if (cond2) {
      console.log(105);
    }
    console.log(0);
  } else {
    console.log('ok');
    return 42;
  }

  return 17;
}

export function preferEarlyReturn4(bar: { id: string; value: number }) {
  let foo;

  // eslint-disable-next-line wyrm/prefer-early-return
  if (bar.id === 'quux') {
    foo = bar.value;
  } else {
    console.error('oh no');
    return 42;
  }

  return foo;
}

export function preferEarlyReturn5(quux: string, x: string, y: string) {
  // eslint-disable-next-line wyrm/prefer-early-return
  if (quux === 'bar') {
    try {
      return x;
    } catch {
      // Nothing to see here
    }
    // or
    if (x) {
      return y;
    }
  }
  return 'quux';
}

export function preferEarlyReturn6(cond1: boolean, cond2: boolean) {
  // eslint-disable-next-line wyrm/prefer-early-return
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
    // eslint-disable-next-line unicorn/prefer-ternary
    if (Math.cos(0) > 0.5) return 333;
    // eslint-disable-next-line no-else-return
    else return 42;
  }

  return 17;
}

export function preferEarlyReturn7() {
  // eslint-disable-next-line wyrm/prefer-early-return
  if (Math.cos(0)) {
    console.log('ok');
  } else {
    try {
      return JSON.parse('""') as unknown;
    } catch (error) {
      console.error(error);
      return 'It failed';
    }
  }

  return 'ok';
}
