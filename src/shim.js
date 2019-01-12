const type = () => ({
  def(v) {
    this.default = v; return this
  },
  get isRequired() {
    this.required = true;
    return this
  },
  validator() { }
})

const createValidator = (root, name, getter = false) => {

  const prop = getter ? 'get' : 'value'
  const descr = { [prop]: () => type() }

  root[name] = descr
  return root;
}

const getters = ['any', 'func', 'bool', 'string', 'number', 'array', 'object', 'integer', 'symbol']
const methods = ['oneOf', 'custom', 'instanceOf', 'oneOfType', 'arrayOf', 'objectOf', 'shape']

const vueTypes = {}

getters.forEach((p) => createValidator(vueTypes, p, true))
methods.forEach((p) => createValidator(vueTypes, p, false))

export default vueTypes
