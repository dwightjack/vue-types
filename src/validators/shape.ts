import isPlainObject from 'is-plain-object'
import { Prop } from 'vue/types/options'
import { VueProp, VueTypeShape } from '../../types/vue-types'
import { toType, validateType, warn } from '../utils'

export default function shape<T>(
  obj: { [K in keyof T]?: Prop<T[K]> | VueProp<T[K], any> },
): VueTypeShape<T> {
  const keys = Object.keys(obj)
  const requiredKeys = keys.filter(
    (key) => obj[key] && obj[key].required === true,
  )

  const type = toType('shape', {
    type: Object,
    validator(value) {
      if (!isPlainObject(value)) {
        return false
      }
      const valueKeys = Object.keys(value)

      // check for required keys (if any)
      if (
        requiredKeys.length > 0 &&
        requiredKeys.some((req) => valueKeys.indexOf(req) === -1)
      ) {
        warn(
          `shape - at least one of required properties "${requiredKeys.join(
            '", "',
          )}" is not present`,
        )
        return false
      }

      return valueKeys.every((key) => {
        if (keys.indexOf(key) === -1) {
          if (this._vueTypes_isLoose === true) return true
          warn(`shape - object is missing "${key}" property`)
          return false
        }
        const type = obj[key]
        return validateType(type, value[key])
      })
    },
  }) as VueTypeShape<T>

  Object.defineProperty(type, '_vueTypes_isLoose', {
    writable: true,
    value: false,
  })

  Object.defineProperty(type, 'loose', {
    get() {
      this._vueTypes_isLoose = true
      return this
    },
  })

  return type
}
