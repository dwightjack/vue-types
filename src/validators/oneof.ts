import { toType, warn, isArray } from '../utils'

export default function oneOf<T = unknown>(arr: T[]) {
  if (!isArray(arr)) {
    throw new TypeError(
      '[VueTypes error]: You must provide an array as argument',
    )
  }
  const msg = `oneOf - value should be one of "${arr.join('", "')}"`
  const allowedTypes = arr.reduce((ret, v) => {
    if (v !== null && v !== undefined) {
      ret.indexOf(v.constructor) === -1 && ret.push(v.constructor)
    }
    return ret
  }, [])

  return toType<T>('oneOf', {
    type: allowedTypes.length > 0 ? allowedTypes : null,
    validator(value) {
      const valid = arr.indexOf(value) !== -1
      if (!valid) warn(msg)
      return valid
    },
  })
}
