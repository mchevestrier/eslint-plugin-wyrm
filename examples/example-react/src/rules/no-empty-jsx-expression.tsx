export function NoEmptyJsxExpression() {
  return (
    <div>
      {/* eslint-disable-next-line wyrm/no-empty-jsx-expression */}
      {}
      <div>NoEmptyJsxExpression</div>
    </div>
  );
}
