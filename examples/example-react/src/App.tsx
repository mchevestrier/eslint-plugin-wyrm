import './App.css';

import { GenericConstructorWithHook } from './rules/generic-constructor-with-hook';
import { NoEmptyJsxExpression } from './rules/no-empty-jsx-expression';
import { NoJsxStatement } from './rules/no-jsx-statement';
import { NoSuspiciousJsxSemicolon } from './rules/no-suspicious-jsx-semicolon';
import { NoTernaryReturn } from './rules/no-ternary-return';
import { NoUselessUseMemo } from './rules/no-useless-usememo';

function App() {
  return (
    <>
      <GenericConstructorWithHook />
      <NoEmptyJsxExpression />
      <NoJsxStatement />
      <NoSuspiciousJsxSemicolon />
      <NoTernaryReturn />
      <NoUselessUseMemo />
    </>
  );
}

export default App;
