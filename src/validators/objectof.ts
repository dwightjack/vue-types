import { Prop, VueProp, InferType } from '../../types/vue-types'
import { getType, toType, validateType, warn } from '../utils'

export default function objectOf<
  T extends VueProp<any> | Prop<any>,
  U = InferType<T>
>(type: T) {
  return toType<{ [key: string]: U }>('objectOf', {
    type: Object,
    validator(obj) {
      const valid = Object.keys(obj).every((key) =>
        validateType(type, obj[key]),
      )
      if (!valid)
        warn(`objectOf - value must be an object of "${getType(type)}"`)
      return valid
    },
  })
}
