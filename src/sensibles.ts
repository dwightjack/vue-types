import { VueTypesDefaults } from './types'

export const typeDefaults = (): VueTypesDefaults => ({
  func: () => undefined,
  bool: true,
  string: '',
  number: 0,
  array: () => [],
  object: () => ({}),
  integer: 0,
})
