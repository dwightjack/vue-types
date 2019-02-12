import { setDefaults } from './sensibles'

const type = (props) => Object.assign({
  def (v) {
    this.default = v
    return this
  },
  get isRequired () {
    this.required = true
    return this
  },
  validator () {}
}, props)

const vueTypes = setDefaults({
  utils: {
    toType: type,
    validate: () => true
  }
})

const createValidator = (root, name, getter = false, props) => {
  const prop = getter ? 'get' : 'value'
  const descr = { [prop]: () => type(props).def(getter ? vueTypes.sensibleDefaults[name] : undefined) }

  return Object.defineProperty(root, name, descr)
}

const getters = ['any', 'func', 'bool', 'string', 'number', 'array', 'object', 'symbol']
const methods = ['oneOf', 'custom', 'instanceOf', 'oneOfType', 'arrayOf', 'objectOf']

getters.forEach((p) => createValidator(vueTypes, p, true, { validate () {} }))
methods.forEach((p) => createValidator(vueTypes, p, false))
createValidator(vueTypes, 'integer', true) // does not have a validate method

Object.defineProperty(vueTypes, 'shape', {
  value () {
    return Object.defineProperty(type(), 'loose', {
      get () { return this },
      enumerable: false
    })
  }
})

export default vueTypes
