---
outline: [2, 3]
---

<script setup>
import CodeExample from '../components/CodeExample.vue'
</script>

# TypeScript Usage

VueTypes is written in TypeScript and comes with built-in types support.

<CodeExample>

```ts
props: {
  // prop type is `string`
  name: string(),
  // ERROR: Argument of type 'boolean' is not assignable to parameter of type 'string'
  surname: string().def(false),
}
```

---

```ts
defineProps({
  // prop type is `string`
  name: string(),
  // ERROR: Argument of type 'boolean' is not assignable to parameter of type 'string'
  surname: string().def(false),
})
```

</CodeExample>

## Optional Type Constraint

Some validators accept an optional type argument to refine their TypeScript typing.

### any<T = any>

<CodeExample>

```ts
props: {
  unknownProp: any<unknown>()
}
```

---

```ts
defineProps({
  unknownProp: any<unknown>(),
})
```

</CodeExample>

### string<T = string>

Accepts both strings and enums.

<CodeExample>

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

---

```ts
defineProps({
  // use a union type to constrain the string type
  color: string<'red' | 'green'>()
})

enum Colors {
  red = 'red'
  green = 'green'
}

defineProps({
  // same as above, but with an enum
  color: string<Colors>()
})
```

</CodeExample>

::: tip
The same prop type can be expressed using `oneOf`, which also performs validation at runtime:

<CodeExample>

```ts
props: {
  genre: oneOf(['red', 'green'] as const)
}
```

---

```ts
defineProps({
  genre: oneOf(['red', 'green'] as const),
})
```

</CodeExample>

:::

### number<T = number> and integer<T = number>

<CodeExample>

```ts
props: {
  // use a union type to constrain the number type
  count: number<1 | 2>()

  countInt: integer<1 | 2>()
}
```

---

```ts
defineProps({
  // use a union type to constrain the number type
  count: number<1 | 2>()

  countInt: integer<1 | 2>()
})
```

</CodeExample>

### func<T = (...args: any[]) => any>

Useful for typing event handlers and function return types.

<CodeExample>

```ts
type EventFn = (e: Event) => void
type AsyncFn = () => Promise<string[]>

props: {
  onClick: fn<EventFn>()
  loadStrings: fn<AsyncFn>()
}
```

---

```ts
type EventFn = (e: Event) => void
type AsyncFn = () => Promise<string[]>

defineProps({
  onClick: fn<EventFn>()
  loadStrings: fn<AsyncFn>()
})
```

</CodeExample>

### object<T = { [key: string]: any }>

<CodeExample>

```ts
interface User {
  name: string
  // ...
}

props: {
  user: object<User>()
}
```

---

```ts
interface User {
  name: string
  // ...
}

defineProps({
  user: object<User>(),
})
```

</CodeExample>

::: tip
You can use `shape` to have both compile-time and runtime validation:

<CodeExample>

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

---

```ts
interface User {
  name: string
  // ...
}

defineProps({
  user: shape<User>({
    name: string().isRequired,
  }),
})
```

</CodeExample>

:::

### array<T = unknown>

The validator accepts an argument defining the type of the array's items.

<CodeExample>

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

---

```ts
interface User {
  name: string
  // ...
}

defineProps({
  // array of numbers
  sizes: array<number>()
  // array of users
  users: array<User>()
})
```

</CodeExample>

::: tip
The same prop types can be expressed using `arrayOf`, which also performs validation at runtime:

<CodeExample>

```ts
interface User {
  name: string
  // ...
}

props: {
  // array of numbers
  sizes: arrayOf(number())
  // array of users
  users: arrayOf(shape<User>({ name: string().isRequired }))
}
```

---

```ts
interface User {
  name: string
  // ...
}

defineProps({
  // array of numbers
  sizes: arrayOf(number())
  // array of users
  users: arrayOf(shape<User>({ name: string().isRequired }))
})
```

</CodeExample>

:::

### OneOfType\<T>

You can use a union type to specify the expected types.

<CodeExample>

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

---

```ts
interface User {
  name: string
  // ...
}

defineProps({
  // string or instance of User
  theProp: oneOfType<string | User>([String, Object]),
})
```

</CodeExample>

::: tip
The same prop types can be expressed by composing VueTypes validators:

<CodeExample>

```ts
interface User {
  name: string
  // ...
}

props: {
  // string or instance of User
  theProp: oneOfType([string(), object<User>()])
}
```

---

```ts
interface User {
  name: string
  // ...
}

defineProps({
  // string or instance of User
  theProp: oneOfType([string(), object<User>()]),
})
```

</CodeExample>
:::

### shape\<T>

Setting the type argument provides type checking on top of runtime validation:

<CodeExample>

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

---

```ts
interface User {
  name: string
  id?: string
}

defineProps({
  user: shape<User>({
    name: string().isRequired,
    id: string(),
  }),
})
```

</CodeExample>

### custom\<T>

You can define the type of the value received by the validator function.

<CodeExample>

```ts
props: {
  // function argument is of type string
  nonEmptyString: custom<string>((v) => typeof v === 'string' && v.length > 0)
}
```

---

```ts
defineProps({
  // function argument is of type string
  nonEmptyString: custom<string>((v) => typeof v === 'string' && v.length > 0),
})
```

</CodeExample>

::: tip
This validator can be used for tuple props:

<CodeExample>

```ts
type Pair = [string, number]

props: {
  tuple: custom<Pair>(
    ([a, b]) => typeof a === 'string' && typeof b === 'number',
  )
}
```

---

```ts
type Pair = [string, number]

defineProps({
  tuple: custom<Pair>(
    ([a, b]) => typeof a === 'string' && typeof b === 'number',
  ),
})
```

</CodeExample>

:::

### oneOf

You can use [const assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on the expected values to constrain the validator's type:

<CodeExample>

```ts
props: {
  // ERROR: Argument of type '"small"' is not assignable
  // to parameter of type '"large" | "medium"'.
  sizes: oneOf(['large', 'medium'] as const).def('small')
}
```

---

```ts
defineProps({
  // ERROR: Argument of type '"small"' is not assignable
  // to parameter of type '"large" | "medium"'.
  sizes: oneOf(['large', 'medium'] as const).def('small'),
})
```

</CodeExample>

Alternatively, you can pass a union type:

<CodeExample>

```ts
props: {
  // Same (mostly) as above
  // see below for details
  sizes: oneOf<'large' | 'medium'>(['large', 'medium'])
}
```

---

```ts
defineProps({
  // Same (mostly) as above
  // see below for details
  sizes: oneOf<'large' | 'medium'>(['large', 'medium']),
})
```

</CodeExample>

::: warning {id=oneof-warning}

Note that union types don't put any constraints on the presence of all their members in the validation array. This can lead to runtime bugs not detected by the type checker:

<CodeExample>

```ts
props: {
  // TS type checker does not report any error
  // but Vue runtime throws an error
  sizes: oneOf<'large' | 'medium'>(['large']).def('medium')
}
```

---

```ts
defineProps({
  // TS type checker does not report any error
  // but Vue runtime throws an error
  sizes: oneOf<'large' | 'medium'>(['large']).def('medium'),
})
```

</CodeExample>

As a general rule, we strongly suggest using [const assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) whenever possible.

<CodeExample>

```ts
props: {
  // type checker and runtime error
  sizes: oneOf(['large'] as const).def('medium')
}
```

---

```ts
defineProps({
  // type checker and runtime error
  sizes: oneOf(['large'] as const).def('medium'),
})
```

</CodeExample>

:::
