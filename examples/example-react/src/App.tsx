import './App.css';

import { NoEmptyJsxExpression } from './rules/no-empty-jsx-expression';
import { NoJsxStatement } from './rules/no-jsx-statement';
import { SuspiciousSemicolon } from './rules/no-suspicious-jsx-semicolon';
import { NoTernaryReturn } from './rules/no-ternary-return';

function App() {
  return (
    <>
      <NoEmptyJsxExpression />
      <NoJsxStatement />
      <SuspiciousSemicolon />
      <NoTernaryReturn />
    </>
  );
}

export default App;
