# Namespaced Usage

The default export of `vue-types` exposes an ES6 class object that mimics React prop-type.

## Native Types

Most native types come with:

- a default value (not available in `.any` and `.symbol`).
- a `.def(any)` method to reassign the default value for the current prop. The passed-in value will be validated against the type configuration in order to prevent invalid values.
- a `isRequired` flag to set the `required: true` key.
- a `validate(function)` method to set a custom validator function (not available in `.integer` and `symbol`).

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

### `any`

Validates any type of value and **has no default value**.

### `array`

Validates that a prop is an array primitive.

- default: an empty array

_Note: [Vue prop validation](https://vuejs.org/v2/guide/components-props.html#Prop-Validation) requires Array definitions to provide default value as a factory function. `VueTypes.array.def()` accepts both factory functions and arrays. In the latter case, VueTypes will convert the value to a factory function for you._

### `bool`

Validates boolean props.

- default: `true`

### `func`

Validates that a prop is a function.

- default: an empty function

### `number`

Validates that a prop is a number.

- default: `0`

### `integer`

Validates that a prop is an integer.

- default: `0`

### `object`

Validates that a prop is an object.

- default: an empty object

_Note: [Vue prop validation](https://vuejs.org/v2/guide/components-props.html#Prop-Validation) requires Object definitions to provide default value as a factory function. `VueTypes.object.def()` accepts both factory functions and plain objects. In the latter case, VueTypes will convert the value to a factory function for you._

### `string`

Validates that a prop is a string.

- default: `''`

### `symbol`

```js
VueTypes.symbol
```

Validates that a prop is a Symbol.

- default: none

## Native Types Configuration

All native types (with the exception of `any`) come with a sensible default value. In order to modify or disable it you can set the global option `VueTypes.sensibleDefaults`:

```js
//use vue-types default (this is the "default" value)
VueTypes.sensibleDefaults = true

//disable all sensible defaults.
//Use .def(...) to set one
VueTypes.sensibleDefaults = false

//assign an object in order to specify custom defaults
VueTypes.sensibleDefaults = {
  string: 'mystringdefault',
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

## Custom Types

Custom types are a special kind of types useful to describe complex validation requirements. By design each custom type:

- **doesn't have** any sensible default value
- **doesn't have** a `validate` method
- has a `.def()` method to assign a default value on the current prop
- has an `isRequired` flag to set the `required: true` key

```js
const oneOfPropDefault = VueTypes.oneOf([0, 1]).def(1)
// oneOfPropDefault.default === 1

const oneOfPropRequired = VueTypes.oneOf([0, 1]).isRequired
// oneOfPropRequired.required ===  true

const oneOfPropRequiredCustom = VueTypes.oneOf([0, 1]).def(1).isRequired
// oneOfPropRequiredCustom.default ===  1
// oneOfPropRequiredCustom.required === true
```

### `instanceOf()`

```js
class Person {
  // ...
}

export default {
  props: {
    user: VueTypes.instanceOf(Person),
  },
}
```

Validates that a prop is an instance of a JavaScript constructor. This uses JavaScript's `instanceof` operator.

### `oneOf()`

Validates that a prop is one of the provided values.

```js
export default {
  props: {
    genre: VueTypes.oneOf(['action', 'thriller']),
  },
}
```

### `oneOfType()`

Validates that a prop is an object that could be one of many types. Accepts both simple and `vue-types` types.

```js
export default {
  props: {
    theProp: VueTypes.oneOfType([
      String,
      VueTypes.integer,
      VueTypes.instanceOf(Person),
    ]),
  },
}
```

### `arrayOf()`

Validates that a prop is an array of a certain type.

```js
export default {
  props: {
    theProp: VueTypes.arrayOf(String),
  },
}

//accepts: ['my', 'string']
//rejects: ['my', 1]
```

### `objectOf()`

Validates that a prop is an object with values of a certain type.

```js
export default {
  props: {
    userData: VueTypes.objectOf(String),
  },
}

//accepts: userData = {name: 'John', surname: 'Doe'}
//rejects: userData = {name: 'John', surname: 'Doe', age: 30}
```

### `shape()`

Validates that a prop is an object taking on a particular shape. Accepts both simple and `vue-types` types. You can set shape's properties as `required` but (obviously) you cannot use `.def()`. On the other hand you can use `def()` to set a default value for the shape itself. Like `VueTypes.array` and `VueTypes.object`, you can pass to `.def()` either a factory function returning an object or a plain object.

```js
export default {
  props: {
    userData: VueTypes.shape({
      name: String,
      age: VueTypes.integer,
      id: VueTypes.integer.isRequired,
    }).def(() => ({ name: 'John' })),
  },
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
      id: VueTypes.integer.isRequired,
    }),
    userDataLoose: VueTypes.shape({
      name: String,
      id: VueTypes.integer.isRequired,
    }).loose,
  },
}

//accepts: userData = {name: 'John', id: 1}
//rejects: userData = {name: 'John', age: 30, id: 1}
//accepts: userData2 = {name: 'John', age: 30, id: 1} --> loose matching
```

### `custom()`

Validates prop values against a custom validator function.

```js
function minLength(value) {
  return typeof value === 'string' && value.length >= 6
}

export default {
  props: {
    theProp: VueTypes.custom(minLength),
  },
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
      'theProp is not a string or is too short',
    ),
  },
}
```

## Utilities

`vue-types` exposes some utility functions on the `.utils` property:

### `utils.validate(value, type)`

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
  },
}

VueTypes.utils.validate('John', isJohn) //true
VueTypes.utils.validate('Jane', isJohn) //false
```

### `utils.toType(name, obj)`

Will convert a plain object to a VueTypes' type object with `.def()` and `isRequired` modifiers:

```js
const password = {
  type: String,
  validator(value) {
    //very raw!
    return value.length > 10
  },
}

const passwordType = VueTypes.utils.toType('password', password)

export default {
  props: {
    password: passwordType.isRequired,
  },
}
```
