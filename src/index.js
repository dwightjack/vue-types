import isPlainObject from 'lodash.isplainobject'
import { noop, toType, isFunction, validateType, isInteger, isArray } from './utils'

const VuePropTypes = {

  get any() {
    return toType({
      type: null
    })
  },

  get func() {
    return toType({
      type: Function,
      default: noop
    })
  },

  get bool() {
    return toType({
      type: Boolean,
      default: true
    })
  },

  get string() {
    return toType({
      type: String,
      default: ''
    })
  },

  get number() {
    return toType({
      type: Number,
      default: 0
    })
  },

  get array() {
    return toType({
      type: Array,
      default: Array
    })
  },

  get object() {
    return toType({
      type: Object,
      default: Object
    })
  },

  get integer() {
    return toType({
      type: Number,
      validator(value) {
        return isInteger(value)
      },
      default: 0
    })
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
    if (!isArray(arr)) {
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
    if (!isArray(arr)) {
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
    return toType({
      type: Array,
      validator(values) {
        return values.every((value) => validateType(type, value))
      }
    })
  },

  objectOf(type) {
    return toType({
      type: Object,
      validator(obj) {
        return Object.keys(obj).every((key) => validateType(type, obj[key]))
      }
    })
  },

  shape(obj) {
    const keys = Object.keys(obj)
    return this.custom((value) => {
      if (!isPlainObject(value)) {
        return false
      }
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

export default VuePropTypes
