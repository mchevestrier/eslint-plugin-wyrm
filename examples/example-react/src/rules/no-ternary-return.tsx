interface NoTernaryReturnProps {
  cond?: boolean;
}

export function NoTernaryReturn({ cond }: NoTernaryReturnProps) {
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
