import isPlainObject from 'is-plain-object'
import Vue from 'vue'
import { PropOptions } from 'vue/types/options'
import {
  Constructor,
  VueTypeDef,
  VueTypeValidableDef,
  defaultType,
  VueProp,
} from '../types/vue-types'

type NoopFunc = (...args: any[]) => void

const ObjProto = Object.prototype
const toString = ObjProto.toString
export const hasOwn = ObjProto.hasOwnProperty

const FN_MATCH_REGEXP = /^\s*function (\w+)/

// https://github.com/vuejs/vue/blob/dev/src/core/util/props.js#L177
export function getType(
  fn: VueProp<any> | (() => any) | (new (...args: any[]) => any),
): string {
  const type = (fn as VueProp<any>)?.type ?? fn
  if (type) {
    const match = type.toString().match(FN_MATCH_REGEXP)
    return match ? match[1] : ''
  }
  return ''
}

export function getNativeType(value: Constructor): string {
  if (value === null || value === undefined) return ''
  const match = value.constructor.toString().match(FN_MATCH_REGEXP)
  return match ? match[1] : ''
}

/**
 * No-op function
 */
export function noop() {}

/**
 * A function that always returns true
 */
export const stubTrue = () => true

/**
 * Checks for a own property in an object
 *
 * @param {object} obj - Object
 * @param {string} prop - Property to check
 * @returns {boolean}
 */
export const has = (obj: object, prop: string): boolean =>
  hasOwn.call(obj, prop)

/**
 * Determines whether the passed value is an integer. Uses `Number.isInteger` if available
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
 * @param {*} value - The value to be tested for being an integer.
 * @returns {boolean}
 */
export const isInteger =
  Number.isInteger ||
  function isInteger(value) {
    return (
      typeof value === 'number' &&
      isFinite(value) &&
      Math.floor(value) === value
    )
  }

/**
 * Determines whether the passed value is an Array.
 *
 * @param {*} value - The value to be tested for being an array.
 * @returns {boolean}
 */
export const isArray =
  Array.isArray ||
  function isArray(value): value is any[] {
    return toString.call(value) === '[object Array]'
  }

/**
 * Checks if a value is a function
 *
 * @param {any} value - Value to check
 * @returns {boolean}
 */
export const isFunction = (value: unknown): boolean =>
  toString.call(value) === '[object Function]'

export const isVueTypeDef = (
  value: any,
): value is VueTypeDef | VueTypeValidableDef =>
  isPlainObject(value) && has(value, '_vueTypes_name')

export const isComplexType = (value: any): value is VueProp<any> =>
  isPlainObject(value) && has(value, 'type')

/**
 * Adds `isRequired` and `def` modifiers to an object
 *
 * @param {string} name - Type internal name
 * @param {object} obj - Object to enhance
 * @returns {object}
 */
export function toType<T = any, D = defaultType<T>>(
  name: String,
  obj: PropOptions<T>,
) {
  const type = Object.defineProperties(obj, {
    _vueTypes_name: {
      value: name,
    },
    isRequired: {
      get() {
        this.required = true
        return this
      },
    },
    validate: {
      value() {
        warn(`${name} - "validate" method not supported on this type`)
        return this
      },
      configurable: true,
    },
    def: {
      value(def: any) {
        if (def === undefined && !this.default) {
          return this
        }
        if (!isFunction(def) && !validateType(this, def)) {
          warn(`${this._vueTypes_name} - invalid default value: "${def}"`, def)
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
    },
  }) as VueTypeDef<T, D>

  if (isFunction(type.validator)) {
    type.validator = (type.validator as any).bind(type)
  }

  return type
}

/**
 * Like `toType` but also adds the `validate()` method to the type object
 *
 * @param {string} name - Type internal name
 * @param {object} obj - Object to enhance
 * @returns {object}
 */
export function toValidableType<T = any, D = defaultType<T>>(
  name: String,
  obj: PropOptions<T>,
) {
  const type = toType<T, D>(name, obj)
  return Object.defineProperty(type, 'validate', {
    value(fn: (value: T) => boolean) {
      this.validator = fn.bind(this)
      return this
    },
  }) as VueTypeValidableDef<T, D>
}

/**
 * Validates a given value against a prop type object
 *
 * @param {Object|*} type - Type to use for validation. Either a type object or a constructor
 * @param {*} value - Value to check
 * @param {boolean} silent - Silence warnings
 * @returns {boolean}
 */
export function validateType(type: any, value: any, silent = false) {
  let typeToCheck = type
  let valid = true
  let expectedType
  if (!isPlainObject(type)) {
    typeToCheck = { type }
  }
  const namePrefix = typeToCheck._vueTypes_name
    ? typeToCheck._vueTypes_name + ' - '
    : ''

  if (hasOwn.call(typeToCheck, 'type') && typeToCheck.type !== null) {
    if (typeToCheck.type === undefined) {
      throw new TypeError(
        `[VueTypes error]: Setting type to undefined is not allowed.`,
      )
    }
    if (!typeToCheck.required && value === undefined) {
      return valid
    }
    if (isArray(typeToCheck.type)) {
      valid = typeToCheck.type.some((type: any) =>
        validateType(type, value, true),
      )
      expectedType = typeToCheck.type
        .map((type: any) => getType(type))
        .join(' or ')
    } else {
      expectedType = getType(typeToCheck)

      if (expectedType === 'Array') {
        valid = isArray(value)
      } else if (expectedType === 'Object') {
        valid = isPlainObject(value)
      } else if (
        expectedType === 'String' ||
        expectedType === 'Number' ||
        expectedType === 'Boolean' ||
        expectedType === 'Function'
      ) {
        valid = getNativeType(value) === expectedType
      } else {
        valid = value instanceof typeToCheck.type
      }
    }
  }

  if (!valid) {
    silent === false &&
      warn(`${namePrefix}value "${value}" should be of type "${expectedType}"`)
    return false
  }

  if (
    hasOwn.call(typeToCheck, 'validator') &&
    isFunction(typeToCheck.validator)
  ) {
    // swallow warn
    let oldWarn: any
    if (silent) {
      oldWarn = warn
      warn = noop
    }

    valid = typeToCheck.validator(value)
    oldWarn && (warn = oldWarn)

    if (!valid && silent === false)
      warn(`${namePrefix}custom validation failed`)
    return valid
  }
  return valid
}

let warn = noop as NoopFunc

if (process.env.NODE_ENV !== 'production') {
  const hasConsole = typeof console !== 'undefined'
  warn = hasConsole
    ? function warn(msg) {
        // eslint-disable-next-line no-console
        Vue.config.silent === false && console.warn(`[VueTypes warn]: ${msg}`)
      }
    : noop
}

export { warn }
