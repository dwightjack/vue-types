import { string, integer, any } from '../../src/validators/native'
import shape from '../../src/validators/shape'
import { forceNoContext, checkRequired } from '../helpers'

describe('`.shape`', () => {
  let shapeType: object

  beforeEach(() => {
    shapeType = {
      id: Number,
      name: String,
      age: integer(),
    }
  })

  it('should add a `required` flag', () => {
    const customType = shape(shapeType)
    checkRequired(customType)
  })

  it('should validate an object with a given shape', () => {
    const customType = shape(shapeType)
    expect(
      forceNoContext(customType.validator)({
        id: 10,
        name: 'John',
        age: 30,
      }),
    ).toBe(true)
  })

  it('should NOT validate an object without a given shape', () => {
    const customType = shape(shapeType)
    expect(
      forceNoContext(customType.validator)({
        id: '10',
        name: 'John',
        age: 30,
      }),
    ).toBe(false)
  })

  it('should NOT validate an object with keys NOT present in the shape', () => {
    const customType = shape(shapeType)
    expect(
      forceNoContext(customType.validator)({
        id: 10,
        name: 'John',
        age: 30,
        nationality: '',
      }),
    ).toBe(false)
  })

  it('should validate an object with keys NOT present in the shape on `loose` mode', () => {
    const customType = shape(shapeType).loose
    expect(
      forceNoContext(customType.validator)({
        id: 10,
        name: 'John',
        age: 30,
        nationality: '',
      }),
    ).toBe(true)
  })

  it('should validate an objects shape on `loose` mode and respect flags', () => {
    const customType = shape(shapeType).loose.isRequired
    expect(
      forceNoContext(customType.validator)({
        id: 10,
        name: 'John',
        age: 30,
        nationality: '',
      }),
    ).toBe(true)
  })

  it('should validate an objects shape on `loose` mode and respect flags in different order', () => {
    const customType = shape(shapeType).isRequired.loose
    expect(
      forceNoContext(customType.validator)({
        id: 10,
        name: 'John',
        age: 30,
        nationality: '',
      }),
    ).toBe(true)
  })

  it('should NOT validate a value which is NOT an object', () => {
    const customType = shape(shapeType)
    const validator = forceNoContext(customType.validator)
    expect(validator('a string' as any)).toBe(false)

    class MyClass {
      id: string
      name: string
      age: number
      constructor() {
        this.id = '10'
        this.name = 'John'
        this.age = 30
      }
    }

    expect(validator(new MyClass())).toBe(false)
  })

  it('should provide a method to set a custom default', () => {
    const customType = shape(shapeType)
    const defVals = {
      id: 10,
      name: 'John',
      age: 30,
    }
    const def = customType.def(defVals).default
    expect(def).toBeInstanceOf(Function)
    expect(def()).toEqual(defVals)
  })

  it('should NOT accept default values with an incorrect shape', () => {
    const customType = shape(shapeType)
    const def = {
      id: '10',
      name: 'John',
      age: 30,
    }
    expect(customType.def(def).default).toBeUndefined()
  })

  it('should allow required keys in shape (simple)', () => {
    const customType = shape({
      id: integer().isRequired,
      name: String,
    })
    const validator = forceNoContext(customType.validator)

    expect(
      validator({
        name: 'John',
      } as any),
    ).toBe(false)

    expect(
      validator({
        id: 10,
      } as any),
    ).toBe(true)
  })

  it('should allow required keys in shape (with a null type required)', () => {
    const customType = shape({
      myKey: any().isRequired,
      name: null,
    })
    const validator = forceNoContext(customType.validator)

    expect(
      validator({
        name: 'John',
      } as any),
    ).toBe(false)

    expect(
      validator({
        myKey: null,
      } as any),
    ).toBe(true)
  })

  it('Should accept properties explicitly set to undefined', () => {
    const customType = shape({
      message: string(),
    })
    const validator = forceNoContext(customType.validator)

    expect(
      validator({
        message: undefined,
      }),
    ).toBe(true)
  })
})
