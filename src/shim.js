import isPlainObject from 'lodash/isPlainObject'

/**
 * No-op function
 */
export const noop = () => {}

export const getType = () => true

export const validateType = () => true

/**
 * Determines whether the passed value is an integer. Uses `Number.isInteger` if available
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
 * @param {*} value - The value to be tested for being an integer.
 * @returns {boolean}
 */
export const isInteger = Number.isInteger || function (value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value
}

/**
 * Determines whether the passed value is an Array.
 *
 * @param {*} value - The value to be tested for being an array.
 * @returns {boolean}
 */
export const isArray = Array.isArray || function (value) {
  return toString.call(value) === '[object Array]'
}

/**
 * Checks if a value is a function
 *
 * @param {any} value - Value to check
 * @returns {boolean}
 */
export const isFunction = (value) => toString.call(value) === '[object Function]'

const warn = noop

export { warn }

/**
 * Adds a `def` method to the object returning a new object with passed in argument as `default` property
 *
 * @param {object} type - Object to enhance
 */
export const withDefault = function (type) {
  Object.defineProperty(type, 'def', {
    value(def) {
      if (def === undefined && !this.default) {
        return this
      }
      if (!isFunction(def) && !validateType(this, def)) {
        console.log(`${this._vueTypes_name} - invalid default value: "${def}"`, def)
        return this
      }
      if (isArray(def)) {
        this.default = () => [...def]
      } else if (isPlainObject(def)) {
        this.default = () => Object.assign({}, def)
      } else {
        this.default = def
      }
      return this
    },
    enumerable: false,
    writable: false
  })
}

/**
 * Adds a `isRequired` getter returning a new object with `required: true` key-value
 *
 * @param {object} type - Object to enhance
 */
export const withRequired = function (type) {
  Object.defineProperty(type, 'isRequired', {
    get() {
      this.required = true
      return this
    },
    enumerable: false
  })
}

export const toType = (name, obj) => {
  Object.defineProperty(obj, '_vueTypes_name', {
    enumerable: false,
    writable: false,
    value: name
  })
  withRequired(obj)
  withDefault(obj)

  if (isFunction(obj.validator)) {
    obj.validator = obj.validator.bind(obj)
  }
  return obj
}
