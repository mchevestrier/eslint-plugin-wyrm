interface Bar {
  isOpen: boolean;
  tables: number[];
}

interface Foo {
  description: string;
}

export function distributeBooleanCast(
  bar: Bar | undefined,
  foo?: Foo,
  defaultDescription?: string,
): boolean {
  // eslint-disable-next-line wyrm/distribute-boolean-casts
  return !!(bar && bar.tables.length > 42 && (foo?.description ?? defaultDescription));
}
