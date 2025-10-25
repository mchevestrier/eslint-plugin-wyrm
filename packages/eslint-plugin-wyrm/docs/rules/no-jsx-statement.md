# Forbid JSX expression statements (`wyrm/no-jsx-statement`)

💼 This rule is enabled in the following configs: ✅ `wyrm/recommended`, ☑️ `wyrm/recommendedTypeChecked`, 🟢 `wyrm/strict`, 🟣 `wyrm/strictTypeChecked`.

## Cases

### Incorrect ❌

```tsx
// JSX fragment in expression statement

export function MyComponent() {
  <></>;
}
```

### Correct ✅

```tsx
// JSX element in return statement

export function MyComponent() {
  return <div />;
}
```

```tsx
// JSX element in variable initialization

export function MyComponent() {
  const jsx = <div />;
  return jsx;
}
```

<!-- end auto-generated rule header -->
