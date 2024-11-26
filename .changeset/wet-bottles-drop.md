---
'vue-types': major
---

#### Drop Vue 2 support

Vue 2 reached End of Life (EOL) on December 31st, 2023. By dropping Vue 2 compatibility we can deliver a smaller package and make the source code more maintainable.

If you're unable to update to Vue 3, please use vue-types@5.x

#### Removed `VueTypes.extend` method

`VueTypes.extend` was deprecated in v5. In v6 this method has been removed. Please migrate your code to use ES6+ `extends` feature.

Example:

Using `VueTypes.extend` (old):

```js
import VueTypes from 'vue-types';

export const VueTypesProject = VueTypes.extend([
  {
    name: 'maxLength',
    type: String,
    validator: (max, v) => v.length <= max,
  },
  {
    name: 'positive',
    getter: true,
    type: Number,
    validator: (v) => v > 0,
  },
])
```

Using ES6+ `extends` (new):

```js
import VueTypes, { toType } from 'vue-types'

export class VueTypesProject extends VueTypes {
  static maxLength(max) {
    return toType('maxLength', {
      type: String,
      validator: (v) => String(v).length <= max,
    })
  }

  static get positive() {
    return toType('positive', {
      type: Number,
      validator: (v) => v > 0,
    })
  }
}
```

#### Package format review:
* ESM and CJS builds target is ESNext (browsers with support for the latest JavaScript features).
* UMD builds target is ES2016 (aligned with [Vue 3 browser support](https://vuejs.org/about/faq#what-browsers-does-vue-support))
