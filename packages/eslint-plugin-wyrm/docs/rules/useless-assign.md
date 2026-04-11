# wyrm/useless-assign

📝 Enforce directly returning a value instead of assigning it first to a variable.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

Simple variable declaration:

```tsx
function foo() {
  const bar = 42 + 105;
  return bar;
}

// Automatically fixed to:
function foo() {
  return 42 + 105;
}
```

With several declarators:

```tsx
function foo() {
  const bar = 42 + 105,
    baz = 69;
  return bar;
}

// Automatically fixed to:
function foo() {
  const baz = 69;
  return 42 + 105;
}
```

With a multi-line expression and `allowMultiLine: false`:

```tsx
function foo() {
  const bar = [1, 2, 3, 4]
    .filter((n) => n % 2 === 0)
    .filter((n) => n > 2)
    .map((n) => n + 42);
  return bar;
}

// Automatically fixed to:
function foo() {
  return [1, 2, 3, 4]
    .filter((n) => n % 2 === 0)
    .filter((n) => n > 2)
    .map((n) => n + 42);
}
```

### Correct ✅

With a subsequent statement before the return statement:

```tsx
function foo() {
  const bar = 42 + 105;

  console.log(bar);

  return bar;
}
```

With `using`:

```tsx
function foo() {
  using bar = quux();
  return bar;
}
```

With a multi-line expression and `allowMultiLine: true`:

```tsx
function foo() {
  const bar = [1, 2, 3, 4]
    .filter((n) => n % 2 === 0)
    .filter((n) => n > 2)
    .map((n) => n + 42);
  return bar;
}
```

<!-- end auto-generated rule header -->

## Options

<!-- begin auto-generated rule options list -->

| Name             | Description                                                                         | Type    |
| :--------------- | :---------------------------------------------------------------------------------- | :------ |
| `allowMultiLine` | Whether to allow assigning multi-line expressions before returning. Default: `true` | Boolean |

<!-- end auto-generated rule options list -->
