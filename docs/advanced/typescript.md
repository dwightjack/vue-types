# TypeScript Usage

VueTypes is written in TypeScript and comes with builtin types support for its API and validators.

Most of the validators can infer the prop type from their configuration:

```ts
props: {
  // prop type is `string`
  name: string(),
  // ERROR: Argument of type 'boolean' is not assignable to parameter of type 'string'
  surname: string().def(false),
}
```

## Optional type constraint

Some validators accepts an optional type argument to refine their prop type.

### any<T = any>

```ts
props: {
  unknownProp: any<unknown>()
}
```

### string<T = string>

Accepts both strings and enums.

```ts
props: {
  // use a union type to constrain the string type
  color: string<'red' | 'green'>()
}

enum Colors {
  red = 'red'
  green = 'green'
}

props: {
  // same as above, but with an enum
  color: string<Colors>()
}
```

::: tip
The same prop type can be expressed using `oneOf` which will also perform a validation at runtime:

```ts
props: {
  genre: oneOf(['red', 'green'] as const)
}
```

:::

### number<T = number> and integer<T = number>

```ts
props: {
  // use a union type to constrain the number type
  count: number<1 | 2>()

  countInt: integer<1 | 2>()
}
```

### func<T = (...args: any[]) => any>

Useful to cast even handlers and function return types.

```ts
type EventFn = (e: Event) => void
type AsyncFn = () => Promise<string[]>

props: {
  onClick: fn<EventFn>()
  loadStrings: fn<AsyncFn>()
}
```

### object<T = { [key: string]: any }>

```ts
interface User {
  name: string
  // ...
}

props: {
  user: object<User>()
}
```

::: tip
To have both compile-time and runtime validation, you can use `shape`:

```ts
interface User {
  name: string
  // ...
}

props: {
  user: shape<User>({
    name: string().isRequired,
  })
}
```

:::

### array<T = unknown[]>

```ts
interface User {
  name: string
  // ...
}

props: {
  sizes: array<number>()
  users: array<User>()
}
```

::: tip
The same prop types can be expressed using `arrayOf` which will also perform a validation at runtime:

```ts
interface User {
  name: string
  // ...
}

props: {
  sizes: arrayOf(Number)
  // cast the object() validator to User
  users: arrayOf(object<User>())
}
```

:::
