---
aside: false
---

# Troubleshooting

[[toc]]

## ESLint reports a `vue/require-default-prop` error for certain vue-types validators.

If your uses eslint-plugin-vue v6 or lower, you might receive a linting error related to the [vue/require-default-prop](https://eslint.vuejs.org/rules/require-default-prop.html) rule for validators using the `.isRequired` or `.loose` flag (see [vue-types#179](https://github.com/dwightjack/vue-types/issues/179)).

The best solution to fix this issue is to upgrade the library eslint-plugin-vue to v7.

However, if you cannot upgrade the library, you can install [eslint-plugin-vue-types](https://github.com/dwightjack/eslint-plugin-vue-types). The plugin extends eslint-plugin-vue and filters out most incorrectly flagged usage cases.

Read the [plugin documentation](https://github.com/dwightjack/eslint-plugin-vue-types#eslint-plugin-vue-types) for installation and usage details.
