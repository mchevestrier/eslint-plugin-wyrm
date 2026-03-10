# wyrm/jsx-tostring

📝 Forbid calling `.toString()` inside JSX expressions containers.

💼 This rule is enabled in the ☑️ `strictTypeChecked` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

## Cases

### Incorrect ❌

Calling `.toString()` on a number in a JSX expression container:

```tsx
function MyComponent() {
  const n = 42;
  return <div>{n.toString()}</div>;
}

// Automatically fixed to:
function MyComponent() {
  const n = 42;
  return <div>{n}</div>;
}
```

### Correct ✅

Plain number in a JSX expression container:

```tsx
function MyComponent() {
  const n = 42;
  return <div>{n}</div>;
}
```

Calling `.toString()` on a number when the parent component only takes string children:

```tsx
type ParentComponentProps = {
  children: string;
};

function ParentComponent({ children }: ParentComponentProps) {
  return children;
}

function MyComponent() {
  const n = 42;
  return <ParentComponent>{n.toString()}</ParentComponent>;
}
```

<!-- end auto-generated rule header -->
