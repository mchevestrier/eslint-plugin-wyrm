# wyrm/generic-constructor-with-hook

📝 Forbid specifying the type arguments on the hook instead of on the generic class.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

## Cases

### Incorrect ❌

With a Map constructor as `useState` argument:

```tsx
const [foo, setFoo] = useState<Map<string, string>>(() => new Map());

// Automatically fixed to:
const [foo, setFoo] = useState(() => new Map<string, string>());
```

With a Set constructor as `useRef` argument:

```tsx
const foo = useRef<Set<string>>(new Set());

// Automatically fixed to:
const foo = useRef(new Set<string>());
```

Unnecessary type annotation for inferable type:

```tsx
const foo = useRef<Set<string>>(new Set<string>());

// Automatically fixed to:
const foo = useRef(new Set<string>());
```

### Correct ✅

With a generic Map constructor as `useState` argument, with an initialization function:

```tsx
const [foo, setFoo] = useState(() => new Map<string, string>());
```

With a generic Set constructor as `useRef` argument:

```tsx
const foo = useRef(new Set<string>());
```

<!-- end auto-generated rule header -->

## Options

<!-- begin auto-generated rule options list -->

| Name    | Description                                              | Type     |
| :------ | :------------------------------------------------------- | :------- |
| `hooks` | List of hooks to check. Default: `["useState","useRef"]` | String[] |

<!-- end auto-generated rule options list -->
