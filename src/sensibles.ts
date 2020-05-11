import { TypeDefaults } from '../types/vue-types'

export const typeDefaults = (): TypeDefaults => ({
  func: () => {},
  bool: true,
  string: '',
  number: 0,
  array: () => [],
  object: () => ({}),
  integer: 0,
})

export const setDefaults = (root: any) => {
  let currentDefaults = typeDefaults()

  return Object.defineProperty(root, 'sensibleDefaults', {
    set(value) {
      if (value === false) {
        currentDefaults = {}
      } else if (value === true) {
        currentDefaults = typeDefaults()
      } else {
        currentDefaults = value
      }
    },
    get() {
      return currentDefaults
    },
  })
}
