---
---

# Configuration

VueTypes has a global configuration object that can be used to customize the library's behavior.

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

- `logLevel`: (string, default `warn`) allows choosing which console method will be used to display validation errors. Available options are `log`, `warn`, `error`, `debug` and`info`.
