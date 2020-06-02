import { Prop } from 'vue/types/options'
import { VueProp } from '../../types/vue-types'
import { getType, toType, validateType, warn } from '../utils'

export default function objectOf<T>(type: Prop<T> | VueProp<T>) {
  return toType<{ [key: string]: T }>('objectOf', {
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
