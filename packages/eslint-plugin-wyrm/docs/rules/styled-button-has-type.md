# wyrm/styled-button-has-type

📝 Disallow usage of `styled.button` without an explicit `type` attribute.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

## Description

This will only work if the styled component is declared in the same file where it is used.

## Cases

### Incorrect ❌

`styled.button` is missing a `type` attribute:

```tsx
export function MyComponent() {
  return <StyledButton />;
}

const StyledButton = styled.button``;
```

`styled('button')` is missing a `type` attribute:

```tsx
export function MyComponent() {
  return <StyledButton />;
}

const StyledButton = styled('button')``;
```

`styled.button` with invalid `type` attribute:

```tsx
export function MyComponent() {
  return <StyledButton type="foo" />;
}

const StyledButton = styled.button``;
```

### Correct ✅

`styled.button` with `type="button"`:

```tsx
export function MyComponent() {
  return <StyledButton type="button" />;
}

const StyledButton = styled.button``;
```

`styled.button` with `type="submit"`:

```tsx
export function MyComponent() {
  return <StyledButton type="submit" />;
}

const StyledButton = styled.button``;
```

`styled.div` without `type` attribute:

```tsx
export function MyComponent() {
  return <StyledButton />;
}

const StyledButton = styled.div``;
```

<!-- end auto-generated rule header -->
