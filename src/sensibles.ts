import { VueTypesDefaults } from '../types/vue-types'

export const typeDefaults = (): VueTypesDefaults => ({
  func() {},
  bool: true,
  string: '',
  number: 0,
  array: () => [],
  object: () => ({}),
  integer: 0,
})

export const setDefaults = (
  root: any,
  defs: Partial<VueTypesDefaults> = typeDefaults(),
) => {
  let currentDefaults = { ...defs }
  return Object.defineProperty(root, 'sensibleDefaults', {
    set(value) {
      if (value === false) {
        currentDefaults = {}
      } else if (value === true) {
        currentDefaults = { ...defs }
      } else {
        currentDefaults = { ...value }
      }
    },
    get() {
      return currentDefaults
    },
  })
}
