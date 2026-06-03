import { Prop, VueProp, VueTypeShape, VueTypeLooseShape } from '../types'
import { toType, validateType, warn, isPlainObject, indent } from '../utils'

export default function shape<T extends object>(obj: {
  [K in keyof T]: Prop<T[K]> | VueProp<T[K]>
}): VueTypeShape<T> {
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const keys = Object.keys(obj) as (keyof T)[]
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const requiredKeys = keys.filter((key) => !!(obj as any)[key]?.required)

  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const type = toType('shape', {
    type: Object,
    validator(this: VueTypeShape<T> | VueTypeLooseShape<T>, value) {
      if (!isPlainObject(value)) {
        return false
      }
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      const valueKeys = Object.keys(value) as (keyof T)[]

      // check for required keys (if any)
      if (requiredKeys.some((req) => valueKeys.indexOf(req) === -1)) {
        const missing = requiredKeys.filter(
          (req) => valueKeys.indexOf(req) === -1,
        )
        if (missing.length === 1) {
          warn(
            `shape - required property "${missing[0]?.toString()}" is not defined.`,
          )
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
          // oxlint-disable-next-line typescript/no-unsafe-type-assertion
          if ((this as VueTypeLooseShape<T>)._vueTypes_isLoose) return true
          warn(
            `shape - shape definition does not include a "${key.toString()}" property. Allowed keys: "${keys.join(
              '", "',
            )}".`,
          )
          return false
        }
        const _type = obj[key]
        // oxlint-disable-next-line typescript/no-unsafe-type-assertion
        const valid = validateType(_type, (value as T)[key], true)
        if (typeof valid === 'string') {
          warn(
            `shape - "${key?.toString()}" property validation error:\n ${indent(valid)}`,
          )
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
