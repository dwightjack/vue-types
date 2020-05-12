import { Prop } from 'vue/types/options'
import { VueProp } from '../../types/vue-types'
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

export default function oneOfType<T extends VueProp<any> | Prop<any>>(
  arr: T[],
) {
  if (!isArray(arr)) {
    throw new TypeError(
      '[VueTypes error]: You must provide an array as argument',
    )
  }

  let hasCustomValidators = false

  const nativeChecks = arr.reduce<Prop<any>[]>((ret, type) => {
    if (isComplexType(type)) {
      if (isVueTypeDef(type) && type._vueTypes_name === 'oneOf' && type.type) {
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
    ret.push(type as Prop<any>)
    return ret
  }, [])

  if (!hasCustomValidators) {
    // we got just native objects (ie: Array, Object)
    // delegate to Vue native prop check
    return toType<T>('oneOfType', {
      type: nativeChecks,
    })
  }

  const typesStr = arr
    .reduce<string[]>(
      (ret, type) =>
        ret.concat(
          isComplexType(type) && isArray(type.type)
            ? type.type.map(getType)
            : getType(type),
        ),
      [],
    )
    .join('", "')

  return toType<T>('oneOfType', {
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
