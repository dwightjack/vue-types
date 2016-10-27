import isPlainObject from 'lodash.isplainobject'
import { noop, toType, isFunction, validateType, withDefault, withRequired } from './utils'

const VuePropTypes = {

  any: {
    type: null
  },

  func: {
    type: Function,
    default: noop
  },

  bool: {
    type: Boolean,
    default: true
  },

  string: {
    type: String,
    default: ''
  },

  number: {
    type: Number,
    default: 0
  },

  array: {
    type: Array,
    default: Array
  },

  object: {
    type: Object,
    default: Object
  },

  integer: {
    type: Number,
    validator(value) {
      return Number.isInteger(value)
    },
    default: 0
  },

  custom(validator) {
    if (typeof validator !== 'function') {
      throw new TypeError('You must provide a function as argument')
    }

    return toType({
      validator
    })
  },

  oneOf(arr) {
    if (!Array.isArray(arr)) {
      throw new TypeError('You must provide an array as argument')
    }

    return this.custom((value) => arr.indexOf(value) !== -1)
  },

  instanceOf(instanceConstructor) {
    return toType({
      type: instanceConstructor
    })
  },

  oneOfType(arr) {
    if (!Array.isArray(arr)) {
      throw new TypeError('You must provide an array as argument')
    }

    const nativeChecks = arr.map((type) => {
      if (isPlainObject(type)) {
        if (type.type && !isFunction(type.validator)) {
          return type.type
        }
        return null
      }
      return type
    }).filter((type) => !!type)

    if (nativeChecks.length === arr.length) {
      // we got just native objects (ie: Array, Object)
      // delegate to Vue native prop check
      return toType({
        type: nativeChecks
      })
    }

    return this.custom((value) => {
      return arr.some((type) => {
        return validateType(type, value)
      })
    })
  },

  arrayOf(type) {
    return this.custom((values) => {
      if (!Array.isArray(values)) {
        return false
      }
      return values.every((value) => {
        return validateType(type, value)
      })
    })
  },

  shape(obj) {
    const keys = Object.keys(obj)
    return this.custom((value) => {
      return Object.keys(value).every((key) => {
        if (keys.indexOf(key) === -1) {
          return false
        }
        const type = obj[key]
        return validateType(type, value[key])
      })
    })
  }

}

Object.keys(VuePropTypes).forEach((key) => {
  if (isFunction(VuePropTypes[key]) === false) {
    withRequired(VuePropTypes[key])
    withDefault(VuePropTypes[key])
  }
})

export default VuePropTypes
