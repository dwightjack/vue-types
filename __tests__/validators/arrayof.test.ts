import arrayOf from '../../src/validators/arrayof'
import { number, integer } from '../../src/validators/native'
import { forceNoContext, checkRequired } from '../helpers'

describe('`.arrayOf`', () => {
  it('should have a type `Array`', () => {
    const customType = arrayOf(Number)
    expect(customType.type).toBe(Array)
  })

  it('should add a `required` flag', () => {
    const customType = arrayOf(Number)
    checkRequired(customType)
  })

  it('should provide a method to set a custom default. `default` value must be a function', () => {
    const customType = arrayOf(Number)
    const def = customType.def([0, 1]).default
    expect(def).toBeInstanceOf(Function)
    expect(def()).toEqual([0, 1])
  })

  it('should NOT accept default values out of the allowed one', () => {
    const customType = arrayOf(Number)
    expect(customType.def(['test' as any, 1]).default).toBeUndefined()
  })

  it('should validate an array of same-type values', () => {
    const customType = arrayOf(Number)
    expect(forceNoContext(customType.validator)([0, 1, 2])).toBe(true)
  })

  it('should NOT validate an array of mixed-type values', () => {
    const customType = arrayOf(Number)
    expect(forceNoContext(customType.validator)([0, 1, 'string'])).toBe(false)
  })

  it('should allow validation of VuePropTypes native types', () => {
    const customType = arrayOf(number())
    expect(forceNoContext(customType.validator)([0, 1, 2])).toBe(true)
  })

  it('should allow validation of VuePropTypes custom types', () => {
    const customType = arrayOf(integer())
    const validator = forceNoContext(customType.validator)
    expect(validator([0, 1, 2])).toBe(true)
    expect(validator([0, 1.2, 2])).toBe(false)
  })
})
