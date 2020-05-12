import { toType, warn } from '../utils'
import { ValidatorFunction, VueTypeDef } from '../../types/vue-types'

export default function custom<T = any>(
  validatorFn: ValidatorFunction<T>,
  warnMsg = 'custom validation failed',
) {
  if (typeof validatorFn !== 'function') {
    throw new TypeError(
      '[VueTypes error]: You must provide a function as argument',
    )
  }

  return toType<T>(validatorFn.name || '<<anonymous function>>', {
    validator(value) {
      const valid = validatorFn(value)
      if (!valid) warn(`${(this as VueTypeDef<T>)._vueTypes_name} - ${warnMsg}`)
      return valid
    },
  })
}
