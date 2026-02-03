# wyrm/no-if-length-for

📝 Forbid redundant condition for positive length before a loop.

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

`for..of` loop with array length truthiness check:

```tsx
if (arr.length) {
  for (const x of arr) {
  }
}

// Automatically fixed to:
for (const x of arr) {
}
```

With `> 0`:

```tsx
if (arr.length > 0) {
  for (const x of arr) {
  }
}

// Automatically fixed to:
for (const x of arr) {
}
```

With `!== 0`:

```tsx
if (arr.length !== 0) {
  for (const x of arr) {
  }
}

// Automatically fixed to:
for (const x of arr) {
}
```

### Correct ✅

`for..of` loop with no condition:

```tsx
for (const x of arr) {
}
```

<!-- end auto-generated rule header -->
