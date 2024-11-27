---
---
<script setup>
import CodeExample from '../components/CodeExample.vue'
</script>

# Namespaced Usage

The default export of `vue-types` exposes an ES6 class object that mimics React prop-type.

The class object exposes both [native](./validators.md#native-validators) and [custom](./validators.md#custom-validators) validators.

::: tip
While namespaced usage is not deprecated, [named validators](./validators.md) are usually a better and more type-safe option for your project.
:::

## Native Validators

Native validators are exposed as static getter factories:

<CodeExample>

```js
import VueTypes from 'vue-types'

export default {
  props: {
    message: VueTypes.string.isRequired,
  },
}
```
---
```js
import VueTypes from 'vue-types'

defineProps({
  message: VueTypes.string.isRequired,
})
```
</CodeExample>

::: warning NOTE

The main difference between namespaced native validators and those directly imported from the library is that the former come (usually) **with a default value already defined** (see table below).

:::

<div id="default-values">

### Native validators default values

| Validator | Default    | `validate()` method |
| --------- | ---------- | ------------------- |
| any       | -          | yes                 |
| func      | `() => {}` | yes                 |
| bool      | `true`     | yes                 |
| string    | `''`       | yes                 |
| number    | `0`        | yes                 |
| array     | `[]`       | yes                 |
| integer   | `0`        | -                   |
| symbol    | -          | -                   |
| object    | `{}`       | yes                 |
| nullable  | -          | -                   |

</div>

Examples:

```js
const numProp = VueTypes.number
// numProp === { type: Number, default : 0 }

const numPropCustom = VueTypes.number.def(10)
// numPropCustom ===  { type: Number, default : 10 }

const stringProp = VueTypes.string
// stringProp ===  { type: String, default : '' }
```

## Native types configuration

All native validators (with the exception of `any` and `symbol`) come with a sensible default value. To customize or disable that value, you can set the global option `VueTypes.sensibleDefaults`:

```js
//use VueTypes built-in defaults (this is the "default" behavior)
VueTypes.sensibleDefaults = true

//disable all sensible defaults.
//Use .def(...) when you need a default value
VueTypes.sensibleDefaults = false

//assign an object to specify custom defaults
VueTypes.sensibleDefaults = {
  // the key must match the validator name
  string: 'mystringdefault',
  //...
}
```

Under the hood `VueTypes.sensibleDefaults` is a plain object implemented with custom getters/setters. That let's you play with it like you'd do with every other object.

For example you can remove some of the default values using [object rest spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#Spread_in_object_literals) or [lodash.omit](https://lodash.com/docs/4.17.11#omit).

```js
console.log(VueTypes.bool.default)
// logs true

// copy every default value but boolean
const { bool, ...newDefaults } = VueTypes.sensibleDefaults

// or, with lodash
// const newDefaults = _.omit(VueTypes.sensibleDefaults, ['bool'])

VueTypes.sensibleDefaults = newDefaults

console.log(VueTypes.bool.default) // logs undefined
console.log(VueTypes.string.default) // logs ''
```

::: tip
To unset the default value for an individual validator instance use `.def(undefined)`

```js
const type = VueTypes.string
// { type: String, default: '' }

const type2 = VueTypes.string.def(undefined)
// { type: String }
```

**Note:** Executing `.def(undefined)` on boolean or mixed-boolean types, explicitly sets the `default` property to `undefined`:

```js
const type = VueTypes.bool.def(true)
// { type: Boolean, default: true }

type.def(undefined)
// { type: Boolean, default: undefined }

const mixedType = VueTypes.oneOfType([String, Boolean])
// { type: [Boolean, String] }

mixedType.def(undefined)
// { type: [Boolean, String], default: undefined }
```

:::

## Custom Validators

Custom validators are exposed as static methods. Refer to the [dedicated documentation](/guide/validators.html#custom-validators) for usage instructions.

```js
const arrayOfStrings = VueTypes.arrayOf(String)
```

## Utilities

The class object exposes some utility functions under the `.utils` property:

### utils.validate(value, type)

Checks a value against a type definition:

```js
VueTypes.utils.validate('John', VueTypes.string) //true

VueTypes.utils.validate('John', { type: String }) //true
```

::: warning

This utility won't check for `isRequired` flag, but will execute any provided custom validator function:

```js
const isJohn = VueTypes.string.validate((value) => value === 'John')

VueTypes.utils.validate('John', isJohn) //true
VueTypes.utils.validate('Jack', isJohn) //false
```

:::

### utils.toType(name, obj, validable = false)

Will convert a plain object to a VueTypes validator object with `.def()` and `isRequired` modifiers:

```js
const minLength = {
  type: String,
  validator(value) {
    return value.length > 10
  },
}

const minLengthType = VueTypes.utils.toType('minLength', minLength)

export default {
  props: {
    username: minLengthType.isRequired,
  },
}
```

If the last argument is `true` the resulting validator object will support the `.validate()` method as well:

```js
const password = {
  type: String,
  required: true
}

const passwordType = VueTypes.utils.toType('password', password, true)

export default {
  props: {
    // this password prop must include at least a digit
    password: passwordType.validate((v) => /[0-9]/test.(v)),
  },
}
```
