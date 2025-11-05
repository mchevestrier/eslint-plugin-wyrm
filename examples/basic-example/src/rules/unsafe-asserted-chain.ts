/* eslint-disable sonarjs/function-return-type */

export function unsafeAssertedChain() {
  shoutingCase(undefined);
}

interface Obj {
  msg: string | number;
}

function shoutingCase(foo: Obj | undefined): string | number | undefined {
  if (isNumberVariant(foo)) return foo?.msg;
  // eslint-disable-next-line wyrm/unsafe-asserted-chain
  const msg = foo?.msg as string;
  return msg.toUpperCase();
}

function isNumberVariant(foo: Obj | undefined) {
  return typeof foo?.msg === 'number';
}
