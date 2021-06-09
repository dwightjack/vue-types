import { VueTypeDef } from '../../src/types'
import oneOf from '../../src/validators/oneof'
import { forceNoContext, checkRequired } from '../helpers'

describe('`.oneOf`', () => {
  let customType: VueTypeDef<0 | 1 | 'string'>

  beforeEach(() => {
    customType = oneOf([0, 1, 'string'] as const)
  })

  it('should match an object with a validator method', () => {
    expect(customType).toEqual(
      expect.objectContaining({
        validator: expect.any(Function),
      }),
    )
  })

  it('should have a valid array `type` property', () => {
    expect(customType.type).toBeInstanceOf(Array)
    expect(customType.type[0]).toBe(Number)
  })

  it('should add a `required` flag', () => {
    checkRequired(customType)
  })

  it('should provide a method to set a custom default', () => {
    expect(customType.def(1).default).toBe(1)
  })

  it('should NOT allow default values other than the provided ones', () => {
    expect(customType.def('not this' as any)).not.toEqual(
      expect.objectContaining({
        default: expect.anything(),
      }),
    )
  })

  it('should provide a custom validator function', () => {
    const validator = forceNoContext(customType.validator)
    expect(validator(0)).toBe(true)
    expect(validator(5)).toBe(false)
  })

  it('should filter `null` values type checking', () => {
    const myType = oneOf([null, undefined, 'string', 2])
    expect(myType.type).toEqual([String, Number])

    const myType2 = oneOf([null])
    expect(myType2.type).toBe(undefined)
  })
})
