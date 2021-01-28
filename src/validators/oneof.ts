import { Prop } from '../types'
import { toType, warn, isArray } from '../utils'

export default function oneOf<T extends readonly any[]>(arr: T) {
  if (!isArray(arr)) {
    throw new TypeError(
      '[VueTypes error]: You must provide an array as argument.',
    )
  }
  const msg = `oneOf - value should be one of "${arr.join('", "')}".`
  const allowedTypes = arr.reduce((ret, v) => {
    if (v !== null && v !== undefined) {
      const constr = (v as any).constructor
      ret.indexOf(constr) === -1 && ret.push(constr)
    }
    return ret
  }, [] as Prop<T[number]>[])

  return toType<T[number]>('oneOf', {
    type: allowedTypes.length > 0 ? allowedTypes : undefined,
    validator(value) {
      const valid = arr.indexOf(value) !== -1
      if (!valid) warn(msg)
      return valid
    },
  })
}
