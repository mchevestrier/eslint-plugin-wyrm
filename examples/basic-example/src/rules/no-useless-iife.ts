/* eslint-disable @typescript-eslint/require-await, sonarjs/no-identical-functions */

// eslint-disable-next-line wyrm/no-useless-iife
export const noUselessIife1 = (() => 2)();

export async function noUselessIife2() {
  // eslint-disable-next-line wyrm/no-useless-iife
  await (async () => {
    await Promise.resolve(42);
    await Promise.resolve(105);
  })();
}

export async function noUselessIife3() {
  void (async () => {
    await Promise.resolve(42);
    await Promise.resolve(105);
  })();
}

export function noUselessIife4() {
  void (async () => {
    await Promise.resolve(42);
    await Promise.resolve(105);
  })();
}

export async function noUselessIife5() {
  const result = await (async () => {
    await Promise.resolve(42);
    return await Promise.resolve(105);
  })();

  return result;
}
