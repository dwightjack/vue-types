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
  D extends InferType<U>,
  U extends VueProp<any> | Prop<any> = any,
>(arr: U[]) {
  if (!isArray(arr)) {
    throw new TypeError(
      '[VueTypes error]: You must provide an array as argument',
    )
  }

  type V = InferType<U>

  let hasCustomValidators = false
  let hasNullable = false

  let nativeChecks: (Prop<V> | null)[] = []

  for (let i = 0; i < arr.length; i += 1) {
    const type = arr[i]
    if (isComplexType<V>(type)) {
      // oxlint-disable-next-line typescript/unbound-method
      if (isFunction(type.validator)) {
        hasCustomValidators = true
      }
      if (isVueTypeDef<V>(type, 'oneOf') && type.type) {
        nativeChecks = nativeChecks.concat(type.type)
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
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      nativeChecks.push(type as Prop<V>)
    }
  }

  // filter duplicates
  nativeChecks = nativeChecks.filter((t, i) => nativeChecks.indexOf(t) === i)

  const typeProp = !hasNullable && nativeChecks.length > 0 ? nativeChecks : null

  if (!hasCustomValidators) {
    // we got just native objects (ie: Array, Object)
    // delegate to Vue native prop check
    return toType<D>('oneOfType', {
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      type: typeProp as unknown as PropType<D>,
    })
  }

  return toType<D>('oneOfType', {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
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
