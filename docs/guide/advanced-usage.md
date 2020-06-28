# Advanced usage

## Extending VueTypes

You can extend VueTypes with your own types via `VueTypes.extend({...})`. The method accepts an object with every key supported by [Vue prop validation objects](https://vuejs.org/v2/guide/components-props.html#Prop-Validation) plus the following custom properties:

- `name`: (string, required) The type name. Will be exposed as VueType.{name}
- `validate`: (boolean, default: `false`) If `true` the type will have a `validate` method like native types.
- `getter`: (boolean, default: `false`) If `true` will setup the type as an accessor property (like, for example `VueTypes.string`) else will setup the type as a configurable method (like, for example `VueTypes.arrayOf`).

Examples:

```js
// as an accessor type
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

Note that if `getter` is set to `false`, arguments passed to the type will be passed to the `validator` method together with the prop value:

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

### Inherit from VueTypes types

You can set a previously set type as _parent_ for a new one by setting it as the new type's `type` property. This feature can be useful to create named aliases:

```js
const shape = VueTypes.shape({ name: String, age: Number })

VueTypes.extend({
  name: 'user',
  getter: true,
  type: shape,
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
  type: shape,
  validator(value) {
    return value && value.surname === 'Doe'
  },
})

const data = { name: 'John', surname: 'Smith' }
console.log(VueTypes.utils.validate(data, VueTypes.userDoe)) // false
```

**Note:** Types created with this method don't support the `validate` method even if their parent type supports it (like `VueTypes.string` or `VueTypes.number`).

### Define multiple types

To define multiple types at once pass an array of definitions as first argument:

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
```

### Typescript

When used in a TypeScript project, types added via `.extend()` might fail type checking. In order to instruct TypeScript about your custom types you can use the following pattern:

```ts
// propTypes.ts

// import
// - VueTypes library
// - validation object interface (VueTypeDef or VueTypeValidableDef)
import VueTypes, { VueTypeDef, VueTypeValidableDef } from 'vue-types'

type VueTypesInterface = typeof VueTypes

interface ProjectTypes extends VueTypesInterface {
  //VueTypeDef accepts the prop expected type as argument
  maxLength(max: number): VueTypeDef<string>
  // use VueTypeValidableDef if the new type is going to support the `validate` method.
  positive: VueTypeValidableDef<number>
}

VueTypes.extend([
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

export default VueTypes as ProjectTypes
```

Then import the newly created `prop-types.ts` instead of `vue-types`:

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

### Extending in ES6+

If your source code supports ES6 or newer, you can use the native ES `extends` feature with the `toType` and `toValidableType` to add custom types.

For example you could create a `prop-types.js` file in your project and export there the extended VueTypes class:

```js
import VueTypes, { toType, toValidableType } from 'vue-types'
export default class ProjectTypes extends VueTypes {
  // define a custom type that accepts configuration parameters
  static maxLength(max: number) {
    return toType('maxLength', {
      type: String,
      validator: (max: number, v: string) => v.length <= max,
    })
  }

  // a native-like type that supports the `.validable` method
  static get positive() {
    return toValidableType('positive', {
      type: Number,
      validator: (v: number) => v > 0,
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
