# wyrm/no-huge-try-block

📝 Forbid huge try/catch blocks.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

`try` block spanning 21 lines:

```tsx
try {
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
} catch {}
```

### Correct ✅

`try` block spanning 20 lines:

```tsx
try {
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
  foo();
} catch {}
```

<!-- end auto-generated rule header -->

## Options

<!-- begin auto-generated rule options list -->

| Name              | Description                                                        | Type   |
| :---------------- | :----------------------------------------------------------------- | :----- |
| `maxCatchLines`   | Maximum number of lines for a `catch` block. Default: `Infinity`   | Number |
| `maxFinallyLines` | Maximum number of lines for a `finally` block. Default: `Infinity` | Number |
| `maxTryLines`     | Maximum number of lines for a `try` block. Default: `20`           | Number |

<!-- end auto-generated rule options list -->
