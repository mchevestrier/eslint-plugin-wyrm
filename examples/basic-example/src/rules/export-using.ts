class FileLogger {
  private closed = false;

  constructor(private name: string) {
    console.log(`Opening file: ${this.name}`);
  }

  log(message: string) {
    if (this.closed) throw Error('Logger is closed!');
    console.log(`[${this.name}] ${message}`);
  }

  [Symbol.dispose]() {
    this.closed = true;
    console.log(`Closing file: ${this.name}`);
  }
}

// @ts-expect-error - 'export' modifier cannot appear on a 'using' declaration.
// eslint-disable-next-line wyrm/export-using
export using logger1 = new FileLogger('app1.log');

using logger2 = new FileLogger('app2.log');
// eslint-disable-next-line wyrm/export-using
export { logger2 };

using logger3 = new FileLogger('app3.log');
// eslint-disable-next-line wyrm/export-using
export default logger3;

export function exportUsing() {
  // Ok
  using logger = new FileLogger('app4.log');

  logger.log('Hello');
  logger.log('World');
}
