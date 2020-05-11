import { toType, warn } from '../utils'
import { ValidatorFunction } from '../../types/vue-types'

export default function custom(
  validatorFn: ValidatorFunction,
  warnMsg = 'custom validation failed',
) {
  if (typeof validatorFn !== 'function') {
    throw new TypeError(
      '[VueTypes error]: You must provide a function as argument',
    )
  }

  return toType(validatorFn.name || '<<anonymous function>>', {
    validator(value) {
      const valid = validatorFn(value)
      if (!valid) warn(`${this._vueTypes_name} - ${warnMsg}`)
      return valid
    },
  })
}
