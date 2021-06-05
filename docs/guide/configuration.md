---
sidebarDepth: 1
---

# Configuration

Starting from version 4, VueTypes has a global configuration object that can be used to customize the library's behavior.

The configuration is exposed both as a property of the default export, and as a named export:

```ts
// default exported instance
import VueTypes from 'vue-types'

// named export
import { config } from 'vue-types'

VueTypes.config === config
```

## Configuration Options

At the moment, there is only one configuration option:

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
