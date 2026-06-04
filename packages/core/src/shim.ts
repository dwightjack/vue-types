import { isPlainObject } from './is-plain-obj'
import { typeDefaults } from './sensibles'
import { config } from './config'
import type { VueTypesDefaults } from './types'
export type { VueTypeDef, VueTypeValidableDef } from './types'
const dfn = Object.defineProperty

const isArray = Array.isArray

function deepClone<T>(input: T): T {
  if ('structuredClone' in globalThis) {
    return structuredClone(input)
  }
  if (Array.isArray(input)) {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    return [...input] as T
  }
  if (isPlainObject(input)) {
    return Object.assign({}, input)
  }
  return input
}

function type(name: string, props: any = {}, validable = false): any {
  const descriptors: PropertyDescriptorMap = {
    _vueTypes_name: {
      value: name,
      writable: true,
    },
    def: {
      value(this: any, v: any) {
        if (v === undefined) {
          if ('default' in this) {
            delete this.default
          }
          return this
        }
        if (isArray(v)) {
          this.default = () => deepClone(v)
        } else if (isPlainObject(v)) {
          this.default = () => deepClone(v)
        } else {
          this.default = v
        }
        return this
      },
    },
    isRequired: {
      get(this: any) {
        this.required = true
        return this
      },
    },
  }

  if (validable) {
    descriptors.validate = {
      value() {},
    }
  }
  if (!props.validator) {
    props.validator = () => true
  }

  return Object.defineProperties(props, descriptors)
}

export { config }

// oxlint-disable-next-line typescript/no-unnecessary-type-parameters
type TypeShim = <_T = any>(...args: any[]) => any

export const any: TypeShim = () => type('any', {}, true)
export const func: TypeShim = () => type('func', { type: Function }, true)
export const bool = () => type('bool', { type: Boolean }, true)
export const string: TypeShim = () => type('string', { type: String }, true)
export const number: TypeShim = () => type('number', { type: Number }, true)
export const array: TypeShim = () => type('array', { type: Array }, true)
export const object: TypeShim = () => type('object', { type: Object }, true)
export const symbol = () => type('symbol')
export const integer: TypeShim = () => type('integer', { type: Number })
export const oneOf: TypeShim = (_a: any) => type('oneOf')
export const custom: TypeShim = (_a: any) => type('custom')
export const instanceOf: TypeShim = (Constr: any) =>
  type('instanceOf', { type: Constr })
export const oneOfType: TypeShim = (_a: any) => type('oneOfType')
export const arrayOf: TypeShim = (_a: any) => type('arrayOf', { type: Array })

export const objectOf: TypeShim = (_a: any) =>
  type('objectOf', { type: Object })
export const shape: TypeShim = (_a: any) =>
  dfn(type('shape', { type: Object }), 'loose', {
    get() {
      return this
    },
  })
export const nullable: TypeShim = () => ({
  type: null,
})

function createValidator(
  root: any,
  name: string,
  props: any,
  getter = false,
  validable = false,
) {
  const prop = getter ? 'get' : 'value'
  const descr = {
    [prop]: () =>
      type(name, Object.assign({}, props), validable).def(
        getter ? root.defaults[name] : undefined,
      ),
  }

  return dfn(root, name, descr)
}

export function fromType(name: string, source: any, props: any = {}) {
  const t = type(name, Object.assign({}, source, props), !!source.validable)
  if (t.validator) {
    delete t.validator
  }
  return t
}

// oxlint-disable-next-line no-unused-vars typescript/no-unnecessary-type-parameters
export const toValidableType = <T>(name: string, props: any) =>
  type(name, props, true)
// oxlint-disable-next-line no-unused-vars typescript/no-unnecessary-type-parameters
export const toType = <T>(name: string, props: any) => type(name, props)

const BaseVueTypes = /*#__PURE__*/ (() =>
  // oxlint-disable-next-line no-shadow, typescript/no-extraneous-class
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
    static get symbol() {
      return symbol()
    }
    static get integer() {
      return integer().def(this.defaults.integer)
    }
    static get nullable() {
      return nullable()
    }
    static oneOf = oneOf
    static custom = custom
    static instanceOf = instanceOf
    static oneOfType = oneOfType
    static arrayOf = arrayOf
    static objectOf = objectOf
    static shape = shape
    static extend(props: any) {
      if (isArray(props)) {
        props.forEach((p) => this.extend(p))
        return this
      }
      const { name, validate, getter = false, type: _type = null } = props
      // If we are inheriting from a custom type, let's ignore the type property
      const extType = isPlainObject(_type) && _type.type ? null : _type
      return createValidator(this, name, { type: extType }, getter, !!validate)
    }
    static utils = {
      toType: type as (...args: any[]) => any,
      validate: (...args: any[]) => !!args,
    }
  })()

export function createTypes(defs: Partial<VueTypesDefaults> = typeDefaults()) {
  return class extends BaseVueTypes {
    static defaults = Object.assign({}, defs)

    static get sensibleDefaults() {
      return Object.assign({}, this.defaults)
    }

    static set sensibleDefaults(v: boolean | Partial<VueTypesDefaults>) {
      if (v === false) {
        this.defaults = {}
        return
      }
      if (v === true) {
        this.defaults = Object.assign({}, defs)
        return
      }
      this.defaults = Object.assign({}, v)
    }
  }
}

export function validateType(
  _type: any,
  _value: any,
  _silent = false,
): string | boolean {
  return true
}

if (process.env.NODE_ENV !== 'production') {
  // oxlint-disable-next-line no-unused-expressions
  !config.silent &&
    console.warn(
      'You are using the production shimmed version of VueTypes in a development build. Refer to https://vue-types.codeful.dev/guide/installation.html#production-build to learn how to configure VueTypes for usage in multiple environments.',
    )
}

export default class VueTypes /*#__PURE__*/ extends createTypes() {}
