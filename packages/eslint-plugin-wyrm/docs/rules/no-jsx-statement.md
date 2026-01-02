# wyrm/no-jsx-statement

📝 Forbid JSX expression statements.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

JSX element in expression statement:

```tsx
export function MyComponent() {
  <div />;
}
```

JSX fragment in expression statement:

```tsx
export function MyComponent() {
  <></>;
}
```

### Correct ✅

JSX element in return statement:

```tsx
export function MyComponent() {
  return <div />;
}
```

JSX element in variable initialization:

```tsx
export function MyComponent() {
  const jsx = <div />;
  return jsx;
}
```

<!-- end auto-generated rule header -->
