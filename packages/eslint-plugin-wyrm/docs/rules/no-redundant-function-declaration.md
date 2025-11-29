# Forbid redundant function declarations (`wyrm/no-redundant-function-declaration`)

💼 This rule is enabled in the following configs: 🟩 `recommended`, ✅ `recommendedTypeChecked`, 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

Redundant function declaration with the same name:

```tsx
const foo = function foo() {};

// Automatically fixed to:
function foo() {}
```

Redundant function declaration with different names:

```tsx
const foo = function bar() {};

// Automatically fixed to:
function foo() {}
```

### Correct ✅

Normal function declaration:

```tsx
function foo() {}
```

<!-- end auto-generated rule header -->
