import { toType, toValidableType, validateType, fromType, warn } from './utils'

import {
  VueTypesDefaults,
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
  // eslint-disable-next-line @typescript-eslint/no-extraneous-class
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
      // prevent undefined to be explicitly set
      if (this.defaults.bool === undefined) {
        return bool()
      }
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static extend(...args: any[]) {
      warn(
        `VueTypes.extend has been removed. Use the ES6+ method instead. See https://dwightjack.github.io/vue-types/advanced/extending-vue-types.html#extending-namespaced-validators-in-es6 for details.`,
      )
    }

    static utils = {
      validate<T, U>(value: T, type: U) {
        return validateType<U, T>(type, value, true) === true
      },
      toType<T = unknown, Validable extends boolean = false>(
        name: string,
        obj: PropOptions<T>,
        validable: Validable = false as Validable,
      ): Validable extends true ? VueTypeValidableDef<T> : VueTypeDef<T> {
        return (
          validable ? toValidableType<T>(name, obj) : toType<T>(name, obj)
        ) as any
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
