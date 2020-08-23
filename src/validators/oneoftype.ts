import { Prop, VueProp, InferType, PropType } from '../types'
import {
  isArray,
  isComplexType,
  isVueTypeDef,
  isFunction,
  toType,
  validateType,
  warn,
  indent,
} from '../utils'

export default function oneOfType<
  U extends VueProp<any> | Prop<any>,
  V = InferType<U>
>(arr: U[]) {
  if (!isArray(arr)) {
    throw new TypeError(
      '[VueTypes error]: You must provide an array as argument',
    )
  }

  let hasCustomValidators = false

  let nativeChecks: Prop<V>[] = []

  for (let i = 0; i < arr.length; i += 1) {
    const type = arr[i]
    if (isComplexType<V>(type)) {
      if (isVueTypeDef<V>(type) && type._vueTypes_name === 'oneOf') {
        nativeChecks = nativeChecks.concat(type.type as PropType<V>)
        continue
      }
      if (isFunction(type.validator)) {
        hasCustomValidators = true
      }
      if (type.type !== true && type.type) {
        nativeChecks = nativeChecks.concat(type.type)
        continue
      }
    }
    nativeChecks.push(type as Prop<V>)
  }

  // filter duplicates
  nativeChecks = nativeChecks.filter((t, i) => nativeChecks.indexOf(t) === i)

  if (!hasCustomValidators) {
    // we got just native objects (ie: Array, Object)
    // delegate to Vue native prop check
    return toType<V>('oneOfType', {
      type: nativeChecks,
    })
  }

  return toType<V>('oneOfType', {
    type: nativeChecks,
    validator(value) {
      const err: string[] = []
      const valid = arr.some((type) => {
        const t =
          isVueTypeDef(type) && type._vueTypes_name === 'oneOf'
            ? type.type || null
            : type
        const res = validateType(t, value, true)
        if (typeof res === 'string') {
          err.push(res)
        }
        return res === true
      })
      if (!valid) {
        warn(
          `oneOfType - provided value does not match any of the ${
            err.length
          } passed-in validators:\n${indent(err.join('\n'))}`,
        )
      }

      return valid
    },
  })
}
