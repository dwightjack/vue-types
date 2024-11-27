---
---

# Configuration

Starting from version 4, VueTypes has a global configuration object that can be used to customize the library's behavior.

The configuration is exposed both as a property of the default export, and as a named export:

::: tabs

== Named export

```js
import { config } from 'vue-types'

VueTypes.config === config
```

== Default export

```js{sss.js}
import VueTypes from 'vue-types'

VueTypes.config === config
```

:::

## Configuration Options

- `silent`: (boolean, default `false`) set to `true` to prevent VueTypes from logging validation warnings.

::: tip
Until version 2, VueTypes warning behavior was matching the [Vue.config.silent](https://vuejs.org/v2/api/#silent) global config parameter. But that global property has been removed in Vue@3.

To reproduce that behavior in application running Vue@2 you can use:

```ts
import { config } from 'vue-types'
import Vue from 'vue'

config.silent = Vue.config.silent
```

:::

- `logLevel`: (string, default `warn`) allows choosing which console method will be used to display validation errors. Available options are `log`, `warn`, `error`, `debug` and`info`.
