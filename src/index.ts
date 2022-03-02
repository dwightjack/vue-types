import {
  toType,
  toValidableType,
  validateType,
  isArray,
  isVueTypeDef,
  has,
  fromType,
} from './utils'

import {
  VueTypesDefaults,
  ExtendProps,
  VueTypeDef,
  VueTypeValidableDef,
  VueTypeShape,
  VueTypeLooseShape,
} from './types'
import { typeDefaults } from './sensibles'
import { PropOptions } from './types'

import {
  any,
  func,
  bool,
  string,
  number,
  array,
  integer,
  symbol,
  object,
  nullable,
} from './validators/native'
import custom from './validators/custom'
import oneOf from './validators/oneof'
import oneOfType from './validators/oneoftype'
import arrayOf from './validators/arrayof'
import instanceOf from './validators/instanceof'
import objectOf from './validators/objectof'
import shape from './validators/shape'
import { config } from './config'

const BaseVueTypes = /*#__PURE__*/ (() =>
  class BaseVueTypes {
    static defaults: Partial<VueTypesDefaults> = {}

    static sensibleDefaults: Partial<VueTypesDefaults> | boolean

    static config = config

    static get any() {
      return any()
    }
    static get func() {
      return func().def(this.defaults.func)
    }
    static get bool() {
      return bool().def(this.defaults.bool)
    }
    static get string() {
      return string().def(this.defaults.string)
    }
    static get number() {
      return number().def(this.defaults.number)
    }
    static get array() {
      return array().def(this.defaults.array)
    }
    static get object() {
      return object().def(this.defaults.object)
    }
    static get integer() {
      return integer().def(this.defaults.integer)
    }
    static get symbol() {
      return symbol()
    }

    static get nullable() {
      return nullable()
    }

    static readonly custom = custom
    static readonly oneOf = oneOf
    static readonly instanceOf = instanceOf
    static readonly oneOfType = oneOfType
    static readonly arrayOf = arrayOf
    static readonly objectOf = objectOf
    static readonly shape = shape

    static extend<T extends typeof BaseVueTypes>(
      props: ExtendProps | ExtendProps[],
    ): T {
      if (isArray(props)) {
        props.forEach((p) => this.extend(p))
        return this as any
      }

      const { name, validate = false, getter = false, ...opts } = props

      if (has(this, name as any)) {
        throw new TypeError(`[VueTypes error]: Type "${name}" already defined`)
      }

      const { type } = opts
      if (isVueTypeDef(type)) {
        // we are using as base type a vue-type object

        // detach the original type
        // we are going to inherit the parent data.
        delete opts.type

        if (getter) {
          return Object.defineProperty(this as T, name, {
            get: () => fromType(name, type, opts as Omit<ExtendProps, 'type'>),
          })
        }
        return Object.defineProperty(this as T, name, {
          value(...args: unknown[]) {
            const t = fromType(name, type, opts as Omit<ExtendProps, 'type'>)
            if (t.validator) {
              t.validator = t.validator.bind(t, ...args)
            }
            return t
          },
        })
      }

      let descriptor: PropertyDescriptor
      if (getter) {
        descriptor = {
          get() {
            const typeOptions = Object.assign({}, opts as PropOptions<T>)
            if (validate) {
              return toValidableType<T>(name, typeOptions)
            }
            return toType<T>(name, typeOptions)
          },
          enumerable: true,
        }
      } else {
        descriptor = {
          value(...args: T[]) {
            const typeOptions = Object.assign({}, opts as PropOptions<T>)
            let ret: VueTypeDef<T>
            if (validate) {
              ret = toValidableType<T>(name, typeOptions)
            } else {
              ret = toType<T>(name, typeOptions)
            }

            if (typeOptions.validator) {
              ret.validator = typeOptions.validator.bind(ret, ...args)
            }
            return ret
          },
          enumerable: true,
        }
      }

      return Object.defineProperty(this as T, name, descriptor)
    }

    static utils = {
      validate<T, U>(value: T, type: U) {
        return validateType<U, T>(type, value, true) === true
      },
      toType<T = unknown>(
        name: string,
        obj: PropOptions<T>,
        validable = false,
      ): VueTypeDef<T> | VueTypeValidableDef<T> {
        return validable ? toValidableType<T>(name, obj) : toType<T>(name, obj)
      },
    }
  })()

function createTypes(defs: Partial<VueTypesDefaults> = typeDefaults()) {
  return class extends BaseVueTypes {
    static defaults: Partial<VueTypesDefaults> = { ...defs }

    static get sensibleDefaults() {
      return { ...this.defaults }
    }

    static set sensibleDefaults(v: boolean | Partial<VueTypesDefaults>) {
      if (v === false) {
        this.defaults = {}
        return
      }
      if (v === true) {
        this.defaults = { ...defs }
        return
      }
      this.defaults = { ...v }
    }
  }
}

export default class VueTypes /*#__PURE__*/ extends createTypes() {}

export {
  any,
  func,
  bool,
  string,
  number,
  array,
  integer,
  symbol,
  object,
  custom,
  oneOf,
  oneOfType,
  arrayOf,
  instanceOf,
  objectOf,
  shape,
  nullable,
  createTypes,
  toType,
  toValidableType,
  validateType,
  fromType,
  config,
}

export type VueTypesInterface = ReturnType<typeof createTypes>
export type { VueTypeDef, VueTypeValidableDef, VueTypeShape, VueTypeLooseShape }
