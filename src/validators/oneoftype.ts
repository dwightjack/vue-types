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
      if (
        isVueTypeDef<V>(type) &&
        type._vueTypes_name === 'oneOf' &&
        type.type
      ) {
        nativeChecks = nativeChecks.concat(type.type)
        continue
      }
      if (isFunction(type.validator)) {
        hasCustomValidators = true
        continue
      }
      if (type.type) {
        nativeChecks = nativeChecks.concat(type.type)
        continue
      }
    }
    nativeChecks.push(type as Prop<V>)
  }

  if (!hasCustomValidators) {
    // we got just native objects (ie: Array, Object)
    // delegate to Vue native prop check
    return toType<V>('oneOfType', {
      type: nativeChecks,
    })
  }

  const typesStr = arr
    .reduce<string[]>(
      (ret, type) =>
        ret.concat(
          isComplexType<V>(type) && isArray((type as any).type)
            ? (type as any).type.map(getType)
            : getType(type),
        ),
      [],
    )
    .join('", "')

  return toType<V>('oneOfType', {
    validator(value) {
      const valid = arr.some((type) => {
        if (isVueTypeDef(type) && type._vueTypes_name === 'oneOf') {
          return type.type ? validateType(type.type, value, true) : true
        }
        return validateType(type, value, true)
      })
      if (!valid) warn(`oneOfType - value type should be one of "${typesStr}"`)
      return valid
    },
  })
}
