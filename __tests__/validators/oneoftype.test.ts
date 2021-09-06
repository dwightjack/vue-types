import { string, integer, any } from '../../src/validators/native'
import oneOf from '../../src/validators/oneof'
import shape from '../../src/validators/shape'
import oneOfType from '../../src/validators/oneoftype'
import { forceNoContext, checkRequired } from '../helpers'

describe('`.oneOfType`', () => {
  class MyClass {
    constructor(public name: string) {}
  }

  const nativeTypes = [Number, Array, MyClass]
  const complexTypes = [oneOf([0, 1, 'string']), shape({ id: Number })]

  it('should add a `required` flag', () => {
    const customType = oneOfType(nativeTypes)
    checkRequired(customType)
  })

  it('should provide a method to set a custom default', () => {
    const customType = oneOfType(nativeTypes)
    expect(customType.def(1).default).toBe(1)
  })

  it('should NOT accept default values out of the allowed ones', () => {
    const customType = oneOfType(nativeTypes)
    expect(customType.def('test' as any).default).toBeUndefined()
  })

  it('should return a prop object with `type` as an array', () => {
    const customType = oneOfType(nativeTypes)
    expect(customType.type).toBeInstanceOf(Array)
  })

  it('should validate custom types with complex shapes', () => {
    const customType = oneOfType(complexTypes)
    const validator = forceNoContext(customType.validator)

    expect(validator(1)).toBe(true)

    // validates types not values!
    expect(validator(5)).toBe(true)

    expect(validator({ id: 10 })).toBe(true)
    expect(validator({ id: '10' })).toBe(false)
  })

  it('should validate multiple shapes', () => {
    const customType = oneOfType([
      shape({
        id: Number,
        name: string().isRequired,
      }),
      shape({
        id: Number,
        age: integer().isRequired,
      }),
      shape({}),
    ])

    const validator = forceNoContext(customType.validator)
    expect(validator({ id: 1, name: 'John' })).toBe(true)
    expect(validator({ id: 2, age: 30 })).toBe(true)
    expect(validator({})).toBe(true)

    expect(validator({ id: 2 })).toBe(false)
  })

  it('should validate edge cases with null and true', () => {
    expect(oneOfType([any()]).type).toBe(null)
    expect(oneOfType([{ type: true }]).type).toBe(null)
  })
})
