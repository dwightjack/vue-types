# Custom Instance

<!--@include: ./shared/warning.md-->

The [sensibleDefaults](./index.md#native-types-configuration) and [extend](./extend.md) features allow you to customize the library to better fit your project.

However, these features come with a downside: because they mutate the same `VueTypes` object, applications sharing the same module (i.e., importing the same library instance from `node_modules`) might alter each other's behavior when using validators.

For example, suppose we have a library `core` and an application `ui`, both using `VueTypes`. In `core`, we define a custom default and use it:

```js
// core/types.js
import VueTypes from 'vue-types'

VueTypes.sensibleDefaults = {
  ...VueTypes.sensibleDefaults,
  string: 'hello',
}

// core/component.vue
import VueTypes from './types'

export default {
  props: {
    greeting: VueTypes.string, // default is 'hello'
  },
}
```

Now, if we import VueTypes in `ui`, we might expect the default value for `VueTypes.string` to be an empty string. However, depending on how the bundler imports our modules, that might not be the case.

That's because in the `core/types.js` module **we globally mutated the VueTypes object**.

```js
// ui/ui-component.js
import VueTypes from 'vue-types'

export default {
  props: {
    greeting: VueTypes.string, // default is ???
  },
}
```

## Introducing `createTypes`

To prevent this issue, VueTypes provides a `createTypes` function that returns a fresh namespaced object.

```js
import { createTypes } from 'vue-types'

const MyTypes = createTypes()

const MyComponent = {
  props: {
    name: MyTypes.string,
  },
}
```

The function accepts an optional object argument with sensible defaults. If nothing is provided, the new object has the [same defaults](./index.md#default-values) as the default VueTypes object.

```js
import { createTypes } from 'vue-types'

// namespaced validators without default values
const MyTypes = createTypes({})

const MyComponent = {
  props: {
    name: MyTypes.string, // default is `undefined`
  },
}
```

## Extending a Custom Namespaced Instance

Like the default `VueTypes` instance, custom namespaced instances can be extended with the ES6+ [`extend` keyword](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends):

This allows you to set up highly customizable custom validators:

```js
// ./src/prop-types.js

import { createTypes, toType } from 'vue-types'

export default class MyTypes extends createTypes() {
  static get string() {
    return toType({
      type: String,
    }).def('hello')
  }
}
```
