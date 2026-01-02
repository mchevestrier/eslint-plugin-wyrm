# wyrm/no-empty-jsx-expression

📝 Forbid empty JSX expression containers.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

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

JSX expression container with only a literal `null`:

```tsx
function Foo() {
  return <div>{null}</div>;
}
```

JSX expression container with only a literal `undefined`:

```tsx
function Foo() {
  return <div>{undefined}</div>;
}
```

JSX expression container with only a literal `false`:

```tsx
function Foo() {
  return <div>{false}</div>;
}
```

JSX expression container with only a literal empty string:

```tsx
function Foo() {
  return <div>{''}</div>;
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
