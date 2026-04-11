# wyrm/useless-conditional-assign

📝 Enforce directly returning a value instead of conditionally assigning it first to a variable.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

Simple conditional assignments:

```tsx
function foo() {
  let bar;

  if (Math.random()) {
    bar = 42;
  } else if (Math.random()) {
    bar = 105;
  } else {
    bar = null; // Cannot be fixed
    console.warn('Oh no');
  }

  // No other statements

  return bar;
}

// Automatically fixed to:
function foo() {
  let bar;

  if (Math.random()) {
    return 42;
  } else if (Math.random()) {
    return 105;
  } else {
    bar = null; // Cannot be fixed
    console.warn('Oh no');
  }

  // No other statements

  return bar;
}
```

### Correct ✅

With subsequent statements after the `if` statement:

```tsx
function foo() {
  let bar;

  if (Math.random()) {
    bar = 42;
  } else if (Math.random()) {
    bar = null;
  } else {
    bar = 42 + 105;
  }

  console.log(bar);

  return bar;
}
```

<!-- end auto-generated rule header -->
