import isPlainObject from 'lodash.isplainobject'
import { noop, toType, getType, isFunction, validateType, isInteger, isArray, warn } from './utils'

const VuePropTypes = {

  get any() {
    return toType({
      type: null,
      name: 'any'
    })
  },

  get func() {
    return toType({
      type: Function,
      name: 'function',
      default: noop
    })
  },

  get bool() {
    return toType({
      type: Boolean,
      name: 'boolean',
      default: true
    })
  },

  get string() {
    return toType({
      type: String,
      name: 'string',
      default: ''
    })
  },

  get number() {
    return toType({
      type: Number,
      name: 'number',
      default: 0
    })
  },

  get array() {
    return toType({
      type: Array,
      name: 'array',
      default: Array
    })
  },

  get object() {
    return toType({
      type: Object,
      name: 'object',
      default: Object
    })
  },

  get integer() {
    return toType({
      type: Number,
      name: 'integer',
      validator(value) {
        return isInteger(value)
      },
      default: 0
    })
  },

  custom(validatorFn, warnMsg = 'custom validation failed') {
    if (typeof validatorFn !== 'function') {
      throw new TypeError('[VueTypes error]: You must provide a function as argument')
    }

    return toType({
      name: validatorFn.name || '<<anonymous function>>',
      validator(...args) {
        const valid = validatorFn(...args)
        if (!valid) warn(warnMsg)
        return valid
      }
    })
  },

  oneOf(arr) {
    if (!isArray(arr)) {
      throw new TypeError('[VueTypes error]: You must provide an array as argument')
    }
    const msg = `value should be one of "${arr.join('", "')}"`
    const allowedTypes = arr.reduce((ret, v) => {
      if (v !== null && v !== undefined) {
        ret.indexOf(v.constructor) === -1 && ret.push(v.constructor)
      }
      return ret
    }, [])

    return toType({
      name: 'oneOf',
      type: allowedTypes.length > 0 ? allowedTypes : null,
      validator(value) {
        const valid = arr.indexOf(value) !== -1
        if (!valid) warn(msg)
        return valid
      }
    })
  },

  instanceOf(instanceConstructor) {
    return toType({
      name: 'instanceOf',
      type: instanceConstructor
    })
  },

  oneOfType(arr) {
    if (!isArray(arr)) {
      throw new TypeError('[VueTypes error]: You must provide an array as argument')
    }

    let hasCustomValidators = false

    const nativeChecks = arr.reduce((ret, type, i) => {
      if (isPlainObject(type)) {
        if (type.name === 'oneOf') {
          return ret.concat(type.type || [])
        }
        if (type.type && !isFunction(type.validator)) {
          if (isArray(type.type)) return ret.concat(type.type)
          ret.push(type.type)
        } else if (isFunction(type.validator)) {
          hasCustomValidators = true
        }
        return ret
      }
      ret.push(type)
      return ret
    }, [])

    if (!hasCustomValidators) {
      // we got just native objects (ie: Array, Object)
      // delegate to Vue native prop check
      return toType({
        name: 'oneOfType',
        type: nativeChecks
      })
    }

    const typesStr = arr.map((type) => {
      if (type && isArray(type.type)) {
        return type.type.map(getType)
      }
      return getType(type)
    }).reduce((ret, type) => ret.concat(isArray(type) ? type : [type]), []).join('", "')

    return this.custom(function oneOfType(value) {
      const valid = arr.some((type) => {
        if (type.name === 'oneOf') {
          return type.type ? validateType(type.type, value, true) : true
        }
        return validateType(type, value, true)
      })
      if (!valid) warn(`value type should be one of "${typesStr}"`)
      return valid
    })
  },

  arrayOf(type) {
    return toType({
      name: 'arrayOf',
      type: Array,
      validator(values) {
        const valid = values.every((value) => validateType(type, value))
        if (!valid) warn(`value must be an array of '${getType(type)}'`)
        return valid
      }
    })
  },

  objectOf(type) {
    return toType({
      name: 'objectOf',
      type: Object,
      validator(obj) {
        const valid = Object.keys(obj).every((key) => validateType(type, obj[key]))
        if (!valid) warn(`value must be an object of '${getType(type)}'`)
        return valid
      }
    })
  },

  shape(obj) {
    const keys = Object.keys(obj)
    const requiredKeys = keys.filter((key) => obj[key] && obj[key].required === true)

    const type = toType({
      name: 'shape',
      type: Object,
      validator(value) {
        if (!isPlainObject(value)) {
          return false
        }
        const valueKeys = Object.keys(value)

        // check for required keys (if any)
        if (requiredKeys.length > 0 && requiredKeys.some((req) => valueKeys.indexOf(req) === -1)) {
          warn(`at least one of required properties "${requiredKeys.join('", "')}" is not present`)
          return false
        }

        return valueKeys.every((key) => {
          if (keys.indexOf(key) === -1) {
            if (this.isLoose === true) return true
            warn(`object is missing "${key}" property`)
            return false
          }
          const type = obj[key]
          return validateType(type, value[key])
        })
      }
    })

    Object.defineProperty(type, 'loose', {
      get() {
        this.isLoose = true
        this.validator = this.validator.bind(this)
        return this
      },
      enumerable: false
    })

    return type
  }

}

export default VuePropTypes
