// eslint-disable-next-line wyrm/prefer-repeat
export const threeStars = Array.from({ length: 3 }).reduce(
  (acc: string) => `${acc}*`,
  '',
);

// eslint-disable-next-line wyrm/prefer-repeat
export const fiveStars = Array(5)
  .fill(undefined)
  .reduce((acc: string) => acc.concat('*'), '');
