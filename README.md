# vue-types

> Prop type definitions for [Vue.js](http://vuejs.org). Compatible with both Vue 1.x and 2.x


<!-- TOC depthTo:3 -->

- [Introduction](#introduction)
    - [When to use](#when-to-use)
- [Installation](#installation)
    - [NPM package](#npm-package)
    - [CDN delivered `<script>`](#cdn-delivered-script)
- [Usage with `eslint-plugin-vue`](#usage-with-eslint-plugin-vue)
- [Production build](#production-build)
    - [Webpack](#webpack)
    - [Rollup](#rollup)
- [Documentation](#documentation)
    - [Native Types](#native-types)
    - [Native Types Configuration](#native-types-configuration)
    - [Custom Types](#custom-types)
    - [Extending VueTypes](#extending-vuetypes)
    - [Utilities](#utilities)
- [License](#license)

<!-- /TOC -->

## Introduction

`vue-types` is a collection of configurable [prop type](http://vuejs.org/guide/components.html#Props) definitions for Vue.js components, inspired by React's `prop-types`.

[Try it now!](https://codesandbox.io/embed/vue-types-template-khfk4)

### When to use

While basic prop type definition in Vue is simple and convenient, detailed prop validation can become verbose on complex components.
This is the case for `vue-types`.

Instead of:

```js
export default {
  props: {
    id: {
      type: Number,
      default: 10
    },
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      validator(value) {
        return Number.isInteger(value)
      }
    },
    nationality: String
  },
  methods: {
    // ...
  }
};
```

You may write:

```js

import VueTypes from 'vue-types';

export default {
  props: {
    id: VueTypes.number.def(10),
    name: VueTypes.string.isRequired,
    age: VueTypes.integer,
    // No need for `default` or `required` key, so keep it simple
    nationality: String
  },
  methods: {
    // ...
  }
}
```


## Installation

### NPM package

``` bash
npm install vue-types --save
# or
yarn add vue-types
```

### CDN delivered `<script>`

add the following script tags before your code
```html
<script src="https://unpkg.com/vue-types"></script>
```

## Usage with `eslint-plugin-vue`

When used in a project with [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue), the linter might report errors related to the `vue/require-default-prop` rule.

To prevent that error use [eslint-plugin-vue-types](https://github.com/dwightjack/eslint-plugin-vue-types)

## Production build

Vue.js does not validate components' props when used in a production build. If you're using a bundler such as Webpack or rollup you can shrink vue-types filesize by around **70%** (minified and gzipped) by removing the validation logic while preserving the library's API methods. To achieve that result setup an alias to `vue-types/es/shim.js` (`vue-types/dist/shim.js` if you're using CommonJS modules).

If you're including the library via a `script` tag use the dedicated shim build file:

```html
<script src="https://unpkg.com/vue-types@latest/umd/vue-types.shim.min.js"></script>
```

**Note:** In order to use a specific version of the library change `@latest` with `@<version-number>`:

```html
<!-- use the shim from version 1.6.0 -->
<script src="https://unpkg.com/vue-types@1.6.0/umd/vue-types.shim.min.js"></script>
```

### Webpack

The following example will shim the module in Webpack by adding an [alias field](https://webpack.js.org/configuration/resolve/#resolve-alias) to the configuration when `NODE_ENV` is set to `"production"`:

```js
// webpack.config.js

return {
  // ... configuration
  resolve: {
    alias: {
      'vue-types': process.env.NODE_ENV === 'production' ? 'vue-types/es/shim.js' : undefined
    }
  }
}
```

### Rollup

The following example will shim the module in rollup using [rollup-plugin-alias](https://github.com/rollup/rollup-plugin-alias) when `NODE_ENV` is set to `"production"`:

```js
// rollup.config.js
import alias from 'rollup-plugin-alias';

return {
  // ... configuration
  plugins: [
    process.env.NODE_ENV === 'production' ? alias({
      'vue-types': './node_modules/vue-types/es/shim.js'
    })
  ]
}
```

Note: If you are using [rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve) make sure to place the alias plugin **before** the resolve plugin.

## Documentation

### Native Types

Most native types come with:

* a default value (not available in `.any` and `.symbol`).
* a `.def(any)` method to reassign the default value for the current prop. The passed-in value will be validated against the type configuration in order to prevent invalid values.
* a `isRequired` flag to set the `required: true` key.
* a `validate(function)` method to set a custom validator function (not available in `.integer`).

```js
const numProp = VueTypes.number
// numProp === { type: Number, default : 0}

const numPropCustom = VueTypes.number.def(10)
// numPropCustom ===  { type: Number, default : 10}

const numPropRequired = VueTypes.number.isRequired
// numPropRequired ===  { type: Number, required : true}

const numPropRequiredCustom = VueTypes.number.def(10).isRequired
// numPropRequiredCustom ===  { type: Number, default: 10, required : true}

const gtTen = (num) => num > 10
const numPropGreaterThanTen = VueTypes.number.validate(gtTen)
// numPropGreaterThanTen ===  { type: Number, validator: (num) => num > 10 }
```

#### `VueTypes.any`

Validates any type of value and **has no default value**.

#### `VueTypes.array`

Validates that a prop is an array primitive.

* default: an empty array

_Note: [Vue prop validation](https://vuejs.org/v2/guide/components-props.html#Prop-Validation) requires Array definitions to provide default value as a factory function. `VueTypes.array.def()` accepts both factory functions and arrays. In the latter case, VueTypes will convert the value to a factory function for you._

#### `VueTypes.bool`

Validates boolean props.

* default: `true`

#### `VueTypes.func`

Validates that a prop is a function.

* default: an empty function

#### `VueTypes.number`

Validates that a prop is a number.

* default: `0`

#### `VueTypes.integer`

Validates that a prop is an integer.

* default: `0`

#### `VueTypes.object`

Validates that a prop is an object.

* default: an empty object

_Note: [Vue prop validation](https://vuejs.org/v2/guide/components-props.html#Prop-Validation) requires Object definitions to provide default value as a factory function. `VueTypes.object.def()` accepts both factory functions and plain objects. In the latter case, VueTypes will convert the value to a factory function for you._

#### `VueTypes.string`

Validates that a prop is a string.

* default: `''`

#### `VueTypes.symbol`

```js
VueTypes.symbol
```

Validates that a prop is a Symbol.

* default: none

### Native Types Configuration

All native types (with the exception of `any`) come with a sensible default value. In order to modify or disable it you can set the global option `VueTypes.sensibleDefaults`:

```js
//use vue-types default (this is the "default" value)
VueTypes.sensibleDefaults = true

//disable all sensible defaults.
//Use .def(...) to set one
VueTypes.sensibleDefaults = false

//assign an object in order to specify custom defaults
VueTypes.sensibleDefaults = {
  string: 'mystringdefault'
  //...
}
```

Under the hood `VueTypes.sensibleDefaults` is a plain object with just some added _magic_. That let's you play with it like you'd do with every other object.

For example you can remove some of the default values by leveraging [object rest spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#Spread_in_object_literals) or [lodash.omit](https://lodash.com/docs/4.17.11#omit) like functions.

```js
// copy every default value but boolean

console.log(VueTypes.bool.default)
// logs true

const { bool, ...newDefaults } = VueTypes.sensibleDefaults

VueTypes.sensibleDefaults = newDefaults
// or VueTypes.sensibleDefaults = _.omit(VueTypes.sensibleDefaults, ['bool'])

console.log(VueTypes.bool.default)
// logs undefined
```

### Custom Types

Custom types are a special kind of types useful to describe complex validation requirements. By design each custom type:

* **doesn't have** any sensible default value
* **doesn't have** a `validate` method
* has a `.def()` method to assign a default value on the current prop
* has an `isRequired` flag to set the `required: true` key

```js
const oneOfPropDefault = VueTypes.oneOf([0, 1]).def(1)
// oneOfPropDefault.default === 1

const oneOfPropRequired = VueTypes.oneOf([0, 1]).isRequired
// oneOfPropRequired.required ===  true

const oneOfPropRequiredCustom = VueTypes.oneOf([0, 1]).def(1).isRequired
// oneOfPropRequiredCustom.default ===  1
// oneOfPropRequiredCustom.required === true
```

#### `VueTypes.instanceOf()`

```js
class Person {
  // ...
}

export default {
  props: {
    user: VueTypes.instanceOf(Person)
  }
}
```

Validates that a prop is an instance of a JavaScript constructor. This uses JavaScript's `instanceof` operator.

#### `VueTypes.oneOf()`

Validates that a prop is one of the provided values.

```js
export default {
  props: {
    genre: VueTypes.oneOf(['action', 'thriller'])
  }
}
```

#### `VueTypes.oneOfType()`

Validates that a prop is an object that could be one of many types. Accepts both simple and `vue-types` types.

```js
export default {
  props: {
    theProp: VueTypes.oneOfType([
      String,
      VueTypes.integer,
      VueTypes.instanceOf(Person)
    ])
  }
}
```

#### `VueTypes.arrayOf()`

Validates that a prop is an array of a certain type.

```js
export default {
  props: {
    theProp: VueTypes.arrayOf(String)
  }
}

//accepts: ['my', 'string']
//rejects: ['my', 1]
```

#### `VueTypes.objectOf()`

Validates that a prop is an object with values of a certain type.

```js
export default {
  props: {
    userData: VueTypes.objectOf(String)
  }
}

//accepts: userData = {name: 'John', surname: 'Doe'}
//rejects: userData = {name: 'John', surname: 'Doe', age: 30}
```

#### `VueTypes.shape()`

Validates that a prop is an object taking on a particular shape. Accepts both simple and `vue-types` types. You can set shape's properties as `required` but (obviously) you cannot use `.def()`. On the other hand you can use `def()` to set a default value for the shape itself. Like `VueTypes.array` and `VueTypes.object`, you can pass to `.def()` either a factory function returning an object or a plain  object.

```js
export default {
  props: {
    userData: VueTypes.shape({
      name: String,
      age: VueTypes.integer,
      id: VueTypes.integer.isRequired
    }).def(() => ({ name: 'John' }))
  }
}

// default value = {name: 'John'}
//accepts: userData = {name: 'John', age: 30, id: 1}
//rejects: userData = {name: 'John', age: 'wrong data', id: 1}
//rejects: userData = {name: 'John', age: 'wrong data'} --> missing required `id` key
```

By default `.shape()` won't validate objects with properties not defined in the shape. To allow partial matching use the `loose` flag:

```js
export default {
  props: {
    userData: VueTypes.shape({
      name: String,
      id: VueTypes.integer.isRequired
    }),
    userDataLoose: VueTypes.shape({
      name: String,
      id: VueTypes.integer.isRequired
    }).loose
  }
}

//accepts: userData = {name: 'John', id: 1}
//rejects: userData = {name: 'John', age: 30, id: 1}
//accepts: userData2 = {name: 'John', age: 30, id: 1} --> loose matching
```

#### `VueTypes.custom()`

Validates prop values against a custom validator function.

```js

function minLength(value) {
    return typeof value === 'string' && value.length >= 6
  }

export default {
  props: {
    theProp: VueTypes.custom(minLength)
  }
}

//accepts: 'string'
//rejects: 'my', 1
```

Note that the passed-in function name will be used as the custom validator name in warnings.

You can pass a validation error message as second argument as well:

```js
function minLength(value) {
    return typeof value === 'string' && value.length >= 6
  }

export default {
  props: {
    theProp: VueTypes.custom(
      minLength,
      'theProp is not a string or is too short'
    )
  }
}
```

### Extending VueTypes

You can extend VueTypes with your own types via `VueTypes.extend({...})`. The method accepts an object with every key supported by [Vue prop validation objects](https://vuejs.org/v2/guide/components-props.html#Prop-Validation) plus the following custom properties:

- `name`: (string, required) The type name. Will be exposed as VueType.<name>
- `validate`: (boolean, default: `false`) If `true` the type will have a `validate` method like native types.
- `getter`: (boolean, default: `false`) If `true` will setup the type as an accessor property (like, for example `VueTypes.string`) else will setup the type as a configurable method (like, for example `VueTypes.arrayOf`).

Examples:
```js
// as an accessor type
VueTypes.extend({
  name: 'negative',
  getter: true,
  type: Number,
  validator: (v) => v < 0
})

const negativeProp = VueTypes.negative

// as a configurable method
VueTypes.extend({
  name: 'negativeFn',
  type: Number,
  validator: (v) => v < 0
})

const negativeProp2 = VueTypes.negativeFn() // <-- we need to call it
```

Note that if `getter` is set to `false`, arguments passed to the type will be passed to the `validator` method together with the prop value:

```js
VueTypes.extend({
  name: 'maxLength',
  // getter: false, this is the default
  type: String,
  validator: (max, v) => v.length <= max
})

const maxLengthType = VueTypes.maxLength(2)

maxLengthType.validator('ab') // true
maxLengthType.validator('abcd') // false
```

#### Typescript

When used in a TypeScript project, types added via `.extend()` might fail type checking. In order to instruct TypeScript about your custom types you can use the following pattern:

```ts
// propTypes.ts

// import
// - VueTypes library
// - validation object interface (VueTypeDef)
// - the default VueType interface (VueTypesInterface)
import VueTypes, { VueTypeDef, VueTypesInterface } from 'vue-types'

interface ProjectTypes extends VueTypesInterface {
  //VueTypeDef accepts the prop expected type as argument
  maxLength(max: number): VueTypeDef<string>
}

VueTypes.extend({
  name: 'maxLength',
  type: String,
  validator: (max: number, v: string) => v.length <= max
})

export default VueTypes as ProjectTypes
```

Then import the newly created `propTypes.ts` instead of `vue-types`:

```html
<!-- MyComponent.vue -->
<template>
<!-- template here -->
</template>
<script lang="ts">
import Vue from "vue";
import VueTypes from "./prop-types";

export default Vue.extend({
  name: "MyComponent",
  props: {
    msg: VueTypes.maxLength(2)
  }
});
</script>
```

### Utilities

`vue-types` exposes some utility functions on the `.utils` property:

#### `VueTypes.utils.validate(value, type)`

Checks a value against a type definition

```js
VueTypes.utils.validate('John', VueTypes.string) //true

VueTypes.utils.validate('John', { type: String }) //true
```

Note that this utility won't check for `isRequired` flag, but will execute any custom validator function is provided.

```js
const isJohn = {
  type: String,
  validator(value) {
    return value.length === 'John'
  }
}

VueTypes.utils.validate('John', isJohn) //true
VueTypes.utils.validate('Jane', isJohn) //false
```

#### `VueTypes.utils.toType(name, obj)`

Will convert a plain object to a VueTypes' type object with `.def()` and `isRequired` modifiers:

```js
const password = {
  type: String,
  validator(value) {
    //very raw!
    return value.length > 10
  }
}

const passwordType = VueTypes.utils.toType('password', password)

export default {
  props: {
    password: passwordType.isRequired
  }
}

```

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2018 Marco Solazzi
