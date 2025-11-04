export function noElseContinue(arr: number[]) {
  for (const item of arr) {
    if (Math.cos(item)) continue;
    // eslint-disable-next-line wyrm/no-else-continue
    else console.log(item);
  }
}
