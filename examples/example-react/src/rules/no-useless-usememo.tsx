import { useMemo, useState } from 'react';

export function NoUselessUseMemo() {
  const [baz, setBaz] = useState(17);

  const uselessMemo = useMemo(() => {
    // eslint-disable-next-line wyrm/no-useless-usememo
    return foo;
  }, []);

  // eslint-disable-next-line wyrm/no-useless-usememo
  const uselessMemoWithCheapWork = useMemo(() => {
    return foo + 43;
  }, []);

  const usefulMemo = useMemo(() => {
    return work(foo);
  }, []);

  const usefulMemoWithProps = useMemo(() => {
    return baz + 105;
  }, [baz]);

  return (
    <>
      <div>{uselessMemo}</div>
      <div>{uselessMemoWithCheapWork}</div>
      <div>{usefulMemo}</div>
      <div>{usefulMemoWithProps}</div>

      <button
        type="button"
        onClick={() => {
          setBaz((old) => old + 1);
        }}
      >
        Please do not click me
      </button>
    </>
  );
}

const foo = 42;

function work(n: number) {
  return n * 1000;
}
