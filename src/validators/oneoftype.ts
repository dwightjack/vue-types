import { Prop } from 'vue/types/options'
import { VueProp, InferType } from '../../types/vue-types'
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

  const nativeChecks = arr.reduce<Prop<V>[]>((ret, type) => {
    if (isComplexType<V>(type)) {
      if (
        isVueTypeDef<V>(type) &&
        type._vueTypes_name === 'oneOf' &&
        type.type
      ) {
        return ret.concat(type.type)
      }
      if (isFunction(type.validator)) {
        hasCustomValidators = true
        return ret
      }
      if (type.type) {
        return ret.concat(type.type)
      }

      return ret
    }
    ret.push(type as any)
    return ret
  }, [])

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
