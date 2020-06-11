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
  DefaultType,
  VueTypeDef,
} from '../types/vue-types'
import { typeDefaults } from './sensibles'
import { PropOptions } from 'vue'
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
} from './validators/native'
import custom from './validators/custom'
import oneOf from './validators/oneof'
import oneOfType from './validators/oneoftype'
import arrayOf from './validators/arrayof'
import instanceOf from './validators/instanceof'
import objectOf from './validators/objectof'
import shape from './validators/shape'

function createTypes(defs: Partial<VueTypesDefaults> = typeDefaults()) {
  class VueTypes {
    private static defaults = { ...defs }

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

    static readonly custom = custom
    static readonly oneOf = oneOf
    static readonly instanceOf = instanceOf
    static readonly oneOfType = oneOfType
    static readonly arrayOf = arrayOf
    static readonly objectOf = objectOf
    static readonly shape = shape

    static extend<T extends typeof VueTypes>(
      props: ExtendProps | ExtendProps[],
    ): T {
      if (isArray(props)) {
        props.forEach((p) => this.extend(p))
        return this as any
      }

      let { name, validate = false, getter = false, ...opts } = props

      if (has(this, name as any)) {
        throw new TypeError(`[VueTypes error]: Type "${name}" already defined`)
      }

      const { type } = opts
      if (isVueTypeDef(type)) {
        // we are using as base type a vue-type object

        // detach the original type
        // we are going to inherit the parent data.
        delete opts.type

        opts = fromType(name, type, opts as Omit<ExtendProps, 'type'>)

        if (getter) {
          return Object.defineProperty(this, name, {
            get: () => fromType(name, type, opts as Omit<ExtendProps, 'type'>),
          })
        }
        return Object.defineProperty(this, name, {
          value(...args: any[]) {
            const t = fromType(name, type, opts as Omit<ExtendProps, 'type'>)
            if (t.validator) {
              t.validator = t.validator.bind(t, ...args)
            }
            return t
          },
        })
      }

      let descriptor: any
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

      return Object.defineProperty(this, name, descriptor)
    }

    static utils = {
      validate<T, U>(value: T, type: U) {
        return validateType<U, T>(type, value, true)
      },
      toType<T = any>(name: string, obj: PropOptions<T>, validable = false) {
        return validable ? toValidableType<T>(name, obj) : toType<T>(name, obj)
      },
    }
  }

  return VueTypes
}

export default createTypes()

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
  createTypes,
  toType,
  toValidableType,
  validateType,
  fromType,
}
