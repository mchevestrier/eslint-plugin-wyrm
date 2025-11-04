export function noElseThrow(n: number) {
  if (!n) throw Error('I do not like this number!');
  // eslint-disable-next-line wyrm/no-else-throw
  else console.log(n);
}
