export function NoTernaryReturn(cond: boolean) {
  // eslint-disable-next-line wyrm/no-ternary-return
  return cond ? (
    <div>
      <div>True</div>
    </div>
  ) : (
    <div>
      <div>False</div>
    </div>
  );
}
