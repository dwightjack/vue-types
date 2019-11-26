import Vue from 'vue'
import isPlainObject from 'is-plain-object'
import { setDefaults } from './sensibles'

const dfn = Object.defineProperty

const isArray =
  Array.isArray ||
  function(value) {
    return Object.prototype.toString.call(value) === '[object Array]'
  }

function type(name, props, validable = false) {
  const descriptors = {
    _vueTypes_name: {
      value: name,
    },
    def: {
      value(v) {
        if (v === undefined && !this.default) {
          return this
        }
        if (isArray(v)) {
          this.default = () => [].concat(v)
        } else if (isPlainObject(v)) {
          this.default = () => Object.assign({}, v)
        } else {
          this.default = v
        }
        return this
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
    descriptors.validate = {
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

const vueTypes = setDefaults({
  utils: {
    toType: type,
    validate: () => true,
  },
})

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

function createValidator(root, name, props, getter = false, validable = false) {
  const prop = getter ? 'get' : 'value'
  const descr = {
    [prop]: () =>
      type(name, props, validable).def(
        getter ? vueTypes.sensibleDefaults[name] : undefined,
      ),
  }

  return dfn(root, name, descr)
}

function recurseValidator(root, getter, validable) {
  return (name) =>
    createValidator(
      root,
      name,
      { type: typeMap[name] || null },
      getter,
      validable,
    )
}

getters.forEach(recurseValidator(vueTypes, true, true))
methods.forEach(recurseValidator(vueTypes, false))

createValidator(vueTypes, 'integer', { type: Number }, true) // does not have a validate method

dfn(vueTypes, 'shape', {
  value() {
    return dfn(type('shape', { type: Object }), 'loose', {
      get() {
        return this
      },
    })
  },
})

vueTypes.extend = function extend(props) {
  const { name, validate, getter = false, type = null } = props
  // If we are inheriting from a custom type, let's ignore the type property
  const extType = isPlainObject(type) && type.type ? null : type
  return createValidator(vueTypes, name, { type: extType }, getter, !!validate)
}

/* eslint-disable no-console */
if (process.env.NODE_ENV !== 'production') {
  Vue.config.silent === false &&
    console.warn(
      'You are using the production shimmed version of VueTypes in a development build. Refer to https://github.com/dwightjack/vue-types#production-build to learn how to configure VueTypes for usage in multiple environments.',
    )
}
/* eslint-enable no-console */

export default vueTypes
