# vue-prop-types

> Prop type definitions for [Vue.js](http://vuejs.org). Compatible with both Vue 1.x and 2.x

## Introduction

`vue-prop-types` is a collection of configurable [prop type](http://vuejs.org/guide/components.html#Props) definitions for Vue.js components, inspired by `React.PropTypes`.
  
### When to use

While basic prop type definition in Vue is simple and convenient, detailed prop validation can become verbose on complex components.
This is the case for `vue-prop-types`.

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

import VuePropTypes from 'vue-pro-types';

export default {
  props: {
    id: VuePropTypes.number.def(10),
    name: VuePropTypes.string.isRequired,
    age: VuePropTypes.integer,
    // No need for `default` or `required` key, so keep it simple
    nationality: String 
  },
  methods: {
    // ...
  }
}
```


## Installation

### NPM 

``` bash
npm install vue-prop-types --save
```

## Documentation

### Native Types

Most native types come with a default value, a `.def()` method to reassign the default value for the current prop and a `isRequired` flag to set the `required: true` key

```js
const numProp = vueTypes.number
// numProp === { type: Number, default : 0}

const numPropCustom = vueTypes.number.def(10)
// numPropCustom ===  { type: Number, default : 10}

const numPropRequired = vueTypes.number.isRequired
// numPropCustom ===  { type: Number, required : true}

const numPropRequiredCustom = vueTypes.number.def(10).isRequired
// numPropRequiredCustom ===  { type: Number, default: 10, required : true}
```

#### `VuePropTypes.any`

Validates any type of value and has no default value.

#### `VuePropTypes.array`

Validates that a prop is an array primitive.

* Default: `Array`

#### `VuePropTypes.bool`

Validates boolean props.

* default: `true`

#### `VuePropTypes.func`

Validates that a prop is a function.

* default: an empty function

#### `VuePropTypes.number`

Validates that a prop is a number.

* default: `0`

#### `VuePropTypes.integer`

Validates that a prop is an integer (uses `Number.isInteger`).

* default: `0`

#### `VuePropTypes.object`

```js
VuePropTypes.object
```

Validates that a prop is an object.

* default: `Object`

#### `VuePropTypes.string`

```js
VuePropTypes.string
```

Validates that a prop is a string.

* default: `''`

### Custom Types

Custom types have not default value, a `.def()` method to assign a default value for the current prop and a `isRequired` flag to set the `required: true` key

```js
const oneOfPropDefault = vueTypes.oneOf([0, 1]).def(1)
// oneOfPropCustom.default === 1

const oneOfPropRequired = vueTypes.oneOf([0, 1]).isRequired
// oneOfPropCustom.required ===  true

const oneOfPropRequiredCustom = vueTypes.oneOf([0, 1]).def(1).isRequired
// oneOfPropRequiredCustom.default ===  1
// oneOfPropRequiredCustom.required === true
```

#### `VuePropTypes.instanceOf()`

```js
class Person {
  // ...
}

export default {
  props: {
    user: VuePropTypes.instanceOf(Person)
  }
}
```

Validates that a prop is an instance of a JavaScript constructor. This uses JavaScript's `instanceof` operator.

#### `VuePropTypes.oneOf()`

```js
VuePropTypes.oneOf(arrayOfValues)
```

Validates that a prop is one of the provided values.

```js
export default {
  props: {
    genre: VuePropTypes.oneOf(['action', 'thriller'])
  }
}
```

#### `VuePropTypes.oneOfType()`

Validates that a prop is an object that could be one of many types. Accepts both simple and `vue-prop-types` types.

```js
export default {
  props: {
    theProp: VuePropTypes.oneOfType([
      String, 
      VuePropTypes.integer,
      VuePropTypes.instanceOf(Person)
    ])
  }
}
```

#### `VuePropTypes.arrayOf()`

Validates that a prop is an array of a certain type.

```js
export default {
  props: {
    theProp: VuePropTypes.arrayOf(String)
  }
}

//accepts: ['my', 'string']
//rejects: ['my', 1]
```

#### `VuePropTypes.objectOf()`

Validates that a prop is an object with values of a certain type.

```js
export default {
  props: {
    userData: VuePropTypes.objectOf(String)
  }
}

//accepts: userData = {name: 'John', surname: 'Doe'}
//rejects: userData = {name: 'John', surname: 'Doe', age: 30}
```

#### `VuePropTypes.shape()`

Validates that a prop is an object taking on a particular shape. Accepts both simple and `vue-prop-types` types.

```js
export default {
  props: {
    userData: VuePropTypes.shape({
      name: String,
      age: VuePropTypes.integer
    })
  }
}

//accepts: userData = {name: 'John', age: 30}
//rejects: userData = {name: 'John', age: 'wrong data'}
```

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2016 Marco Solazzi

