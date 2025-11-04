# Forbid suspicious semicolons in JSX (`wyrm/no-suspicious-jsx-semicolon`)

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

## Description

This rule detects the potential accidental insertion of a semicolon or comma in JSX when refactoring.

## Cases

### Incorrect ❌

A suspicious-looking semicolon:

```tsx
export function MyComponent() {
  return (
    <div>
      <div>With a trailing semicolon at the end of the line</div>;
    </div>
  );
}
```

A suspicious-looking comma:

```tsx
export function MyComponent() {
  return (
    <div>
      <div>With a trailing comma at the end of the line</div>,
    </div>
  );
}
```

### Correct ✅

No suspicious semicolon or comma:

```tsx
export function MyComponent() {
  return <div />;
}
```

<!-- end auto-generated rule header -->
