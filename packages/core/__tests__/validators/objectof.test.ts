import { integer, number } from '../../src/validators/native'
import objectOf from '../../src/validators/objectof'
import { forceNoContext, checkRequired } from '../helpers'

describe('`.objectOf`', () => {
  it('should have a type `Object`', () => {
    const customType = objectOf(Number)
    expect(customType.type).toBe(Object)
  })

  it('should add a `required` flag', () => {
    const customType = objectOf(Number)
    checkRequired(customType)
  })

  it('should provide a method to set a custom default. `default` value must be a function', () => {
    const customType = objectOf(Number)
    const def = customType.def({ id: 10, age: 30 }).default
    expect(def).toBeInstanceOf(Function)
    expect(def()).toEqual({ id: 10, age: 30 })
  })

  it('should NOT accept default values out of the allowed one', () => {
    const customType = objectOf(Number)
    expect(customType.def({ id: '10', age: 30 } as any).default).toBeUndefined()
  })

  it('should validate an object of same-type values', () => {
    const customType = objectOf(Number)
    expect(forceNoContext(customType.validator)({ id: 10, age: 30 })).toBe(true)
  })

  it('should NOT validate an array of mixed-type values', () => {
    const customType = objectOf(Number)
    expect(
      forceNoContext(customType.validator)({ id: '10', age: 30 } as any),
    ).toBe(false)
  })

  it('should allow validation of VuePropTypes native types', () => {
    const customType = objectOf(number())
    expect(forceNoContext(customType.validator)({ id: 10, age: 30 })).toBe(true)
  })

  it('should allow validation of VuePropTypes custom types', () => {
    const customType = objectOf(integer())
    const validator = forceNoContext(customType.validator)
    expect(validator({ id: 10, age: 30 })).toBe(true)
    expect(validator({ id: 10.2, age: 30 })).toBe(false)
  })
})
