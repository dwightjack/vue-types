---
'vue-types': major
'vue-types-nuxt': major
---

## Major changes:

### Drop Vue 2 support

Vue 2 reached End of Life (EOL) on December 31st, 2023. By dropping Vue 2 compatibility we can deliver a smaller package and make the source code more maintainable.

If you're unable to update to Vue 3, please use vue-types@5.x

### Package format review:
* ESM and CJS builds target is ESNext (browsers with support for the latest JavaScript features).
* UMD builds target is ES2016 (aligned with [Vue 3 browser support](https://vuejs.org/about/faq#what-browsers-does-vue-support))
