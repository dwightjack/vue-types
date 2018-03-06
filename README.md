# vue-types

> Prop type definitions for [Vue.js](http://vuejs.org). Compatible with both Vue 1.x and 2.x

## Introduction

`vue-types` is a collection of configurable [prop type](http://vuejs.org/guide/components.html#Props) definitions for Vue.js components, inspired by React's `prop-types`.

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

## Documentation

### Native Types

Most native types come with:

* a default value,
* a `.def()` method to reassign the default value for the current prop
* a `isRequired` flag to set the `required: true` key

```js
const numProp = vueTypes.number
// numProp === { type: Number, default : 0}

const numPropCustom = vueTypes.number.def(10)
// numPropCustom ===  { type: Number, default : 10}

const numPropRequired = vueTypes.number.isRequired
// numPropRequired ===  { type: Number, required : true}

const numPropRequiredCustom = vueTypes.number.def(10).isRequired
// numPropRequiredCustom ===  { type: Number, default: 10, required : true}
```

#### `VueTypes.any`

Validates any type of value and **has no default value**.

#### `VueTypes.array`

Validates that a prop is an array primitive.

* default: an empty array

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

All native types (with the exception of `any`) come with a sensible default value. In order to modify or disable it you can set the global option `vueTypes.sensibleDefaults`:

```js
//use vue-types default (this is the "default" value)
vueTypes.sensibleDefaults = true

//disable all sensible defaults.
//Use .def(...) to set one
vueTypes.sensibleDefaults = false

//assign an object in order to specify custom defaults
vueTypes.sensibleDefaults = {
  string: 'mystringdefault'
  //...
}
```

### Custom Types

Custom types are a special kind of types useful to describe complex validation requirements. By design each custom type:

* **doesn't have** any sensible default value
* has a `.def()` method to assign a default value on the current prop
*  has an `isRequired` flag to set the `required: true` key

```js
const oneOfPropDefault = vueTypes.oneOf([0, 1]).def(1)
// oneOfPropDefault.default === 1

const oneOfPropRequired = vueTypes.oneOf([0, 1]).isRequired
// oneOfPropRequired.required ===  true

const oneOfPropRequiredCustom = vueTypes.oneOf([0, 1]).def(1).isRequired
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

Validates that a prop is an object taking on a particular shape. Accepts both simple and `vue-types` types. You can set shape's types as `required` but (obviously) you cannot use `.def()`

```js
export default {
  props: {
    userData: VueTypes.shape({
      name: String,
      age: VueTypes.integer,
      id: VueTypes.integer.isRequired
    })
  }
}

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
