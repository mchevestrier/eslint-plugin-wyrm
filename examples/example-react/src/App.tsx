import './App.css';

import { SuspiciousSemicolon } from './rules/no-suspicious-jsx-semicolon';

function App() {
  return (
    <>
      <SuspiciousSemicolon />
    </>
  );
}

export default App;
