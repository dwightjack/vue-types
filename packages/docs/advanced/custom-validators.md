---
outline: 2
---

<script setup>
import CodeExample from '../components/CodeExample.vue'
</script>

# Custom validators

The `toType`, `toValidableType`, and `fromType` functions can be used to create custom standalone validators. In fact, they are used internally by `vue-types` in [native](/guide/validators.html#native-validators) and [custom](/guide/validators.html#custom-validators) validators.

## Custom validators from scratch

In the following example, we define a validator for positive numbers:

<CodeExample>

```ts
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

---

```ts
const positive = () =>
  toType('positive', {
    type: Number,
    validator: (v) => v >= 0,
  })

defineProps({
  myNumber: positive().isRequired,
})
```

</CodeExample>

Both `toType` and `toValidableType` accept the following arguments:

| name   | type   | description                                                                                                       |
| ------ | ------ | ----------------------------------------------------------------------------------------------------------------- |
| `name` | string | The validator name, used for logging                                                                              |
| `type` | object | An object compatible with Vue.js [prop validation](https://vuejs.org/guide/components/props.html#prop-validation) |

::: tip
The difference between `toType` and `toValidableType` is that the latter creates validators that support the `.validate()` method to set up custom validation logic.
:::

## Composing existing validators

To promote code reusability and composability, you can use `fromType` to reuse an existing validator or validator instance as a base for a new validator.

Function arguments:

| name     | type      | required | description                                     |
| -------- | --------- | -------- | ----------------------------------------------- |
| `name`   | string    | yes      | The validator name, used for logging            |
| `source` | validator | yes      | Source prop validator                           |
| `props`  | object    | -        | Custom [validation properties][prop-validation] |

[prop-validation]: https://vuejs.org/guide/components/props.html#prop-validation

Example:

```js
import { fromType, shape, number, string } from 'vue-types'

const user = shape({
  ID: number(),
  name: string(),
})

// Clone the user shape and make it required
const userRequired = fromType('userRequired', user, { required: true })
```

::: warning
Properties defined in the third argument overwrite those specified in the base validator.

The only exception is `validator()`: these functions are and executed in sequence until one returns `false`.

```js
import { fromType, shape, number, string } from 'vue-types'

const userRequired = shape({
  ID: number(),
  name: string(),
}).isRequired

// `userJohn` is not required.
// After validating the shape, it ensures that `name === 'John'`.
const userJohn = fromType('userJohn', user, {
  required: false,
  validator(value) {
    return value.name === 'John'
  },
})
```

:::
