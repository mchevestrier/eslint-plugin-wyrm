import { useState, useRef, useEffect, startTransition } from 'react';

export function GenericConstructorWithHook() {
  // eslint-disable-next-line wyrm/generic-constructor-with-hook
  const [foo, setFoo] = useState<Map<string, string>>(() => new Map());
  // eslint-disable-next-line wyrm/generic-constructor-with-hook
  const ref = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (ref.current.has('')) {
      startTransition(() => {
        setFoo((old) => new Map(old).set('foo', 'bar'));
      });
    }
  }, []);

  return (
    <>
      <div>{foo.get('foo')}</div>
    </>
  );
}
