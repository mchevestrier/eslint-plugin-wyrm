export type VitestFailOnConsole = (args?: VitestFailOnConsoleFunction) => void;

type SkipTestFunction = ({
  testName,
  testPath,
}: {
  testName?: string;
  testPath?: string;
}) => boolean;
type ErrorMessageFunction = (methodName: ConsoleMethod) => string;
type AllowMessageFunction = (message: string, methodName: ConsoleMethod) => boolean;
type SilenceMessageFunction = (message: string, methodName: ConsoleMethod) => boolean;
declare enum ConsoleMethod {
  Assert = 'assert',
  Debug = 'debug',
  Error = 'error',
  Info = 'info',
  Log = 'log',
  Warn = 'warn',
}
type VitestFailOnConsoleFunction = {
  shouldFailOnAssert?: boolean;
  shouldFailOnDebug?: boolean;
  shouldFailOnError?: boolean;
  shouldFailOnInfo?: boolean;
  shouldFailOnLog?: boolean;
  shouldFailOnWarn?: boolean;
  skipTest?: SkipTestFunction;
  errorMessage?: ErrorMessageFunction;
  allowMessage?: AllowMessageFunction;
  silenceMessage?: SilenceMessageFunction;
  afterEachDelay?: number;
  shouldPrintMessage?: boolean;
};
