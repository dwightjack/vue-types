---
title: Validators
---

<script setup>
import CodeExample from '../components/CodeExample.vue'
</script>

# Using VueTypes Validators

VueTypes is a collection of prop validators. Each validator is a factory function that returns an object (_validator object_) compatible with [Vue prop validation](https://vuejs.org/guide/components/props.html#Prop-Validation).

Unlike simple Vue prop validation objects, VueTypes prop validator objects provide additional chainable properties and methods to control features like `required` flags and default values.

You can import validators as named functions from `vue-types`:

<CodeExample>

```js
import { number, oneOf } from 'vue-types'

export default {
  props: {
    id: number().isRequired,
    status: oneOf(['open', 'close']).def('open'),
  },
}
```

---

```js
import { number, oneOf } from 'vue-types'

defineProps({
  id: number().isRequired,
  status: oneOf(['open', 'close']).def('open'),
})
```

</CodeExample>

Validators fall into two categories:

- Native Validators
- Custom Validators

## Native Validators

Native validators include:

- A `def(any)` method to set a default value for the prop. The provided value will be validated against the type configuration to prevent invalid values.
- An `isRequired` flag to set the `required: true` property.
- A `validate(function)` method to set a custom validator function (not available in `integer` and `symbol` validators).

```js
import { number } from 'vue-types'

const numProp = number()
// numProp === { type: Number}

const numPropCustom = number().def(10)
// numPropCustom ===  { type: Number, default : 10}

const numPropRequired = number().isRequired
// numPropRequired ===  { type: Number, required : true}

const numPropRequiredCustom = number().def(10).isRequired
// numPropRequiredCustom ===  { type: Number, default: 10, required : true}

const gtTen = (num) => num > 10
const numPropGreaterThanTen = number().validate(gtTen)
// numPropGreaterThanTen ===  { type: Number, validator: (num) => num > 10 }
```

::: tip UPDATING DEFAULT VALUES
You can clear any previously defined default value by passing `undefined` to `.def()`

```js
const type = string().def('hello')
// { type: String, default: 'hello' }

type.def(undefined)
// { type: String }
```

**Note:** Using `.def(undefined)` on boolean or mixed-boolean types explicitly sets the `default` property to `undefined`:

```js
const type = bool().def(true)
// { type: Boolean, default: true }

type.def(undefined)
// { type: Boolean, default: undefined }

const mixedType = oneOfType([bool(), string()])
// { type: [Boolean, String] }

mixedType.def(undefined)
// { type: [Boolean, String], default: undefined }
```

:::

### any

Validates any value. Use this validator sparingly as it can serve as an escape hatch for props with unknown values.

<CodeExample>

```js
props: {
  myProp: any(),
}
```

---

```js
defineProps({
  myProp: any(),
})
```

</CodeExample>

::: ts
In TypeScript, you can specify a type constraint other than `any`:

<CodeExample>

```ts
props: {
  // type is `any`
  myPropAny: any(),
  // type is `unknown`
  myPropUnknown: any<unknown>(),
}
```

---

```ts
defineProps({
  // type is `any`
  myPropAny: any(),
  // type is `unknown`
  myPropUnknown: any<unknown>(),
})
```

</CodeExample>

:::

### array

Validates that a prop is an array primitive.

<CodeExample>

```js
props: {
  users: array(),
}
```

---

```js
defineProps({
  users: array(),
})
```

</CodeExample>

::: ts
In TypeScript, you can specify the type of array items as a type argument:

<CodeExample>

```ts
props: {
  // array of strings
  users: array<string>(),
  // specify the allowed array items
  fruits: array<'apple' | 'pear'>()
}
```

---

```ts
defineProps({
  // array of strings
  users: array<string>(),
  // specify the allowed array items
  fruits: array<'apple' | 'pear'>(),
})
```

</CodeExample>

**Note**: This signature validates the prop only at compile-time. For
runtime validation, use [`arrayOf`](#arrayof)

:::

::: tip
[Vue prop validation](https://vuejs.org/v2/guide/components-props.html#Prop-Validation) requires Array props to provide the default value as a factory function. `array().def()` accepts both factory functions and arrays. When you provide an array, VueTypes automatically converts it to a factory function.
:::

### bool

Validates boolean props.

<CodeExample>

```js
props: {
  enabled: bool()
}
```

---

```js
defineProps({
  enabled: bool(),
})
```

</CodeExample>

::: warning `undefined` AS DEFAULT VALUE

Using `.def(undefined)` on boolean or mixed-boolean types explicitly sets the `default` property to `undefined`:

```js
const type = bool().def(true)
// { type: Boolean, default: true }

type.def(undefined)
// { type: Boolean, default: undefined }

const mixedType = oneOfType([bool(), string()])
// { type: [Boolean, String] }

mixedType.def(undefined)
// { type: [Boolean, String], default: undefined }
```

:::

### func

Validates that a prop is a function.

<CodeExample>

```js
props: {
  onClick: func()
}
```

---

```js
defineProps({
  onClick: func(),
})
```

</CodeExample>

::: ts
You can constrain the function signature by passing it as a type argument:

<CodeExample>

```ts
props: {
  // expects an event handler
  onClick: func<(event: Event) => void>()
}
```

---

```ts
defineProps({
  // expects an event handler
  onClick: func<(event: Event) => void>(),
})
```

</CodeExample>

:::

### number

Validates that a prop is a number.

<CodeExample>

```js
props: {
  length: number()
}
```

---

```js
defineProps({
  length: number(),
})
```

</CodeExample>

::: ts
You can constrain the number value with a type argument:

<CodeExample>

```ts
props: {
  // union type
  length: number<1 | 2 | 3>()
}
```

---

```ts
defineProps({
  // union type
  length: number<1 | 2 | 3>(),
})
```

</CodeExample>

**Note**: This signature validates the prop only at compile-time. For
runtime validation, use [`oneOf`](#oneof).

:::

### integer

Validates that a prop is an integer.

<CodeExample>

```js
props: {
  age: integer()
}
```

---

```js
defineProps({
  age: integer(),
})
```

</CodeExample>

::: ts
Since `integer()` inherits from `number()`, you can constrain its value with a type argument (see above for details).

:::

### object

Validates that a prop is an object.

<CodeExample>

```js
props: {
  user: object()
}
```

---

```js
defineProps({
  user: object(),
})
```

</CodeExample>

::: ts
You can specify the shape of the object as a type argument:

<CodeExample>

```ts
interface User {
  ID: number
  username: string
}

props: {
  // restrict the object to the properties of User
  user: object<User>()
}
```

---

```ts
interface User {
  ID: number
  username: string
}

defineProps({
  // restrict the object to the properties of User
  user: object<User>(),
})
```

</CodeExample>

**Note**: This signature validates the prop only at compile-time. For
runtime validation, use [`shape`](#shape)

:::

::: tip
[Vue prop validation](https://vuejs.org/guide/components/props.html#prop-validation) requires Object props to provide the default value as a factory function. `object().def()` accepts both factory functions and plain objects. When you provide a plain object, VueTypes automatically converts it to a factory function.
:::

### string

Validates that a prop is a string.

<CodeExample>

```js
props: {
  username: string()
}
```

---

```js
defineProps({
  username: string(),
})
```

</CodeExample>

::: ts
You can constrain the string value with a type argument:

<CodeExample>

```ts
enum Fruits {
  Apple = 'Apple',
  Pear = 'Pear',
}

props: {
  // string enum
  users: string<Fruits>(),
  // union type
  fruits: string<'apple' | 'pear'>()
}
```

---

```ts
enum Fruits {
  Apple = 'Apple',
  Pear = 'Pear',
}

defineProps({
  // string enum
  users: string<Fruits>(),
  // union type
  fruits: string<'apple' | 'pear'>(),
})
```

</CodeExample>

**Note**: This signature validates the prop only at compile-time. For
runtime validation, use [`oneOf`](#oneof).

:::

### symbol

Validates that a prop is a Symbol.

<CodeExample>

```js
props: {
  uniq: symbol()
}
```

---

```js
defineProps({
  uniq: symbol(),
})
```

</CodeExample>

### nullable

Validates that a prop is `null`.

<CodeExample>

```js
props: {
  isNull: nullable()
}
```

---

```js
defineProps({
  isNull: nullable(),
})
```

</CodeExample>

::: warning
This validator **does not include any flags or methods**. Use it with [`oneOfType`](#oneoftype) to make a **required** prop nullable.

<CodeExample>

```js
props: {
  stringOrNull: oneOfType([string(), nullable()]).isRequired
}
```

---

```js
defineProps({
  stringOrNull: oneOfType([string(), nullable()]).isRequired,
})
```

</CodeExample>

**Use this validator sparingly.** Nullable props are not recommended in Vue components. Consider reviewing your strategy if you find yourself using them frequently.
:::

## Custom Validators

Custom validators are special factory functions designed for complex validation requirements. By design, custom validators:

- Do **not** have a `validate` method
- Include a `.def()` method to assign a default value to the current prop
- Include an `isRequired` flag to set the `required: true` property

```js
const oneOfPropDefault = oneOf([0, 1]).def(1)
// oneOfPropDefault.default === 1

const oneOfPropRequired = oneOf([0, 1]).isRequired
// oneOfPropRequired.required ===  true

const oneOfPropRequiredCustom = oneOf([0, 1]).def(1).isRequired
// oneOfPropRequiredCustom.default ===  1
// oneOfPropRequiredCustom.required === true
```

### instanceOf

Validates that a prop is an instance of a JavaScript constructor, using JavaScript's `instanceof` operator.

<CodeExample>

```js
class User {
  // ...
}

props: {
  user: instanceOf(User)
}
```

---

```js
class User {
  // ...
}

defineProps({
  user: instanceOf(User),
})
```

</CodeExample>

### oneOf

Validates that a prop matches one of the provided values.

<CodeExample>

```js
props: {
  genre: oneOf(['action', 'thriller'])
}
```

---

```js
defineProps({
  genre: oneOf(['action', 'thriller']),
})
```

</CodeExample>

::: ts
To constrain the allowed values at compile-time, use [const assertions](https://devblogs.microsoft.com/typescript/announcing-typescript-3-4/#const-assertions) on the passed-in array or union types ([see caveats](../advanced/typescript.md#oneof-warning)):

<CodeExample>

```ts
props: {
  genre: oneOf(['action', 'thriller'] as const)
}

// mostly same as
type Genre = 'action' | 'thriller'

props: {
  genre: oneOf<Genre>(['action', 'thriller'])
}
```

---

```ts
defineProps({
  genre: oneOf(['action', 'thriller'] as const),
})

// mostly same as
type Genre = 'action' | 'thriller'

defineProps({
  genre: oneOf<Genre>(['action', 'thriller']),
})
```

</CodeExample>

:::

### oneOfType

Validates that a prop matches one of several types. It accepts an array of JavaScript constructors, Vue.js props validation objects, and VueTypes validator objects as inner validators.

<CodeExample>

```js
props: {
  stringOrNull: oneOfType([string(), nullable()]).isRequired
}
```

---

```js
defineProps({
  stringOrNull: oneOfType([string(), nullable()]).isRequired,
})
```

</CodeExample>

This validator enables complex validation logic, combining native types, specific values (using [`oneOf`](#oneof)), and `null` (using [`nullable`](#nullable)):

<CodeExample>

```ts
props: {
  // Either a number (of pixels), a keyword, or null
  // translates to: number | 'fit-content' | 'auto' | null
  width: oneOfType([
    Number,
    oneOf(['fit-content', 'auto'] as const),
    nullable(),
  ])
}
```

---

```ts
defineProps({
  // Either a number (of pixels), a keyword, or null
  // translates to: number | 'fit-content' | 'auto' | null
  width: oneOfType([
    Number,
    oneOf(['fit-content', 'auto'] as const),
    nullable(),
  ]),
})
```

</CodeExample>

::: ts
You can constrain the expected types using type arguments:

<CodeExample>

```ts
type User = { name: string; id: string }

props: {
  // string or instance of User
  theProp: oneOfType<string | User>([String, Object])
}
```

---

```ts
type User = { name: string; id: string }

defineProps({
  // string or instance of User
  theProp: oneOfType<string | User>([String, Object]),
})
```

</CodeExample>

You can also constrain the inner validators:

<CodeExample>

```ts
type User = { name: string; id: string }

props: {
  // same as above
  theProp: oneOfType([String, object<User>()])
}
```

---

```ts
type User = { name: string; id: string }

defineProps({
  // same as above
  theProp: oneOfType([String, object<User>()]),
})
```

</CodeExample>

:::

### arrayOf

Validates the type of array items. It accepts JavaScript constructors, Vue.js props validation objects, and VueTypes validator objects.

<CodeExample>

```js
props: {
  //accepts: ['my', 'string']
  //rejects: ['my', 1]
  theProp: arrayOf(String),

  // accepts an array of objects
  userList: arrayOf(object())
}
```

---

```js
defineProps({
  //accepts: ['my', 'string']
  //rejects: ['my', 1]
  theProp: arrayOf(String),

  // accepts an array of objects
  userList: arrayOf(object()),
})
```

</CodeExample>

::: tip
Prop Validators are composable. For example, to validate an array containing both strings and numbers:

<CodeExample>

```js
props: {
  // an array containing both strings and numbers
  collection: arrayOf(oneOfType([String, Number]))
}
```

---

```js
defineProps({
  // an array containing both strings and numbers
  collection: arrayOf(oneOfType([String, Number])),
})
```

</CodeExample>

:::

::: ts
In TypeScript, you can combine composition with type arguments to constrain the final prop type:

<CodeExample>

```ts
type User = { name: string; id: string }

props: {
  // an array containing both arrays of strings and User object instances
  collection: arrayOf(oneOfType([array<string>(), object<User>()]))
}
```

---

```ts
type User = { name: string; id: string }

defineProps({
  // an array containing both arrays of strings and User object instances
  collection: arrayOf(oneOfType([array<string>(), object<User>()])),
})
```

</CodeExample>

:::

### objectOf

Validates that a prop is an object with values of a specific type. It accepts JavaScript constructors, Vue.js props validation objects, and VueTypes validator objects.

<CodeExample>

```js
props: {
  //accepts: {name: 'John', surname: 'Doe'}
  //rejects: {name: 'John', age: 30}
  userData: objectOf(String)
}
```

---

```js
defineProps({
  //accepts: {name: 'John', surname: 'Doe'}
  //rejects: {name: 'John', age: 30}
  userData: objectOf(String),
})
```

</CodeExample>

### shape

Validates that a prop is an object with a specific shape. The shape properties can be JavaScript constructors, Vue.js props validation objects, or VueTypes validator objects.

Important notes:

- Shape properties can be marked as `required`, but **cannot** use `.def()`
- You can use `.def()` to set a default value for the entire shape
- Like `array` and `object`, `.def()` accepts either a factory function returning an object or a plain object

<CodeExample>

```js
props: {
  // default value = {name: 'John'}
  //accepts: {name: 'John', age: 30, id: 1}
  //rejects: {name: 'John', age: 30} -> missing required `id` key
  //rejects: {name: 'John', age: 'wrong data', id: 1} -> age is not a number
  userData: shape({
    name: String,
    age: integer(),
    id: integer().isRequired,
  }).def(() => ({ name: 'John' }))
}
```

---

```js
defineProps({
  // default value = {name: 'John'}
  //accepts: {name: 'John', age: 30, id: 1}
  //rejects: {name: 'John', age: 30} -> missing required `id` key
  //rejects: {name: 'John', age: 'wrong data', id: 1} -> age is not a number
  userData: shape({
    name: String,
    age: integer(),
    id: integer().isRequired,
  }).def(() => ({ name: 'John' })),
})
```

</CodeExample>

::: ts
You can constrain the shape using a type argument:

<CodeExample>

```ts
interface User {
  name?: string
  age?: number
  id: number
}

// ...

props: {
  userData: shape<User>({
    name: String,
    age: integer(),
    id: integer().isRequired,
  }).def(() => ({ name: 'John' }))
}
```

---

```ts
interface User {
  name?: string
  age?: number
  id: number
}

// ...

defineProps({
  userData: shape<User>({
    name: String,
    age: integer(),
    id: integer().isRequired,
  }).def(() => ({ name: 'John' })),
})
```

</CodeExample>

:::

#### Loose shape matching

By default, `shape` rejects objects that contain properties not defined in the shape. To allow additional properties, use the `loose` flag:

<CodeExample>

```js
props: {
  //accepts: {name: 'John', id: 1}
  //accepts: {name: 'John', id: 1, age: 30} --> loose matching
  userDataLoose: shape({
    name: String,
    id: integer().isRequired,
  }).loose, // <-- loose flag
}
```

---

```js
defineProps({
  //accepts: {name: 'John', id: 1}
  //accepts: {name: 'John', id: 1, age: 30} --> loose matching
  userDataLoose: shape({
    name: String,
    id: integer().isRequired,
  }).loose, // <-- loose flag
})
```

</CodeExample>

### custom

Creates a validator with custom validation logic.

<CodeExample>

```js
props: {
  //accepts: 'arandomusername'
  //rejects: 'user', 1
  username: custom(function minLength(value) {
    return typeof value === 'string' && value.length >= 6
  })
}
```

---

```js
defineProps({
  //accepts: 'arandomusername'
  //rejects: 'user', 1
  username: custom(function minLength(value) {
    return typeof value === 'string' && value.length >= 6
  }),
})
```

</CodeExample>

The function name will appear in validation warning messages.

You can provide a custom validation error message as the second argument:

<CodeExample>

```js
props: {
  theProp: custom(
    (value) => typeof value === 'string' && value.length >= 6,
    'theProp is not a string or is too short',
  )
}
```

---

```js
defineProps({
  theProp: custom(
    (value) => typeof value === 'string' && value.length >= 6,
    'theProp is not a string or is too short',
  ),
})
```

</CodeExample>

::: ts
In TypeScript, you can specify the prop type using a type argument:

<CodeExample>

```ts
props: {
  theProp: custom<string>(function minLength(value) {
    return typeof value === 'string' && value.length >= 6
  })
}
```

---

```ts
defineProps({
  theProp: custom<string>(function minLength(value) {
    return typeof value === 'string' && value.length >= 6
  }),
})
```

</CodeExample>

:::

## Utilities

VueTypes provides utility functions that extend the library's functionality.

### validateType

Checks a value against a type definition.

Arguments:

- `validator`: A JavaScript constructor or VueTypes validator object
- `value`: The value to check
- `[silent=false]`: Toggle error console logging

When `silent` is `false`, the function returns a boolean. When `silent` is `true`, it returns `true` for successful checks and an error message for failures.

```js
import { validateType, arrayOf } from 'vue-types'

// VueTypes validator object
const isArrayOfStrings = arrayOf(String)

validateType(isArrayOfStrings, ['hello', 'world']) // true
validateType(isArrayOfStrings, ['hello', 1]) // false

// Native string constructor
validateType(Number, 10) // true

// returns an error message on failure
validateType(String, 10, false) // 'value "10" should be of type "string"`
```

### toType / toValidableType

Converts a Vue.js [prop validation](https://vuejs.org/v2/guide/components-props.html#Prop-Validation) compatible object to a VueTypes validator object.

See [Standalone custom validators](../advanced/custom-validators.md#standalone-custom-validators) for more details.

### fromType

Creates a new validator object based on an existing one.

See [Composing existing validators](/advanced/custom-validators.html#composing-existing-validators) for more details.

### createTypes

Creates a namespaced collection of validators.

See [Custom namespaced instance](../namespaced-usage/custom-instance.md) for more details.
