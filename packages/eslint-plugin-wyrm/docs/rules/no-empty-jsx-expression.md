# Forbid empty JSX expression containers (`wyrm/no-empty-jsx-expression`)

💼 This rule is enabled in the following configs: ✅ `recommended`, ☑️ `recommendedTypeChecked`, 🟢 `strict`, 🟣 `strictTypeChecked`.

## Cases

### Incorrect ❌

Empty JSX expression container:

```tsx
function Foo() {
  return (
    <div>
      {}
      Ok
    </div>
  );
}
```

### Correct ✅

JSX expression container is not empty:

```tsx
function Foo({ children }: PropsWithChildren) {
  return <div>{children}</div>;
}
```

JSX expression container with a comment:

```tsx
function Foo() {
  return (
    <div>
      {/* A comment */}
      Ok
    </div>
  );
}
```

<!-- end auto-generated rule header -->
