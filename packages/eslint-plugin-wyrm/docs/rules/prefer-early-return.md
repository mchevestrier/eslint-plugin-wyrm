# wyrm/prefer-early-return

📝 Require early returns when possible.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

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

// Automatically fixed to:
function foo(cond1: boolean, cond2: boolean) {
  if (!cond1) {
    return 42;
  } else {
    if (cond2) return 105;
    return 0;
  }
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

// Automatically fixed to:
function foo(cond1: boolean, cond2: boolean) {
  if (!cond1) {
    console.log('ok');
    return 42;
  } else {
    if (cond2) {
      console.log(105);
    }
    console.log(0);
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

## Related

It is recommended that you also enable the following rules along with this one:

- ESLint: [`no-else-return`](https://eslint.org/docs/latest/rules/no-else-return)
- [`sonarjs/no-inverted-boolean-check`](https://sonarsource.github.io/rspec/#/rspec/S1940/javascript)
