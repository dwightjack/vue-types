# Extending VueTypes

[[toc]]

## The `extend()` method

You can extend the [main VueTypes object](/guide/namespaced.html) with your own validators via `VueTypes.extend({...})`.

The method accepts an object with every key supported by [Vue prop validation objects](https://vuejs.org/v2/guide/components-props.html#Prop-Validation) plus the following custom properties:

| name       | type      | default | description                                                         |
| ---------- | --------- | ------- | ------------------------------------------------------------------- |
| `name`     | string    | -       | **Required**. The type name. Will be exposed as `VueType.{name}`    |
| `validate` | boolean   | false   | If `true`, the type will have a `validate` method like native types |
| `getter`   | `boolean` | false   | Set the validator as a getter <sup>(1)</sup>                        |

1. If `true` the validator will be defined as an accessor property (like, for example, `VueTypes.string`). If `false` it will be defined as a configurable method (like `VueTypes.arrayOf()`).

Examples:

```js
// as an accessor
VueTypes.extend({
  name: 'negative',
  getter: true,
  type: Number,
  validator: (v) => v < 0,
})

const negativeProp = VueTypes.negative

// as a configurable method
VueTypes.extend({
  name: 'negativeFn',
  type: Number,
  validator: (v) => v < 0,
})

const negativeProp2 = VueTypes.negativeFn() // <-- we need to call it
```

Note that if `getter === false`, arguments passed to the validator function will be passed down to the `validator` method together with the prop value:

```js
VueTypes.extend({
  name: 'maxLength',
  // getter: false, this is the default
  type: String,
  validator: (max, v) => v.length <= max,
})

const maxLengthType = VueTypes.maxLength(2)

maxLengthType.validator('ab') // true
maxLengthType.validator('abcd') // false
```

## Inherit from VueTypes validators

You can set another validator as _parent_ of a new one by setting it as the `type` property. This feature can be useful to create named aliases:

```js
const userShape = VueTypes.shape({ name: String, age: Number })

VueTypes.extend({
  name: 'user',
  getter: true,
  type: userShape,
})

console.log(VueTypes.user.type) // Object

const data = { name: 'John', surname: 'Doe' }
console.log(VueTypes.utils.validate(data, VueTypes.user)) // true
```

Custom validators will be executed before the parent's one:

```js
// ...
VueTypes.extend({
  name: 'userDoe',
  getter: true,
  type: userShape,
  validator(value) {
    return value && value.surname === 'Doe'
  },
})

const data = { name: 'John', surname: 'Smith' }
console.log(VueTypes.utils.validate(data, VueTypes.userDoe)) // false
```

::: warning
Validators created with this method don't support the `validate` method even if their parent supports it (like `VueTypes.string` or `VueTypes.number`).

```js
VueTypes.extend({
  name: 'myString',
  getter: true,
  type: VueTypes.string,
})

VueTypes.myString.validate(/* ... */)
// Error: validate() is not defined
```

:::

## Define multiple validators

To define multiple validators at once, pass an array of definitions as argument:

```js
// ...
VueTypes.extend([
  {
    name: 'negative',
    getter: true,
    type: Number,
    validator: (v) => v < 0,
  },
  {
    name: 'positive',
    getter: true,
    type: Number,
    validator: (v) => v > 0,
  },
])

// usage...
VueTypes.positive.isRequired
VueTypes.negative
```

## Typescript

When used in a TypeScript project, validators added via `.extend()` might fail type checking. In order to instruct TypeScript about your custom validators you can use the following pattern:

- First create a module to host your extended VueTypes object:

```ts
// prop-types.ts

// 1. import
// - VueTypes library
// - VueTypes class interface
// - validation object interface (VueTypeDef or VueTypeValidableDef)
import VueTypes, {
  VueTypesInterface,
  VueTypeDef,
  VueTypeValidableDef,
} from 'vue-types'

// 2. define your custom VueTypes validators interface
interface ProjectTypes extends VueTypesInterface {
  //VueTypeDef accepts the prop expected type as argument
  maxLength(max: number): VueTypeDef<string>
  // use VueTypeValidableDef if the new type is going to support the `validate` method.
  positive: VueTypeValidableDef<number>
}

// 3. Pass the interface as type argument to the `extend` method
export default VueTypes.extend<ProjectTypes>([
  {
    name: 'maxLength',
    type: String,
    validator: (max: number, v: string) => v.length <= max,
  },
  {
    name: 'positive',
    getter: true,
    type: Number,
    validator: (v: number) => v > 0,
  },
])
```

- Then import the newly created `prop-types.ts` instead of `vue-types`:

```vue
<!-- MyComponent.vue -->
<template>
  <!-- template here -->
</template>
<script lang="ts">
import Vue from 'vue'
import VueTypes from './prop-types'

export default Vue.extend({
  name: 'MyComponent',
  props: {
    msg: VueTypes.maxLength(2),
    count: VueTypes.positive,
  },
})
</script>
```

## Extending in ES6+

If your source code supports ES6 or newer, you can use the native ES `extends` feature with the `toType` and `toValidableType` utility functions.

Both function accept the following arguments:

| name   | type   | description                                                                                                          |
| ------ | ------ | -------------------------------------------------------------------------------------------------------------------- |
| `name` | string | The validator name, used for logging                                                                                 |
| `type` | object | An object compatible with Vue.js [prop validation](https://vuejs.org/v2/guide/components-props.html#Prop-Validation) |

For example, you could create a `prop-types.js` file in your project and export the extended VueTypes class:

```js
// prop-types.js
import VueTypes, { toType, toValidableType } from 'vue-types'

export default class ProjectTypes extends VueTypes {
  // define a custom validator that accepts configuration parameters
  static maxLength(max) {
    return toType('maxLength', {
      type: String,
      validator: (max, v) => v.length <= max,
    })
  }

  // a native-like validator that supports the `.validable` method
  static get positive() {
    return toValidableType('positive', {
      type: Number,
      validator: (v) => v > 0,
    })
  }
}
```

Usage:

```vue
<!-- MyComponent.vue -->
<template>
  <!-- template here -->
</template>
<script lang="ts">
import Vue from 'vue'
import VueTypes from './prop-types'

export default {
  name: 'MyComponent',
  props: {
    msg: VueTypes.maxLength(2),
    count: VueTypes.positive,
  },
}
</script>
```

::: ts
This pattern ensures type safety using the language built-in features and might be
the most efficient and readable option for TypeScript projects.
:::

## Standalone custom validators

The `toType` and `toValidableType` functions can be used to create standalone validator as well. Indeed, they are used internally by `vue-types` in [native](/validators.html#native-validators) and [custom](/validators.html#custom-validators) validators.

### Custom validators from scratch

In the following example we define a validator for positive numbers:

```js
const positive = () =>
  toType('positive', {
    type: Number,
    validator: (v) => v >= 0,
  })

export default {
  props: {
    myNumber: positive().isRequired,
  },
}
```

::: tip
The difference between `toType` and `toValidableType` is that the latter creates validators that support the `.validate()` method to setup custom validation functions.
:::

### Inheriting from existing validators

In some cases you might want to use an already defined validator or validator instance as base for a new validator. This might came handy for code reusability.

In this case you can use the `fromType` utility function.

Function arguments:

| name     | type      | required | description                                     |
| -------- | --------- | -------- | ----------------------------------------------- |
| `name`   | string    | yes      | The validator name, used for logging            |
| `source` | validator | yes      | Parent prop validator                           |
| `props`  | object    | -        | custom [validation properties][prop-validation] |

[prop-validation]: https://vuejs.org/v2/guide/components-props.html#Prop-Validation

```js
import { fromType, shape, number, string } from 'vue-types'

const user = shape({
  ID: number(),
  name: string(),
})

// clone the user shape and make it required
const userRequired = fromType('userRequired', user, { required: true })
```

::: warning
Properties defined in the 3rd argument will overwrite those defined in the base validator.

The only exception is `validator()`: those functions will be merged and executed in sequence until one returns `false`.

```js
import { fromType, shape, number, string } from 'vue-types'

const userRequired = shape({
  ID: number(),
  name: string(),
}).isRequired

// userJohn is not required
// after validating the shape
// will check that name === 'John'
const userJohn = fromType('userJohn', user, {
  required: false,
  validator(value) {
    return value.name === 'John'
  },
})
```

:::

This function can be used to mimic the [Inherit from VueTypes validators](#inherit-from-vue-types-validators) pattern in `VueTypes.extend`:

```js
import { fromType, shape, number, string } from 'vue-types'

const userShape = VueTypes.shape({ name: String, age: Number })

const userJohn = () =>
  fromType('userJohn', userShape, {
    validator(value) {
      return value && value.name === 'John'
    },
  })

export default {
  props: {
    user: userDoe().isRequired,
  },
}
```
