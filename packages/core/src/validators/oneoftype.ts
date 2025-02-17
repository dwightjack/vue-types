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
  D extends V,
  U extends VueProp<any> | Prop<any> = any,
  V = InferType<U>,
>(arr: U[]) {
  if (!isArray(arr)) {
    throw new TypeError(
      '[VueTypes error]: You must provide an array as argument',
    )
  }

  let hasCustomValidators = false
  let hasNullable = false

  let nativeChecks: (Prop<V> | null)[] = []

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < arr.length; i += 1) {
    const type = arr[i]
    if (isComplexType<V>(type)) {
      if (isFunction(type.validator)) {
        hasCustomValidators = true
      }
      if (isVueTypeDef<V>(type, 'oneOf') && type.type) {
        nativeChecks = nativeChecks.concat(type.type as PropType<V>)
        continue
      }
      if (isVueTypeDef<V>(type, 'nullable')) {
        hasNullable = true
        continue
      }
      if (type.type === true || !type.type) {
        warn('oneOfType - invalid usage of "true" and "null" as types.')
        continue
      }
      nativeChecks = nativeChecks.concat(type.type)
    } else {
      nativeChecks.push(type as Prop<V>)
    }
  }

  // filter duplicates
  nativeChecks = nativeChecks.filter((t, i) => nativeChecks.indexOf(t) === i)

  const typeProp =
    hasNullable === false && nativeChecks.length > 0 ? nativeChecks : null

  if (!hasCustomValidators) {
    // we got just native objects (ie: Array, Object)
    // delegate to Vue native prop check
    return toType<D>('oneOfType', {
      type: typeProp as unknown as PropType<D>,
    })
  }

  return toType<D>('oneOfType', {
    type: typeProp as unknown as PropType<D>,
    validator(value) {
      const err: string[] = []
      const valid = arr.some((type) => {
        const res = validateType(type, value, true)
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
