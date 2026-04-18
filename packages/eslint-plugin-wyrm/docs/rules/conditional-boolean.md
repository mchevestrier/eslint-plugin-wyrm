# wyrm/conditional-boolean

📝 Forbid if/else branches where the only difference is a boolean literal.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

Conditional boolean in call expression argument:

```tsx
if (foo) {
  doStuff(true);
} else {
  doStuff(false);
}

// Automatically fixed to:
doStuff(!!foo);
```

Conditional assignment of a boolean literal:

```tsx
let bar;
if (foo) {
  bar = true;
} else {
  bar = false;
}

// Automatically fixed to:
let bar;
bar = !!foo;
```

### Correct ✅

Branch has differences other than boolean values:

```tsx
if (foo) {
  doStuff('yes', true);
} else {
  doStuff('no', false);
}
```

<!-- end auto-generated rule header -->

## Related

- ESLint: [`no-unneeded-ternary`](https://eslint.org/docs/latest/rules/no-unneeded-ternary)
