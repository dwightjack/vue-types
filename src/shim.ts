import Vue from 'vue'
import isPlainObject from 'is-plain-object'
import { setDefaults, typeDefaults } from './sensibles'
import { PropOptions } from 'vue'

const dfn = Object.defineProperty

const isArray =
  Array.isArray ||
  function (value) {
    return Object.prototype.toString.call(value) === '[object Array]'
  }

function type(name: string, props: PropOptions<any>, validable = false) {
  const descriptors = {
    _vueTypes_name: {
      value: name,
    },
    def: {
      value(v) {
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

export function createTypes(defs = typeDefaults()) {
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
          getter ? (VueTypes as any).sensibleDefaults[name] : undefined,
        ),
    }

    return dfn(root, name, descr)
  }

  function recurseValidator(
    root: typeof VueTypes,
    getter: boolean,
    validable = false,
  ) {
    return (name) =>
      createValidator(
        root,
        name,
        { type: typeMap[name] || null },
        getter,
        validable,
      )
  }

  class VueTypes {}

  Object.assign(setDefaults(VueTypes, defs), {
    extend(props: any) {
      const { name, validate, getter = false, type = null } = props
      // If we are inheriting from a custom type, let's ignore the type property
      const extType = isPlainObject(type) && type.type ? null : type
      return createValidator(this, name, { type: extType }, getter, !!validate)
    },
    utils: {
      toType: type,
      validate: () => true,
    },
  })

  getters.forEach(recurseValidator(VueTypes, true, true))
  methods.forEach(recurseValidator(VueTypes, false))

  createValidator(VueTypes, 'integer', { type: Number }, true) // does not have a validate method

  dfn(VueTypes, 'shape', {
    value() {
      return dfn(type('shape', { type: Object }), 'loose', {
        get() {
          return this
        },
      })
    },
  })
  return VueTypes
}

/* eslint-disable no-console */
if (process.env.NODE_ENV !== 'production') {
  Vue.config.silent === false &&
    console.warn(
      'You are using the production shimmed version of VueTypes in a development build. Refer to https://github.com/dwightjack/vue-types#production-build to learn how to configure VueTypes for usage in multiple environments.',
    )
}
/* eslint-enable no-console */

export default createTypes()
