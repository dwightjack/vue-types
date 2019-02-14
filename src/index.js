import isPlainObject from 'lodash/isPlainObject'
import { toType, getType, isFunction, validateType, isInteger, isArray, warn, noop } from './utils'
import { setDefaults } from './sensibles'

const VueTypes = {

  get any () {
    return toType('any', {
      type: null
    }, true)
  },

  get func () {
    return toType('function', {
      type: Function
    }, true).def(VueTypes.sensibleDefaults.func)
  },

  get bool () {
    return toType('boolean', {
      type: Boolean
    }, true).def(VueTypes.sensibleDefaults.bool)
  },

  get string () {
    return toType('string', {
      type: String
    }, true).def(VueTypes.sensibleDefaults.string)
  },

  get number () {
    return toType('number', {
      type: Number
    }, true).def(VueTypes.sensibleDefaults.number)
  },

  get array () {
    return toType('array', {
      type: Array
    }, true).def(VueTypes.sensibleDefaults.array)
  },

  get object () {
    return toType('object', {
      type: Object
    }, true).def(VueTypes.sensibleDefaults.object)
  },

  get integer () {
    return toType('integer', {
      type: Number,
      validator (value) {
        return isInteger(value)
      }
    }).def(VueTypes.sensibleDefaults.integer)
  },

  get symbol () {
    return toType('symbol', {
      type: null,
      validator (value) {
        return typeof value === 'symbol'
      }
    }, true)
  },

  extend (props = {}) {
    const { name, validate = false, getter = false, ...type } = props
    let descriptor
    if (getter) {
      descriptor = {
        get () {
          return toType(name, type, validate)
        },
        enumerable: true,
        configurable: false
      }
    } else {
      const { validator } = type
      descriptor = {
        value (...args) {
          if (validator) {
            type.validator = validator.bind(this, ...args)
          }
          return toType(name, type, validate)
        },
        writable: false,
        enumerable: true,
        configurable: false
      }
    }

    return Object.defineProperty(this, name, descriptor)
  },

  custom (validatorFn, warnMsg = 'custom validation failed') {
    if (typeof validatorFn !== 'function') {
      throw new TypeError('[VueTypes error]: You must provide a function as argument')
    }

    return toType(validatorFn.name || '<<anonymous function>>', {
      validator (value) {
        const valid = validatorFn(value)
        if (!valid) warn(`${this._vueTypes_name} - ${warnMsg}`)
        return valid
      }
    })
  },

  oneOf (arr) {
    if (!isArray(arr)) {
      throw new TypeError('[VueTypes error]: You must provide an array as argument')
    }
    const msg = `oneOf - value should be one of "${arr.join('", "')}"`
    const allowedTypes = arr.reduce((ret, v) => {
      if (v !== null && v !== undefined) {
        ret.indexOf(v.constructor) === -1 && ret.push(v.constructor)
      }
      return ret
    }, [])

    return toType('oneOf', {
      type: allowedTypes.length > 0 ? allowedTypes : null,
      validator (value) {
        const valid = arr.indexOf(value) !== -1
        if (!valid) warn(msg)
        return valid
      }
    })
  },

  instanceOf (instanceConstructor) {
    return toType('instanceOf', {
      type: instanceConstructor
    })
  },

  oneOfType (arr) {
    if (!isArray(arr)) {
      throw new TypeError('[VueTypes error]: You must provide an array as argument')
    }

    let hasCustomValidators = false

    const nativeChecks = arr.reduce((ret, type, i) => {
      if (isPlainObject(type)) {
        if (type._vueTypes_name === 'oneOf') {
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
      return toType('oneOfType', {
        type: nativeChecks
      })
    }

    const typesStr = arr.map((type) => {
      if (type && isArray(type.type)) {
        return type.type.map(getType)
      }
      return getType(type)
    }).reduce((ret, type) => ret.concat(isArray(type) ? type : [type]), []).join('", "')

    return this.custom(function oneOfType (value) {
      const valid = arr.some((type) => {
        if (type._vueTypes_name === 'oneOf') {
          return type.type ? validateType(type.type, value, true) : true
        }
        return validateType(type, value, true)
      })
      if (!valid) warn(`oneOfType - value type should be one of "${typesStr}"`)
      return valid
    })
  },

  arrayOf (type) {
    return toType('arrayOf', {
      type: Array,
      validator (values) {
        const valid = values.every((value) => validateType(type, value))
        if (!valid) warn(`arrayOf - value must be an array of "${getType(type)}"`)
        return valid
      }
    })
  },

  objectOf (type) {
    return toType('objectOf', {
      type: Object,
      validator (obj) {
        const valid = Object.keys(obj).every((key) => validateType(type, obj[key]))
        if (!valid) warn(`objectOf - value must be an object of "${getType(type)}"`)
        return valid
      }
    })
  },

  shape (obj) {
    const keys = Object.keys(obj)
    const requiredKeys = keys.filter((key) => obj[key] && obj[key].required === true)

    const type = toType('shape', {
      type: Object,
      validator (value) {
        if (!isPlainObject(value)) {
          return false
        }
        const valueKeys = Object.keys(value)

        // check for required keys (if any)
        if (requiredKeys.length > 0 && requiredKeys.some((req) => valueKeys.indexOf(req) === -1)) {
          warn(`shape - at least one of required properties "${requiredKeys.join('", "')}" is not present`)
          return false
        }

        return valueKeys.every((key) => {
          if (keys.indexOf(key) === -1) {
            if (this._vueTypes_isLoose === true) return true
            warn(`shape - object is missing "${key}" property`)
            return false
          }
          const type = obj[key]
          return validateType(type, value[key])
        })
      }
    })

    Object.defineProperty(type, '_vueTypes_isLoose', {
      enumerable: false,
      writable: true,
      value: false
    })

    Object.defineProperty(type, 'loose', {
      get () {
        this._vueTypes_isLoose = true
        return this
      },
      enumerable: false
    })

    return type
  }

}

setDefaults(VueTypes)

VueTypes.utils = {
  validate (value, type) {
    return validateType(type, value, true)
  },
  toType
}

export default VueTypes
