import instanceOf from '../../src/validators/instanceof'
import { VueTypeDef } from '../../src/types'
import { checkRequired } from '../helpers'

describe('`.instanceOf`', () => {
  let customType: VueTypeDef

  class MyClass {
    constructor(public name: string) {}
  }

  beforeEach(() => {
    customType = instanceOf(MyClass)
  })

  it('should match an object with a validator method', () => {
    expect(customType).toEqual(
      expect.objectContaining({
        type: MyClass,
      }),
    )
  })

  it('should add a `required` flag', () => {
    checkRequired(customType)
  })

  it('should provide a method to set a custom default', () => {
    const obj = new MyClass('john')
    expect(customType.def(obj).default).toBe(obj)
  })

  it('should NOT allow default values other than the provided ones', () => {
    expect(customType.def(new Date()).default).toBeUndefined()
  })
})
