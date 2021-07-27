import { Prop, VueProp, InferType } from '../types'
import { toType, validateType, warn, indent } from '../utils'

export default function objectOf<T extends VueProp<any> | Prop<any>>(type: T) {
  return toType<{ [key: string]: InferType<T> }>('objectOf', {
    type: Object,
    validator(obj) {
      let vResult: string | boolean = ''
      const valid = Object.keys(obj).every((key) => {
        vResult = validateType(type, obj[key], true)
        return vResult === true
      })

      if (!valid) {
        warn(`objectOf - value validation error:\n${indent(vResult as string)}`)
      }
      return valid
    },
  })
}
