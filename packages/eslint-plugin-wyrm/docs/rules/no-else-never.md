# wyrm/no-else-never

📝 Forbid unnecessary `else` block after an expression that never returns.

💼 This rule is enabled in the ☑️ `strictTypeChecked` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

## Cases

### Incorrect ❌

Unnecessary `else` block after returning `never`:

```tsx
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) throwsError();
else foo();

// Automatically fixed to:
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) throwsError();
foo();
```

### Correct ✅

No `else` block necessary:

```tsx
function throwsError(): never {
  throw Error('Oh no');
}

if (cond) throwsError();
foo();
```

<!-- end auto-generated rule header -->
