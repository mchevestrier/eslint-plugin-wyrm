const obj = {};
// oxlint-disable-next-line no-base-to-string
export const str = obj.toString();

// oxlint-disable-next-line wyrm/no-commented-out-comment
// // foo

// oxlint-disable-next-line wyrm/no-invalid-date-literal
export const bar = new Date('20-07-1969');

const quux = 42;
export const fnord = quux.valueOf();
