import { Prop, VueProp, VueTypeShape, VueTypeLooseShape } from '../types'
import { toType, validateType, warn, isPlainObject, indent } from '../utils'

// eslint-disable-next-line @typescript-eslint/ban-types
export default function shape<T extends object>(obj: {
  [K in keyof T]: Prop<T[K]> | VueProp<T[K]>
}): VueTypeShape<T> {
  const keys = Object.keys(obj)
  const requiredKeys = keys.filter((key) => !!(obj as any)[key]?.required)

  const type = toType('shape', {
    type: Object,
    validator(this: VueTypeShape<T> | VueTypeLooseShape<T>, value) {
      if (!isPlainObject(value)) {
        return false
      }
      const valueKeys = Object.keys(value)

      // check for required keys (if any)
      if (
        requiredKeys.length > 0 &&
        requiredKeys.some((req) => valueKeys.indexOf(req) === -1)
      ) {
        const missing = requiredKeys.filter(
          (req) => valueKeys.indexOf(req) === -1,
        )
        if (missing.length === 1) {
          warn(`shape - required property "${missing[0]}" is not defined.`)
        } else {
          warn(
            `shape - required properties "${missing.join(
              '", "',
            )}" are not defined.`,
          )
        }

        return false
      }

      return valueKeys.every((key) => {
        if (keys.indexOf(key) === -1) {
          if ((this as VueTypeLooseShape<T>)._vueTypes_isLoose === true)
            return true
          warn(
            `shape - shape definition does not include a "${key}" property. Allowed keys: "${keys.join(
              '", "',
            )}".`,
          )
          return false
        }
        const type = (obj as any)[key]
        const valid = validateType(type, value[key], true)
        if (typeof valid === 'string') {
          warn(`shape - "${key}" property validation error:\n ${indent(valid)}`)
        }
        return valid === true
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
