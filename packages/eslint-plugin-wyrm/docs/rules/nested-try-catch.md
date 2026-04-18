# wyrm/nested-try-catch

📝 Forbid nested try/catch statements.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

A try/catch statement inside another try block:

```tsx
try {
  try {
    foo();
  } catch {}
} catch {}
```

A try/catch statement inside a catch clause:

```tsx
try {
  foo();
} catch {
  try {
    foo();
  } catch {}
}
```

A try/catch statement inside a finally clause:

```tsx
try {
  foo();
} finally {
  try {
    foo();
  } catch {}
}
```

### Correct ✅

Simple try/catch block:

```tsx
try {
  foo();
} catch {}
```

A try/catch block inside a function inside a try/catch block:

```tsx
try {
  function bar() {
    try {
      foo();
    } catch {}
  }
} catch {}
```

<!-- end auto-generated rule header -->
