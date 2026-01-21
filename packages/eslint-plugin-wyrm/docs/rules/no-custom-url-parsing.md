# wyrm/no-custom-url-parsing

📝 Forbid parsing or building URLs by hand.

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

## Description

Trying to build and parse URLs manually instead of relying on existing parsers is usually a bad idea,
as developers tend to overestimate their understanding of the URL spec and will often miss some edge cases, leading to subtle bugs.

Instead, JavaScript code should use `URL` and `URLSearchParams` to build and parse URLs.

**Example:**

```ts
// Bad: using `String.prototype.split` to extract the query string
const urlParams = new URLSearchParams(href.split('?')[1]);
// Good: using `URL` to extract the query params
const urlParams = new URL(href).searchParams;
```

## Cases

### Incorrect ❌

Conditional query param delimiter selection:

```tsx
const params = {
  foo: 'bar',
  baz: 'quux',
};
let u = 'https://example.com/path/fnord';
Object.entries(params).forEach(([k, v], i) => {
  u += `${i === 0 ? '?' : '&'}${k}=${v}`;
});
```

Splitting on `?` delimiter:

```tsx
url.split('?')[1];
```

### Correct ✅

Add query params using the `URL` constructor:

```tsx
const params = {
  foo: 'bar',
  baz: 'quux',
};
let u = new URL('/path/fnord', 'https://example.com');
Object.entries(params).forEach(([k, v]) => {
  u.searchParams.set(k, v);
});
```

<!-- end auto-generated rule header -->
