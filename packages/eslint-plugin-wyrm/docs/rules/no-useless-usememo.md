# Forbid useless `useMemo()` (`wyrm/no-useless-usememo`)

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

Useless `useMemo()`:

```tsx
function MyComponent() {
  const foo = useMemo(() => 42, []);

  return foo;
}
```

Useless `useMemo()`: just returning an identifier:

```tsx
function MyComponent() {
  const [baz, setBaz] = useState(42);
  const foo = useMemo(() => baz, [baz]);

  return foo;
}
```

### Correct ✅

Useful `useMemo()` - with dependencies:

```tsx
function MyComponent() {
  const [baz, setBaz] = useState(42);
  const foo = useMemo(() => baz * 2, [baz]);

  return foo;
}
```

Useful `useMemo()` - doing actual work:

```tsx
import { factorial } from './factorial';

function MyComponent() {
  const foo = useMemo(() => factorial(20), []);

  return foo;
}
```

<!-- end auto-generated rule header -->

## Related

- [`react-hooks/exhaustive-deps`](https://react.dev/reference/eslint-plugin-react-hooks/lints/exhaustive-deps)
- [`react-hooks/rules-of-hooks`](https://react.dev/reference/eslint-plugin-react-hooks/lints/rules-of-hooks)
- [`react-x/no-unnecessary-use-memo`](https://www.eslint-react.xyz/docs/rules/no-unnecessary-use-memo)
