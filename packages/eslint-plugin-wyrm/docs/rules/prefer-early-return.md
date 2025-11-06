# Require early returns when possible (`wyrm/prefer-early-return`)

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

Condition with more code than the alternate branch:

```tsx
function foo(cond1: boolean, cond2: boolean) {
  if (cond1) {
    if (cond2) return 105;
    return 0;
  }
  return 42;
}
```

With a return statement in the alternate block only:

```tsx
function foo(cond1: boolean, cond2: boolean) {
  if (cond1) {
    if (cond2) {
      console.log(105);
    }
    console.log(0);
  } else {
    console.log('ok');
    return 42;
  }

  console.log(17);

  return 17;
}
```

### Correct ✅

With early returns:

```tsx
function foo(cond1: boolean, cond2: boolean) {
  if (!cond1) return 42;
  if (cond2) return 105;
  return 0;
}
```

<!-- end auto-generated rule header -->
