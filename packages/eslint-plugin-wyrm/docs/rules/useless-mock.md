# wyrm/useless-mock

📝 Forbid useless mocks in tests.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

Useless Jest module mock:

```tsx
jest.mock('./foo', () => {
  return jest.requireActual('./foo');
});
```

Useless Vitest module mock:

```tsx
vi.mock('foo', async (importOriginal) => {
  return await importOriginal();
});
```

### Correct ✅

Useful Jest mock:

```tsx
jest.mock('./foo', () => {
  const mod = jest.requireActual('./foo');
  return {
    ...mod,
    fooFunction: jest.fn(),
  };
});
```

Useful Jest mock with mocked module:

```tsx
jest.mock('./foo', () => {
  const mod = jest.requireActual('./mocked-foo');
  return mod;
});
```

<!-- end auto-generated rule header -->
