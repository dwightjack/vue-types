import { Prop, VueProp, InferType } from '../types'
import { toType, validateType, warn, indent } from '../utils'

export default function arrayOf<T extends VueProp<any> | Prop<any>>(type: T) {
  return toType<InferType<T>[]>('arrayOf', {
    type: Array,
    validator(values: any[]) {
      let vResult: string | boolean = ''
      const valid = values.every((value) => {
        vResult = validateType(type, value, true)
        return vResult === true
      })
      if (!valid) {
        warn(`arrayOf - value validation error:\n${indent(vResult as string)}`)
      }
      return valid
    },
  })
}
