
<script setup>
import CodeExample from '../components/CodeExample.vue'
</script>

# Extending namespaced validators in ES6+

<!--@include: ./shared/warning.md-->

If your source code supports ES6 or newer, you can use the native ES `extends` feature with the `toType`, `toValidableType` or `fromType` utility functions (see [Custom validators](../advanced/custom-validators.md#custom-validators) for detailed usage instructions).

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


<CodeExample>

```vue
<script>
import ProjectTypes from './prop-types'

export default {
  name: 'MyComponent',
  props: {
    msg: ProjectTypes.maxLength(2),
    count: ProjectTypes.positive,
  },
}
</script>
```
---
```vue
<script setup>
import ProjectTypes from './prop-types'

defineProps({
  msg: ProjectTypes.maxLength(2),
  count: ProjectTypes.positive,
})
</script>
```
</CodeExample>
