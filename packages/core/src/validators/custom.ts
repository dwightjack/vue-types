import { toType, warn } from '../utils'
import { ValidatorFunction, VueTypeDef, PropType } from '../types'

export default function custom<T>(
  validatorFn: ValidatorFunction<T>,
  warnMsg = 'custom validation failed',
) {
  if (typeof validatorFn !== 'function') {
    throw new TypeError(
      '[VueTypes error]: You must provide a function as argument',
    )
  }

  return toType<T>(validatorFn.name || '<<anonymous function>>', {
    type: null as unknown as PropType<T>,
    validator(this: VueTypeDef<T>, value: T) {
      const valid = validatorFn(value)
      if (!valid) warn(`${this._vueTypes_name} - ${warnMsg}`)
      return valid
    },
  })
}
