import _isPlainObject from 'is-plain-object'
import Vue from 'vue'
import {
  VueTypeDef,
  VueTypeValidableDef,
  VueProp,
  InferType,
  PropOptions,
} from './types'

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

export function getNativeType(value: any): string {
  if (value === null || value === undefined) return ''
  const match = value.constructor.toString().match(FN_MATCH_REGEXP)
  return match ? match[1] : ''
}

type PlainObject = { [key: string]: any }
export const isPlainObject = _isPlainObject as (obj: any) => obj is PlainObject

/**
 * No-op function
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop() {}

const hasConsole = typeof console !== 'undefined'
export let warn = hasConsole
  ? function warn(msg: string) {
      // eslint-disable-next-line no-console
      Vue.config.silent === false && console.warn(`[VueTypes warn]: ${msg}`)
    }
  : noop

/**
 * Checks for a own property in an object
 *
 * @param {object} obj - Object
 * @param {string} prop - Property to check
 */
export const has = <T extends object, U extends keyof T>(obj: T, prop: U) =>
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
  function isInteger(value: unknown): value is number {
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
export const isFunction = (value: unknown): value is Function =>
  toString.call(value) === '[object Function]'

export const isVueTypeDef = <T>(
  value: any,
): value is VueTypeDef<T> | VueTypeValidableDef<T> =>
  isPlainObject(value) && has(value, '_vueTypes_name')

export const isComplexType = <T>(value: any): value is VueProp<T> =>
  isPlainObject(value) &&
  (has(value, 'type') ||
    ['_vueTypes_name', 'validator', 'default', 'required'].some((k) =>
      has(value, k),
    ))

export interface WrappedFn {
  (...args: any[]): any
  __original: (...args: any[]) => any
}

export function bindTo(fn: (...args: any[]) => any, ctx: any): WrappedFn {
  return Object.defineProperty(fn.bind(ctx), '__original', {
    value: fn,
  })
}

export function unwrap<T extends WrappedFn | Function>(fn: T) {
  return (fn as WrappedFn).__original ?? fn
}

/**
 * Validates a given value against a prop type object
 *
 * @param {Object|*} type - Type to use for validation. Either a type object or a constructor
 * @param {*} value - Value to check
 * @param {boolean} silent - Silence warnings
 */
export function validateType<T, U>(type: T, value: U, silent = false) {
  let typeToCheck: { [key: string]: any }
  let valid = true
  let expectedType = ''
  if (!isPlainObject(type)) {
    typeToCheck = { type }
  } else {
    typeToCheck = type
  }
  const namePrefix = isVueTypeDef(typeToCheck)
    ? typeToCheck._vueTypes_name + ' - '
    : ''

  if (isComplexType(typeToCheck) && typeToCheck.type !== null) {
    if (typeToCheck.type === undefined) {
      return valid
    }
    if (!typeToCheck.required && value === undefined) {
      return valid
    }
    if (typeToCheck.type === undefined) {
      expectedType = 'any'
    } else if (isArray(typeToCheck.type)) {
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

  if (has(typeToCheck, 'validator') && isFunction(typeToCheck.validator)) {
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

/**
 * Adds `isRequired` and `def` modifiers to an object
 *
 * @param {string} name - Type internal name
 * @param {object} obj - Object to enhance
 */
export function toType<T = any>(name: string, obj: PropOptions<T>) {
  const type: VueTypeDef<T> = Object.defineProperties(obj, {
    // eslint-disable-next-line @typescript-eslint/camelcase
    _vueTypes_name: {
      value: name,
      writable: true,
    },
    isRequired: {
      get() {
        this.required = true
        return this
      },
    },
    def: {
      value(def?: any) {
        if (def === undefined && !this.default) {
          return this
        }
        if (!isFunction(def) && !validateType(this, def)) {
          warn(`${this._vueTypes_name} - invalid default value: "${def}"`)
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
  })

  const { validator } = type
  if (isFunction(validator)) {
    type.validator = bindTo(validator, type)
  }

  return type
}

/**
 * Like `toType` but also adds the `validate()` method to the type object
 *
 * @param {string} name - Type internal name
 * @param {object} obj - Object to enhance
 */
export function toValidableType<T = any>(name: string, obj: PropOptions<T>) {
  const type = toType<T>(name, obj)
  return Object.defineProperty(type, 'validate', {
    value(fn: (value: T) => boolean) {
      this.validator = bindTo(fn, this)
      return this
    },
  }) as VueTypeValidableDef<T>
}

export function clone<T extends object>(type: T): T {
  const descriptors = {} as { [P in keyof T]: any }
  Object.getOwnPropertyNames(type).forEach((key) => {
    descriptors[key as keyof T] = Object.getOwnPropertyDescriptor(type, key)
  })
  return Object.defineProperties({}, descriptors)
}

export function fromType<T extends VueTypeDef<any>, U = InferType<T>>(
  name: string,
  source: T,
  props = {} as PropOptions<U>,
): VueTypeDef<U> {
  const { validator, ...rest } = props

  // 1. create an exact copy of the source type
  const copy = clone<VueTypeDef<U>>(source)

  // 2. give it a new name
  // eslint-disable-next-line @typescript-eslint/camelcase
  copy._vueTypes_name = name

  // 3. compose the validator function
  // with the one on the source (if present)
  // and ensure it is bound to the copy
  if (isFunction(validator)) {
    let { validator: prevValidator } = copy

    if (prevValidator) {
      prevValidator = unwrap(prevValidator)
    }

    copy.validator = bindTo(
      prevValidator
        ? function (this: VueTypeDef<U>, value: any) {
            return (
              prevValidator.call(this, value) && validator.call(this, value)
            )
          }
        : validator,
      copy,
    )
  }
  // 4. overwrite the rest, if present
  return Object.assign(copy, rest)
}
