export function SuspiciousSemicolon() {
  return (
    <div>
      {/* eslint-disable-next-line wyrm/no-suspicious-jsx-semicolon */}
      <div>SuspiciousSemicolon</div>;
    </div>
  );
}
