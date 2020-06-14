import Vue from 'vue'
import isPlainObject from 'is-plain-object'
import { typeDefaults } from './sensibles'
import {
  PropOptions,
  VueTypeDef,
  VueTypeShape,
  VueTypeValidableDef,
  VueTypesDefaults,
} from './types'

const dfn = Object.defineProperty

const isArray =
  Array.isArray ||
  function (value) {
    return Object.prototype.toString.call(value) === '[object Array]'
  }

function type(name: string, props: PropOptions<any>, validable = false) {
  const descriptors: PropertyDescriptorMap = {
    // eslint-disable-next-line @typescript-eslint/camelcase
    _vueTypes_name: {
      value: name,
      writable: true,
    },
    def: {
      value(v) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const t = this
        if (v === undefined && !t.default) {
          return t
        }
        if (isArray(v)) {
          t.default = () => [].concat(v)
        } else if (isPlainObject(v)) {
          t.default = () => Object.assign({}, v)
        } else {
          t.default = v
        }
        return t
      },
    },
    isRequired: {
      get() {
        this.required = true
        return this
      },
    },
  }

  if (validable) {
    ;(descriptors as any).validate = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      value() {},
    }
  }
  return Object.assign(
    Object.defineProperties(
      {
        validator: () => true,
      },
      descriptors,
    ),
    props,
  )
}

const typeMap = {
  func: Function,
  bool: Boolean,
  string: String,
  number: Number,
  array: Array,
  object: Object,
  arrayOf: Array,
  objectOf: Object,
  shape: Object,
}

const getters = [
  'any',
  'func',
  'bool',
  'string',
  'number',
  'array',
  'object',
  'symbol',
]
const methods = [
  'oneOf',
  'custom',
  'instanceOf',
  'oneOfType',
  'arrayOf',
  'objectOf',
]

class BaseVueTypes {
  static defaults: Partial<VueTypesDefaults> = {}

  static any: VueTypeValidableDef<any>
  static func: VueTypeValidableDef<Function>
  static bool: VueTypeValidableDef<boolean>
  static string: VueTypeValidableDef<string>
  static number: VueTypeValidableDef<number>
  static array: VueTypeValidableDef<unknown[]>
  static object: VueTypeValidableDef<{ [key: string]: any }>
  static symbol: VueTypeValidableDef<symbol>
  static integer: VueTypeDef<number>
  static oneOf: (arr: any[]) => VueTypeDef<any>
  static custom: (fn: (v: any) => boolean) => VueTypeDef<any>
  static instanceOf: (i: any) => VueTypeDef<any>
  static oneOfType: (arr: any[]) => VueTypeDef<any>
  static arrayOf: (t: any) => VueTypeDef<any>
  static objectOf: (t: any) => VueTypeDef<any>
  static shape: (o: any) => VueTypeShape<any>
  static extend: (props: any) => any
  static utils = {
    toType: type as (
      ...args: any[]
    ) => VueTypeDef<any> | VueTypeValidableDef<any>,
    validate: (...args: any[]) => !!args,
  }
}

function enhanceClass(vueTypeClass: typeof BaseVueTypes) {
  function createValidator(
    root: any,
    name: string,
    props: PropOptions<any>,
    getter = false,
    validable = false,
  ) {
    const prop = getter ? 'get' : 'value'
    const descr = {
      [prop]: () =>
        type(name, props, validable).def(
          getter ? (vueTypeClass as any).sensibleDefaults[name] : undefined,
        ),
    }

    return dfn(root, name, descr)
  }

  function recurseValidator(
    root: typeof vueTypeClass,
    getter: boolean,
    validable = false,
  ) {
    return (name: string) =>
      createValidator(
        root,
        name,
        { type: typeMap[name] || null },
        getter,
        validable,
      )
  }

  vueTypeClass.extend = function extend(props) {
    const { name, validate, getter = false, type = null } = props
    // If we are inheriting from a custom type, let's ignore the type property
    const extType = isPlainObject(type) && type.type ? null : type
    return createValidator(this, name, { type: extType }, getter, !!validate)
  }

  getters.forEach(recurseValidator(vueTypeClass, true, true))
  methods.forEach(recurseValidator(vueTypeClass, false))

  createValidator(vueTypeClass, 'integer', { type: Number }, true) // does not have a validate method

  dfn(vueTypeClass, 'shape', {
    value() {
      return dfn(type('shape', { type: Object }), 'loose', {
        get() {
          return this
        },
      })
    },
  })
  return vueTypeClass
}

export function createTypes(defs: Partial<VueTypesDefaults> = typeDefaults()) {
  return enhanceClass(
    class extends BaseVueTypes {
      static defaults = { ...defs }

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
    },
  )
}

class VueTypes extends BaseVueTypes {
  static defaults: Partial<VueTypesDefaults> = typeDefaults()

  static get sensibleDefaults() {
    return { ...this.defaults }
  }

  static set sensibleDefaults(v: boolean | Partial<VueTypesDefaults>) {
    if (v === false) {
      this.defaults = {}
      return
    }
    if (v === true) {
      this.defaults = typeDefaults()
      return
    }
    this.defaults = { ...v }
  }
}

enhanceClass(VueTypes)

export default VueTypes
