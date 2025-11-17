declare const arr: string[];

// eslint-disable-next-line wyrm/no-sloppy-length-check
if (arr.length <= 0) {
  // noop
}

const s = new Set();
// eslint-disable-next-line wyrm/no-sloppy-length-check, sonarjs/no-collection-size-mischeck
if (s.size < 0) {
  // noop
}

// eslint-disable-next-line wyrm/no-sloppy-length-check
if (arr.length !== -1) {
  // noop
}

// prettier-ignore
// eslint-disable-next-line wyrm/no-sloppy-length-check
if (arr.length > 0 || arr.length === 0) { // oxlint-disable-line double-comparisons
  // noop
}

// prettier-ignore
// eslint-disable-next-line wyrm/no-sloppy-length-check, unicorn/explicit-length-check
if (0 < arr.length || arr.length === 0) { // oxlint-disable-line double-comparisons
  // noop
}

// eslint-disable-next-line wyrm/no-sloppy-length-check, unicorn/explicit-length-check
if (arr.length !== 0 && arr.length <= 0) {
  // noop
}

// eslint-disable-next-line wyrm/no-sloppy-length-check, unicorn/explicit-length-check
if (arr.length !== 0 && arr.length <= 0) {
  // noop
}

// prettier-ignore
// eslint-disable-next-line wyrm/no-sloppy-length-check
if (arr.length > 0 && arr.length <= 0) { // oxlint-disable-line const-comparisons
  // noop
}

// eslint-disable-next-line wyrm/no-sloppy-length-check, unicorn/explicit-length-check
if (arr.length > 0 || arr.length !== 0) {
  // noop
}

// eslint-disable-next-line wyrm/no-sloppy-length-check, unicorn/explicit-length-check
if (arr.length < 1 || arr.length > 0) {
  // noop
}

// eslint-disable-next-line unicorn/explicit-length-check
if (arr.length < 1) {
  // noop
}
