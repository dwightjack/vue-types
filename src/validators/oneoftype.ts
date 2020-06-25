import { Prop, VueProp, InferType } from '../types'
import {
  isArray,
  isComplexType,
  isVueTypeDef,
  isFunction,
  getType,
  toType,
  validateType,
  warn,
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
        nativeChecks = nativeChecks.concat(type.type || [])
        continue
      }
      if (isFunction(type.validator)) {
        hasCustomValidators = true
      }
      if (typeof type.type !== 'undefined') {
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
      const valid = arr.some((type) => {
        const t =
          isVueTypeDef(type) && type._vueTypes_name === 'oneOf'
            ? type.type || null
            : type
        return validateType(t, value, true) === true
      })
      if (!valid)
        warn(
          `oneOfType - value "${value}" does not match any of the passed-in validators.`,
        )
      return valid
    },
  })
}
