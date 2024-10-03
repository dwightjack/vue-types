import { Prop, PropOptions } from '../types'
import { toType, warn, isArray } from '../utils'

export default function oneOf<D, T extends readonly D[] = readonly D[]>(
  arr: T,
) {
  if (!isArray(arr)) {
    throw new TypeError(
      '[VueTypes error]: You must provide an array as argument.',
    )
  }
  const msg = `oneOf - value should be one of "${arr
    .map((v: any) => (typeof v === 'symbol' ? v.toString() : v))
    .join('", "')}".`
  const base: PropOptions<T[number]> = {
    validator(value) {
      const valid = arr.indexOf(value) !== -1
      if (!valid) warn(msg)
      return valid
    },
  }
  if (arr.indexOf(null) === -1) {
    const type = arr.reduce(
      (ret, v) => {
        if (v !== null && v !== undefined) {
          const constr = (v as any).constructor
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          ret.indexOf(constr) === -1 && ret.push(constr)
        }
        return ret
      },
      [] as Prop<T[number]>[],
    )

    if (type.length > 0) {
      base.type = type
    }
  }

  return toType<T[number]>('oneOf', base)
}
