<script setup>
import CodeExample from '../components/CodeExample.vue'
</script>

# Configuration

VueTypes has a global configuration object that can be used to customize the library's behavior.

The configuration is exposed both as a property of the default export and as a named export:

<CodeExample>

```js
import { config } from 'vue-types'

VueTypes.config === config
```

---

```js
import VueTypes from 'vue-types'

VueTypes.config === config
```

</CodeExample>

## Configuration Options

- `silent`: (boolean, default `false`) Set to `true` to prevent VueTypes from logging validation warnings.

- `logLevel`: (string, default `warn`) Allows choosing which console method used to display validation errors. Available options are `log`, `warn`, `error`, `debug`, and `info`.
