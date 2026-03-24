# wyrm/e

📝 Forbid using `e` as a parameter name.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

## Description

In JS, the parameter name `e` is semantically overloaded: it is often used for errors, events, elements...
This rule forbids using `e` as a parameter name, in favor of more explicit identifiers like `err`, `evt` or `elt`.

## Cases

### Incorrect ❌

Using `e` as a parameter name in a function declaration:

```tsx
function foo(e: Error) {
  return e;
}

// Can be fixed to:
function foo(err: Error) {
  return err;
}
```

Using `e` as a parameter name in an arrow function expression:

```tsx
const handleClick = (e: Event) => {
  console.log(e.target.value);
};

// Can be fixed to:
const handleClick = (evt: Event) => {
  console.log(evt.target.value);
};
```

Using `e` as a parameter name in catch clause:

```tsx
try {
  foo();
} catch (e) {
  console.error(e);
}

// Can be fixed to:
try {
  foo();
} catch (err) {
  console.error(err);
}
```

Using `e` as a parameter name in an ambient function declaration:

```tsx
declare function foo(e: Error): void;

// Can be fixed to:
declare function foo(err: Error): void;
```

Using `e` as a parameter name in a function type:

```tsx
type Foo = (e: Error) => void;

// Can be fixed to:
type Foo = (err: Error) => void;
```

Using `e` as a parameter name in an interface method call signature:

```tsx
interface Foo {
  (e: Error): void;
}

// Can be fixed to:
interface Foo {
  (err: Error): void;
}
```

### Correct ✅

Using `err` as a parameter name:

```tsx
function foo(err) {
  return err;
}
```

Using `e` as an identifier in a simple variable declaration:

```tsx
let e = 'foo';
```

<!-- end auto-generated rule header -->

## Options

<!-- begin auto-generated rule options list -->

| Name           | Description                                                                 | Type     |
| :------------- | :-------------------------------------------------------------------------- | :------- |
| `alternatives` | Suggested alternatives for identifier names. Default: `["err","evt","elt"]` | String[] |

<!-- end auto-generated rule options list -->

## Related

- If you just want to forbid all identifiers with length 1, you should use ESLint [`id-length`](https://eslint.org/docs/latest/rules/id-length)
