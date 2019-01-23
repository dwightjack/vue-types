
const typeDefaults = () => ({
  func: () => {},
  bool: true,
  string: '',
  number: 0,
  array: () => [],
  object: () => ({}),
  integer: 0
})

export const setDefaults = (root) => {
  let currentDefaults = typeDefaults()

  return Object.defineProperty(root, 'sensibleDefaults', {
    enumerable: false,
    set (value) {
      if (value === false) {
        currentDefaults = {}
      } else if (value === true) {
        currentDefaults = typeDefaults()
      } else {
        currentDefaults = value
      }
    },
    get () {
      return currentDefaults
    }
  })
}
