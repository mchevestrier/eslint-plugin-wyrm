# Forbid some empty JSX attributes (`wyrm/no-empty-attribute`)

💼 This rule is enabled in the following configs: 🟪 `strict`, ☑️ `strictTypeChecked`.

## Cases

### Incorrect ❌

Empty `className` attribute:

```tsx
function Foo() {
  return <div className="" />;
}
```

Empty `id` attribute:

```tsx
function Foo() {
  return <div id="" />;
}
```

### Correct ✅

`className` attribute is not empty:

```tsx
function Foo() {
  return <div className="cls" />;
}
```

<!-- end auto-generated rule header -->

## Options

<!-- begin auto-generated rule options list -->

| Name         | Description                                                                                                                                                                                                                                                                | Type     |
| :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| `attributes` | Names of attributes to check. Default: `["action","autocomplete","className","colspan","decoding","height","id","href","loading","max","maxlength","min","method","placeholder","poster","rel","rowspan","size","src","start","tabindex","target","title","type","width"]` | String[] |

<!-- end auto-generated rule options list -->
