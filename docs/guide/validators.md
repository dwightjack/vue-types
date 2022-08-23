---
title: Validators
---

# Using VueTypes Validators

VueTypes is a collection of prop validators. Each validator is basically a factory function returning an object (_validator object_) compatible with [Vue prop validation](https://vuejs.org/v2/guide/components-props.html#Prop-Validation).

Differently from simple Vue prop validation objects, VueTypes prop validator objects provide some additional chainable properties and methods to control things like `required` and default values.

Validators can be imported as named functions from `vue-types`:

```js
import Vue from 'vue'
import { number, oneOf } from 'vue-types'

export default {
  props: {
    id: number().isRequired,
    status: oneOf(['open', 'close']).def('open'),
  },
}
```

Validators can be categorized in two groups:

- Native Validators
- Custom Validators

## Native Validators

Native validators come with:

- a `def(any)` method to assign a default value for the current prop. The passed-in value will be validated against the type configuration in order to prevent invalid values.
- a `isRequired` flag to set the `required: true` property.
- a `validate(function)` method to set a custom validator function (not available in `integer` and `symbol`).

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

::: tip
You can unset any previously defined default value by passing `undefined` to `.def()`

```js
const type = string().def('hello')
// { type: String, default: 'hello' }

type.def(undefined)
// { type: String }
```

:::

### any

Validates any type of value. This validator should be used sparingly and can be an escape hatch for props with unknown values.

```js
props: {
  myProp: any(),
}
```

::: ts
In TypeScript, you can specify a type constraint other than `any`:

```ts
props: {
  // type is `any`
  myPropAny: any(),
  // type is `unknown`
  myPropUnknown: any<unknown>(),
}
```

:::

### array

Validates that a prop is an array primitive.

```js
props: {
  users: array(),
}
```

::: ts
In TypeScript, you can specify the type of array items as type argument:

```ts
props: {
  // array of strings
  users: array<string>(),
  // specify the allowed array items
  fruits: array<'apple' | 'pear'>()
}
```

**Note**: this signature will validate the prop at compile-time only. For
runtime validation use [`arrayOf`](#arrayof)

:::

::: tip
[Vue prop validation](https://vuejs.org/v2/guide/components-props.html#Prop-Validation) requires Array props to provide default value as a factory function. `array().def()` accepts both factory functions and arrays. In the latter case, VueTypes will convert the value to a factory function for you.
:::

### bool

Validates boolean props.

```js
props: {
  enabled: bool()
}
```

### func

Validates that a prop is a function.

```js
props: {
  onClick: func()
}
```

::: ts
You can constrain the function signature passing it as type argument:

```ts
props: {
  // expects an event handler
  onClick: func<(event: Event) => void>()
}
```

:::

### number

Validates that a prop is a number.

```js
props: {
  length: number()
}
```

::: ts
You can constrain the number value with a type argument:

```ts
props: {
  // union type
  length: number<1 | 2 | 3>()
}
```

**Note**: this signature will validate the prop at compile-time only. For
runtime validation use [`oneOf`](#oneof).

:::

### integer

Validates that a prop is an integer.

```js
props: {
  age: integer()
}
```

::: ts
Because `integer()` inherits from `number()`, you can constrain its value with a type argument as well (see above for details).

:::

### object

Validates that a prop is an object.

```js
props: {
  user: object()
}
```

::: ts
You can specify the shape of the object as type argument:

```ts
interface User {
  ID: number
  username: string
}

// ...

props: {
  // restrict the object to the properties of User
  user: object<User>()
}
```

**Note**: this signature will validate the prop at compile-time only. For
runtime validation use [`shape`](#shape)

:::

::: tip
[Vue prop validation](https://vuejs.org/v2/guide/components-props.html#Prop-Validation) requires Object props to provide default value as a factory function. `object().def()` accepts both factory functions and plain objects. In the latter case, VueTypes will convert the value to a factory function for you.
:::

### string

Validates that a prop is a string.

```js
props: {
  username: string()
}
```

::: ts
You can constrain the string value with a type argument:

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

**Note**: this signature will validate the prop at compile-time only. For
runtime validation use [`oneOf`](#oneof).

:::

### symbol

Validates that a prop is a Symbol.

```js
props: {
  uniq: symbol()
}
```

### nullable

Validates that a prop is null.

```js
props: {
  uniq: nullable()
}
```

::: warning
This validator **does not come with any flag or method**. It can be used with [`oneOfType`](#oneoftype) to make a **non required** prop nullable.

```js
props: {
  stringOrNull: oneOfType([string(), nullable()])
}
```

**Use this validator sparingly.** Nullable props are not encouraged in Vue components, so please consider reviewing your strategy.
:::

## Custom Validators

Custom validators are a special kind of factory function useful to describe complex validation requirements. By design custom validators:

- **don't have** a `validate` method
- have a `.def()` method to assign a default value on the current prop
- have an `isRequired` flag to set the `required: true` property

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

Validates that a prop is an instance of a JavaScript constructor. This validator uses JavaScript's `instanceof` operator.

```js
class User {
  // ...
}

props: {
  user: instanceOf(User)
}
```

### oneOf

Validates that a prop is one of the provided values.

```js
props: {
  genre: oneOf(['action', 'thriller'])
}
```

::: ts
To constrain the allowed values at compile-time use [const assertions](https://devblogs.microsoft.com/typescript/announcing-typescript-3-4/#const-assertions) on the passed-in array:

```ts
props: {
  genre: oneOf(['action', 'thriller'] as const)
}
```

:::

### oneOfType

Validates that a prop is an object that could be one of many types. Accepts as inner validators an array of JavaScript constructors, Vue.js props validation objects and VueTypes validators objects.

```js
props: {
  // Either a string, an integer or an instance of the User class
  theProp: oneOfType([String, integer(), instanceOf(User)])
}
```

::: ts
You can constrain the expected types passing them as type argument:

```ts
type User = { name: string; id: string }

props: {
  // string or instance of User
  theProp: oneOfType<string | User>([String, Object])
}
```

Constraints can be set on the inner validators as well:

```ts
type User = { name: string; id: string }

props: {
  // same as above
  theProp: oneOfType([String, object<User>()])
}
```

### arrayOf

Validates that a prop is an array of a certain type. Accepts JavaScript constructors, Vue.js props validation objects and VueTypes validators objects.

```js
props: {
  //accepts: ['my', 'string']
  //rejects: ['my', 1]
  theProp: arrayOf(String),

  // accepts an array of objects
  userList: arrayOf(object())
}
```

::: tip
Prop Validators are composable. For example, to validate an array that can contain both strings and numbers you can use `arrayOf` and `oneOfType`:

```js
props: {
  // an array containing both strings and numbers
  collection: arrayOf(oneOfType([String, Number]))
}
```

In TypeScript, composition can be used together with type arguments to constrain the final prop type:

```ts
type User = { name: string; id: string }

props: {
  // an array containing both arrays of strings and User object instances
  collection: arrayOf(oneOfType([array<string>(), object<User>()]))
}
```

:::

### objectOf

Validates that a prop is an object with values of a certain type. Accepts JavaScript constructors, Vue.js props validation objects and VueTypes validators objects.

```js
props: {
  //accepts: {name: 'John', surname: 'Doe'}
  //rejects: {name: 'John', age: 30}
  userData: objectOf(String)
}
```

### shape

Validates that a prop is an object taking on a particular shape. Shape properties value can be JavaScript constructors, Vue.js props validation objects or VueTypes validators objects.

Note that:

- You can set the properties of the shape as `required` but you **cannot** use `.def()`.
- You can use `.def()` to set a default value for the shape itself.
- Like `array` and `object`, you can pass to `.def()` either a factory function returning an object or a plain object.

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

::: ts
You can constrain the shape with a type argument:

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

:::

#### Loose shape matching

By default `shape` will reject objects containing properties not defined in the shape. To allow partial matching use the `loose` flag:

```js
export default {
  props: {
    //accepts: {name: 'John', id: 1}
    //rejects: {name: 'John', id: 1, age: 30} --> age not defined in the shape
    userData: shape({
      name: String,
      id: integer().isRequired,
    }),

    //accepts: {name: 'John', id: 1}
    //accepts: {name: 'John', id: 1, age: 30} --> loose matching
    userDataLoose: shape({
      name: String,
      id: integer().isRequired,
    }).loose, // <-- loose flag
  },
}
```

### custom

Validates prop values against a custom validation function.

```js
function minLength(value) {
  return typeof value === 'string' && value.length >= 6
}

// ...

props: {
  username: custom(minLength)
}

//accepts: 'arandomusername'
//rejects: 'user', 1
```

Note that the passed-in function name will be used as the custom validator name in warnings.

You can pass a validation error message as second argument as well:

```js
function minLength(value) {
  return typeof value === 'string' && value.length >= 6
}

// ...
props: {
  theProp: custom(minLength, 'theProp is not a string or is too short')
}
```

::: ts
In TypeScript, you can specify the prop type with a type argument:

```ts
function minLength(value) {
  return typeof value === 'string' && value.length >= 6
}

// ...
props: {
  // theProp is a string
  theProp: custom<string>(minLength)
}
```

:::

## Utilities

VueTypes exposes some useful utility functions that can be used to extend the library functionalities.

### validateType

Checks a value against a type definition.

Accepts the following arguments:

- `validator`: A JavaScript constructor or VueTypes validator object
- `value`: The value to check
- `[silent=false]`: Toggle error console logging

If `silent === false` the function will return a boolean. If `silent === true` it will return `true` if the check succeeds else it will return an error message.

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

Convert an object compatible with Vue.js [prop validation](https://vuejs.org/v2/guide/components-props.html#Prop-Validation) to a VueTypes validator object.

See [Custom validators from scratch](/advanced/extending-vue-types.html#standalone-custom-validators) for more details.

### fromType

Creates a new validator object from a previously defined one.

See [Inheriting from existing validators](/advanced/extending-vue-types.html#inheriting-from-existing-validators) for more details.

### createTypes

Returns a namespaced collection of validators.

See [Custom namespaced instance](/advanced/custom-instance.html) for more details.
