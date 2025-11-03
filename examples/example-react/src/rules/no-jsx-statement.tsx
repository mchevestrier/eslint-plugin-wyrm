export function NoJsxStatement() {
  // eslint-disable-next-line wyrm/no-jsx-statement
  <div>This is a JSX statement</div>;

  // eslint-disable-next-line wyrm/no-jsx-statement
  <>A JSX statement inside a fragment</>;

  return (
    <div>
      <div>NoJsxStatement</div>
    </div>
  );
}
