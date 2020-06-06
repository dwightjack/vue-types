import { Prop } from 'vue/types/options'
import { VueProp, InferType } from '../../types/vue-types'
import { getType, toType, validateType, warn } from '../utils'

export default function arrayOf<
  T extends VueProp<any> | Prop<any>,
  U = InferType<T>
>(type: T) {
  return toType<U[]>('arrayOf', {
    type: Array,
    validator(values) {
      const valid = values.every((value) => validateType(type, value))
      if (!valid) warn(`arrayOf - value must be an array of "${getType(type)}"`)
      return valid
    },
  })
}
