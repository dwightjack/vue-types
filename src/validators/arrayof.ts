import { Prop, VueProp, InferType } from '../types'
import { getType, toType, validateType, warn } from '../utils'

export default function arrayOf<T extends VueProp<any> | Prop<any>>(type: T) {
  return toType<InferType<T>[]>('arrayOf', {
    type: Array,
    validator(values: any[]) {
      const valid = values.every((value) => validateType(type, value))
      if (!valid) warn(`arrayOf - value must be an array of "${getType(type)}"`)
      return valid
    },
  })
}
