import custom from '../../src/validators/custom'
import { VueTypeDef } from '../../src/types'
import { forceNoContext, checkRequired } from '../helpers'

describe('`.custom`', () => {
  let customType: VueTypeDef

  beforeEach(() => {
    customType = custom((val) => typeof val === 'string')
  })

  it('should match an object with a validator method', () => {
    expect(customType).toEqual(
      expect.objectContaining({
        validator: expect.any(Function),
      }),
    )
  })

  it('should add a `required` flag', () => {
    checkRequired(customType)
  })

  it('should provide a method to set a custom default', () => {
    expect(customType.def('test').default).toBe('test')
  })

  it('should provide a custom validator function', () => {
    const validator = forceNoContext(customType.validator)
    expect(validator('mytest')).toBe(true)
    expect(validator(0)).toBe(false)
  })
})
