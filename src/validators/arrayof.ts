import { Prop } from 'vue/types/options'
import { VueProp } from '../../types/vue-types'
import { getType, toType, validateType, warn } from '../utils'

export default function arrayOf<T = any>(type: VueProp<T> | Prop<T>) {
  return toType<T[]>('arrayOf', {
    type: Array,
    validator(values) {
      const valid = values.every((value) => validateType(type, value))
      if (!valid) warn(`arrayOf - value must be an array of "${getType(type)}"`)
      return valid
    },
  })
}
