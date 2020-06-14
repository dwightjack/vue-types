import { Prop, VueProp, InferType } from '../types'
import { getType, toType, validateType, warn } from '../utils'

export default function arrayOf<
  T extends VueProp<any> | Prop<any>,
  U = InferType<T>
>(type: T) {
  return toType<U[]>('arrayOf', {
    type: Array,
    validator(values: any[]) {
      const valid = values.every((value) => validateType(type, value))
      if (!valid) warn(`arrayOf - value must be an array of "${getType(type)}"`)
      return valid
    },
  })
}
