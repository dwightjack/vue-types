# TypeScript Usage

VueTypes is written in TypeScript and comes with full builtin types support.

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

Some validators accepts an optional type argument to refine their TS typing.

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

Useful to type event handlers and function return types.

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

### array<T = unknown>

The validator accepts an argument defining the contained items type.

```ts
interface User {
  name: string
  // ...
}

props: {
  // array of numbers
  sizes: array<number>()
  // array of users
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
  // set the object() validator type to User
  users: arrayOf(object<User>())
}
```

:::

### OneOfType\<T>

You can use a union type to specify the expected types.

```ts
interface User {
  name: string
  // ...
}

props: {
  // string or instance of User
  theProp: oneOfType<string | User>([String, Object])
}
```

::: tip
The same prop types can be expressed composing VueTypes validators:

```ts
interface User {
  name: string
  // ...
}

props: {
  // same as above
  theProp: oneOfType([String, object<User>()])
}
```

:::

### shape\<T>

Setting the type argument provides type checking on top of runtime validation:

```ts
interface User {
  name: string
  id?: string
}

props: {
  user: shape<User>({
    name: string().isRequired,
    id: string(),
  })
}
```

### custom\<T>

You can define the type of the value received by the validator function.

```ts
props: {
  // function argument is of type string
  nonEmptyString: custom<string>((v) => typeof v === 'string' && v.length > 0)
}
```

::: tip
This validator can be used for tuple props:

```ts
type Pair = [string, number]

props: {
  tuple: custom<Pair>(
    ([a, b]) => typeof a === 'string' && typeof b === 'number',
  )
}
```

:::

### oneOf

You can use [const assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on the expected values to constrain the validators type:

```ts
props: {
  // ERROR: Argument of type '"small"' is not assignable
  // to parameter of type '"large" | "medium"'.
  sizes: oneOf(['large', 'medium'] as const).def('small')
}
```

Alternative, you can pass a union type:

```ts
props: {
  // Same (mostly) as above
  // see below for details
  sizes: oneOf<'large' | 'medium'>(['large', 'medium'])
}
```

::: warning
Note that union types don't put any constrain on the presence of all of their members in the validation array. This can lead to runtime bugs not detected by the type checker:

```ts
props: {
  // type check allowed values: 'large' | 'medium' --> default OK
  // runtime values: 'large' --> default ERROR
  sizes: oneOf<'large' | 'medium'>(['large']).def('medium')
}
```

As a general rule, we strongly suggest to use [const assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) whenever possible.

```ts
props: {
  // type check and runtime error
  sizes: oneOf(['large'] as const).def('medium')
}
```

:::
