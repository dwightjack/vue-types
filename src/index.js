const noop = () => {}

const ObjProto = Object.prototype

const toString = ObjProto.toString

const isFunction = (val) => toString.call(val) === '[object Function]'

function withDefault(type, def) {
  return Object.assign({}, this[type], { default: def })
}

const withRequired = (type) => {
  Object.defineProperty(type, 'isRequired', {
    get() {
      return Object.assign({ required: true }, this)
    },
    enumerable: true
  })
}

const validateType = (type, value) => {
  if (type.validator) {
    return type.validator(value)
  }
  if (type.type === Function) {
    return isFunction(value)
  }
  if (type.type === Array) {
    return Array.isArray(value)
  }
  return value === type.type(value)
}

const vueTypes = {

  func: {
    type: Function,
    default: noop
  },

  array: {
    type: Array,
    default: Array
  },

  object: {
    type: Object,
    default: Object
  },

  bool: {
    type: Boolean,
    default: true
  },

  string: {
    type: String,
    default: ''
  },

  num: {
    type: Number,
    default: 0
  },

  number: {
    type: Number,
    default: 0
  },

  any: {
    type: null
  },

  integer: {
    validator(value) {
      return Number.isInteger(value)
    },
    default: 0
  },

  custom(validator) {
    if (typeof validator !== 'function') {
      throw new TypeError('You must provide a function as argument')
    }

    const type = {
      validator
    }

    type.def = (def) => Object.assign({ default: def }, type)

    withRequired(type)

    return type
  },

  oneOf(arr) {
    if (!Array.isArray(arr)) {
      throw new TypeError('You must provide an array as argument')
    }

    return this.custom((value) => arr.indexOf(value) !== -1)
  },

  instanceOf(instanceConstructor) {
    return this.custom((value) => value instanceof instanceConstructor)
  },

  oneOfType(arr) {
    if (!Array.isArray(arr)) {
      throw new TypeError('You must provide an array as argument')
    }

    return this.custom((value) => {
      return arr.some((type) => {
        return validateType(type, value)
      })
    })
  },

  arrayOf(type) {
    return this.custom((values) => {
      if (!Array.isArray(values)) {
        return false
      }
      return values.every((value) => {
        return validateType(type, value)
      })
    })
  },

  shape(obj) {
    const keys = Object.keys(obj)
    return this.custom((value) => {
      return Object.keys(value).every((key) => {
        if (keys.indexOf(key) === -1) {
          return false
        }
        const type = obj[key]
        return validateType(type, value[key])
      })
    })
  }

}

Object.keys(vueTypes).forEach((key) => {
  if (isFunction(vueTypes[key]) === false) {
    Object.defineProperty(vueTypes[key], 'def', {
      value: withDefault.bind(vueTypes, key),
      enumerable: true,
      writable: false
    })

    withRequired(vueTypes[key])
  }
})

export default vueTypes
