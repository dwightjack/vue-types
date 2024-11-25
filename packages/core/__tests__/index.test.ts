import { noop } from '../src/utils'
import * as native from '../src/validators/native'
import custom from '../src/validators/custom'
import oneOf from '../src/validators/oneof'
import oneOfType from '../src/validators/oneoftype'
import arrayOf from '../src/validators/arrayof'
import objectOf from '../src/validators/objectof'
import instanceOf from '../src/validators/instanceof'
import shape from '../src/validators/shape'
import VueTypes, { createTypes } from '../src/index'
import { getDescriptors, getExpectDescriptors } from './helpers'

describe('VueTypes', () => {
  describe('`.any`', () => {
    it('should proxy the `any` validator', () => {
      const expected = getExpectDescriptors(native.any())
      expect(getDescriptors(VueTypes.any)).toEqual(expected)
    })
  })

  describe('`.func`', () => {
    it('should proxy the `func` validator with a sensible default', () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const expected = getExpectDescriptors(native.func().def(() => {}))
      expect(getDescriptors(VueTypes.func)).toEqual(expected)
      expect(VueTypes.func.default).toBeInstanceOf(Function)
    })
  })

  describe('`.bool`', () => {
    it('should proxy the `bool` validator with a sensible default', () => {
      const expected = getExpectDescriptors(native.bool().def(true))
      expect(getDescriptors(VueTypes.bool)).toEqual(expected)
      expect(VueTypes.bool.default).toBe(true)
    })
  })

  describe('`.string`', () => {
    it('should proxy the `string` validator with a sensible default', () => {
      const expected = getExpectDescriptors(native.string().def(''))
      expect(getDescriptors(VueTypes.string)).toEqual(expected)
      expect(VueTypes.string.default).toBe('')
    })
  })

  describe('`.number`', () => {
    it('should proxy the `number` validator with a sensible default', () => {
      const expected = getExpectDescriptors(native.number().def(0))
      expect(getDescriptors(VueTypes.number)).toEqual(expected)
      expect(VueTypes.number.default).toBe(0)
    })
  })

  describe('`.array`', () => {
    it('should proxy the `array` validator with a sensible default', () => {
      const expected = getExpectDescriptors(native.array().def([]))
      expect(getDescriptors(VueTypes.array)).toEqual(expected)
      expect(VueTypes.array.default).toBeInstanceOf(Function)
      expect(VueTypes.array.default()).toEqual([])
    })
  })

  describe('`.object`', () => {
    it('should proxy the `object` validator with a sensible default', () => {
      const expected = getExpectDescriptors(native.object().def({}))
      expect(getDescriptors(VueTypes.object)).toEqual(expected)
      expect(VueTypes.object.default).toBeInstanceOf(Function)
      expect(VueTypes.object.default()).toEqual({})
    })
  })

  /**
   * Custom Types
   */

  describe('`.integer`', () => {
    it('should proxy the `integer` validator with a sensible default', () => {
      const expected = getExpectDescriptors(native.integer().def(0))
      expect(getDescriptors(VueTypes.integer)).toEqual(expected)
      expect(VueTypes.integer.default).toBe(0)
    })
  })

  describe('`.symbol`', () => {
    it('should proxy the `symbol` validator', () => {
      const expected = getExpectDescriptors(native.symbol())
      expect(getDescriptors(VueTypes.symbol)).toEqual(expected)
    })
  })

  describe('`.nullable`', () => {
    it('should proxy the `nullable` validator', () => {
      const expected = getExpectDescriptors(native.nullable())
      expect(getDescriptors(VueTypes.nullable)).toEqual(expected)
    })
  })

  describe('`.custom`', () => {
    it('should proxy the `custom` validator', () => {
      const fn = () => true
      const expected = getExpectDescriptors(custom(fn))
      expect(getDescriptors(VueTypes.custom(fn))).toEqual(expected)
    })
  })

  describe('`.oneOf`', () => {
    it('should proxy the `oneOf` validator', () => {
      const arr = [1, 2, 'demo'] as const
      const expected = getExpectDescriptors(oneOf(arr))
      expect(getDescriptors(VueTypes.oneOf(arr))).toEqual(expected)
    })
  })

  describe('`.instanceOf`', () => {
    it('should proxy the `instanceOf` validator', () => {
      // eslint-disable-next-line @typescript-eslint/no-extraneous-class
      class Demo {}
      const expected = getExpectDescriptors(instanceOf(Demo))
      expect(getDescriptors(VueTypes.instanceOf(Demo))).toEqual(expected)
    })
  })

  describe('`.arrayOf`', () => {
    it('should proxy the `arrayOf` validator', () => {
      const expected = getExpectDescriptors(arrayOf(String))
      expect(getDescriptors(VueTypes.arrayOf(String))).toEqual(expected)
    })
  })

  describe('`.objectOf`', () => {
    it('should proxy the `objectOf` validator', () => {
      const expected = getExpectDescriptors(objectOf(String))
      expect(getDescriptors(VueTypes.objectOf(String))).toEqual(expected)
    })
  })

  describe('`.shape`', () => {
    it('should proxy the `shape` validator', () => {
      const expected = getExpectDescriptors(shape({}))
      expect(getDescriptors(VueTypes.shape({}))).toEqual(expected)
    })
  })

  describe('`.oneOfType`', () => {
    it('should proxy the `oneOfType` validator', () => {
      const expected = getExpectDescriptors(oneOfType([Number, Array]))
      expect(getDescriptors(VueTypes.oneOfType([Number, Array]))).toEqual(
        expected,
      )
    })
  })

  describe('`sensibleDefaults` option', () => {
    it('should remove default "defaults" from types', () => {
      VueTypes.sensibleDefaults = false

      const types = [
        'func',
        'bool',
        'string',
        'number',
        'array',
        'object',
        'integer',
      ] as const

      types.forEach((prop) => {
        expect(VueTypes[prop].default).toBeUndefined()
      })
    })

    it('should set sensible "defaults" for types', () => {
      VueTypes.sensibleDefaults = false
      VueTypes.sensibleDefaults = true

      const types = [
        'func',
        'bool',
        'string',
        'number',
        'array',
        'object',
        'integer',
      ] as const

      types.forEach((prop) => {
        expect(VueTypes[prop].default).toBeDefined()
      })
    })

    it('should allow custom defaults for types', () => {
      VueTypes.sensibleDefaults = {
        func: noop,
        string: 'test',
      }

      const types = ['bool', 'number', 'array', 'object', 'integer'] as const

      types.forEach((prop) => {
        expect(VueTypes[prop].default).toBeUndefined()
      })

      expect(VueTypes.func.default).toBe(noop)
      expect(VueTypes.string.default).toBe('test')

      VueTypes.sensibleDefaults = true
    })
  })

  it('.extends has been removed', () => {
    VueTypes.extend({})

    expect(console.warn).toHaveBeenCalled()
  })
})

describe('VueTypes.utils', () => {
  const _utils = VueTypes.utils

  it('should be defined', () => {
    expect(VueTypes.utils).toBeInstanceOf(Object)
  })

  describe('.toType', () => {
    it('should be a function', () => {
      expect(_utils.toType).toBeInstanceOf(Function)
    })

    it('returns a validable type by default', () => {
      expect(_utils.toType('demo', { type: String })).not.toHaveProperty(
        'validate',
      )
    })

    it('returns a validable type is 3rd argument is true', () => {
      expect(
        _utils.toType('demo', { type: String }, true).validate,
      ).toBeInstanceOf(Function)
    })
  })

  describe('.validate', () => {
    it('should be a function', () => {
      expect(_utils.validate).toBeInstanceOf(Function)
    })

    it('should succeed with VueTypes types', () => {
      expect(_utils.validate('string', VueTypes.string)).toBe(true)
      expect(_utils.validate(0, VueTypes.string)).toBe(false)
    })

    it('should succeed with simple type checks', () => {
      expect(_utils.validate('string', { type: String })).toBe(true)
      expect(_utils.validate(0, { type: String })).toBe(false)
    })

    it('should allow custom validator functions', () => {
      const type = {
        type: String,
        validator: (value: string) => value.length > 4,
      }
      expect(_utils.validate('string', type)).toBe(true)
      expect(_utils.validate('s', type)).toBe(false)
    })
  })
})

describe('`createTypes()`', () => {
  it('creates a custom VueTypes class', () => {
    const MyClass = createTypes()

    expect(MyClass.string).toEqual(
      expect.objectContaining({
        type: String,
      }),
    )
  })

  it('accepts custom defaults', () => {
    const MyClass = createTypes({ string: 'hello world' })

    expect(MyClass.string).toEqual(
      expect.objectContaining({
        type: String,
        default: 'hello world',
      }),
    )
  })
})
