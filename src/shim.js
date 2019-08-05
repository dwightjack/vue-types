import Vue from 'vue'
import isPlainObject from 'is-plain-object'
import { setDefaults } from './sensibles'

const isArray =
  Array.isArray ||
  function(value) {
    return Object.prototype.toString.call(value) === '[object Array]'
  }

const type = (props) =>
  Object.assign(
    {
      def(v) {
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
      get isRequired() {
        this.required = true
        return this
      },
      validator() {
        return true
      },
    },
    props,
  )

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
  integer: Number,
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

function createValidator(root, name, getter = false, props) {
  const prop = getter ? 'get' : 'value'
  const descr = {
    [prop]: () =>
      type(props).def(getter ? vueTypes.sensibleDefaults[name] : undefined),
  }

  return Object.defineProperty(root, name, descr)
}

getters.forEach((p) =>
  createValidator(vueTypes, p, true, {
    type: typeMap[p] || null,
    validate() {},
  }),
)
methods.forEach((p) =>
  createValidator(vueTypes, p, false, { type: typeMap[p] || null }),
)
createValidator(vueTypes, 'integer', true, { type: Number }) // does not have a validate method

Object.defineProperty(vueTypes, 'shape', {
  value() {
    return Object.defineProperty(type({ type: Object }), 'loose', {
      get() {
        return this
      },
      enumerable: false,
    })
  },
})

vueTypes.extend = function extend(props) {
  const { name, validate, getter = false, type = null } = props
  return createValidator(vueTypes, name, getter, {
    type,
    validate: validate ? () => {} : undefined,
  })
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
