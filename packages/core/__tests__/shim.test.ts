import { noop } from '../src/utils'
import VueTypes, { fromType, toValidableType, toType } from '../src/shim'

describe('SHIM: VueTypes', () => {
  describe('SHIM: `.any`', () => {
    it('should exist', () => {
      expect(VueTypes.any).not.toBe(undefined)
    })

    it('should have a `type` property', () => {
      const type = VueTypes.any
      expect(type.type).toBe(undefined)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.any
      expect(type.isRequired).toBe(type as any)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.any
      expect(type.def(true)).toBe(type as any)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.any
      const defValue = 'demo'
      expect(type.def(defValue).default).toBe(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.any.validator).toBeInstanceOf(Function)
    })

    it('should have a `validate` method', () => {
      expect(VueTypes.any.validate).toBeInstanceOf(Function)
    })
  })

  describe('SHIM: `.func`', () => {
    it('should exist', () => {
      expect(VueTypes.func).not.toBe(undefined)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.func.type).toBe(Function)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.func
      expect(type.isRequired).toBe(type as any)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.func
      expect(type.def()).toBe(type as any)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.func
      const defValue = () => undefined
      expect(type.def(defValue).default).toBe(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.func.validator).toBeInstanceOf(Function)
    })

    it('should have a `validate` method', () => {
      expect(VueTypes.func.validate).toBeInstanceOf(Function)
    })
  })

  describe('SHIM: `.bool`', () => {
    it('should exist', () => {
      expect(VueTypes.bool).not.toBe(undefined)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.bool.type).toBe(Boolean)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.bool
      expect(type.isRequired).toBe(type as any)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.bool
      expect(type.def(true)).toBe(type as any)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.bool
      const defValue = true
      expect(type.def(defValue).default).toBe(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.bool.validator).toBeInstanceOf(Function)
    })

    it('should have a `validate` method', () => {
      expect(VueTypes.bool.validate).toBeInstanceOf(Function)
    })
  })

  describe('SHIM: `.string`', () => {
    it('should exist', () => {
      expect(VueTypes.string).not.toBe(undefined)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.string.type).toBe(String)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.string
      expect(type.isRequired).toBe(type as any)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.string
      expect(type.def('a')).toBe(type as any)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.string
      const defValue = 'demo'
      expect(type.def(defValue).default).toBe(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.string.validator).toBeInstanceOf(Function)
    })

    it('should have a `validate` method', () => {
      expect(VueTypes.string.validate).toBeInstanceOf(Function)
    })
  })

  describe('SHIM: `.number`', () => {
    it('should exist', () => {
      expect(VueTypes.number).not.toBe(undefined)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.number.type).toBe(Number)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.number
      expect(type.isRequired).toBe(type as any)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.number
      expect(type.def(1)).toBe(type as any)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.number
      const defValue = 10
      expect(type.def(defValue).default).toBe(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.number.validator).toBeInstanceOf(Function)
    })

    it('should have a `validate` method', () => {
      expect(VueTypes.number.validate).toBeInstanceOf(Function)
    })
  })

  describe('SHIM: `.array`', () => {
    it('should exist', () => {
      expect(VueTypes.array).not.toBe(undefined)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.array.type).toBe(Array)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.array
      expect(type.isRequired).toBe(type as any)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.array
      expect(type.def([])).toBe(type as any)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.array
      const defValue = ['demo']
      expect(type.def(defValue).default()).toEqual(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.array.validator).toBeInstanceOf(Function)
    })

    it('should have a `validate` method', () => {
      expect(VueTypes.array.validate).toBeInstanceOf(Function)
    })
  })

  describe('SHIM: `.object`', () => {
    it('should exist', () => {
      expect(VueTypes.object).not.toBe(undefined)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.object.type).toBe(Object)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.object
      expect(type.isRequired).toBe(type as any)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.object
      expect(type.def({})).toBe(type as any)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.object
      const defValue = { demo: true }
      expect(type.def(defValue).default()).toEqual(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.object.validator).toBeInstanceOf(Function)
    })

    it('should have a `validate` method', () => {
      expect(VueTypes.object.validate).toBeInstanceOf(Function)
    })
  })

  /**
   * Custom Types
   */

  describe('SHIM: `.integer`', () => {
    it('should exist', () => {
      expect(VueTypes.integer).not.toBe(undefined)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.integer.type).toBe(Number)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.integer
      expect(type.isRequired).toBe(type as any)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.integer
      expect(type.def(1)).toBe(type as any)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.integer
      const defValue = 10
      expect(type.def(defValue).default).toBe(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.integer.validator).toBeInstanceOf(Function)
    })
  })

  describe('symbol', () => {
    it('should exist', () => {
      expect(VueTypes.symbol).not.toBe(undefined)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.symbol.type).toBe(undefined)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.symbol
      expect(type.isRequired).toBe(type as any)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.symbol
      expect(type.def(Symbol('a'))).toBe(type as any)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.symbol
      const defValue = Symbol('demo')
      expect(type.def(defValue).default).toBe(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.symbol.validator).toBeInstanceOf(Function)
    })

    it('should NOT have a `validate` method', () => {
      expect(VueTypes.symbol.validate).toBeUndefined()
    })
  })

  describe('`.nullable`', () => {
    it('should proxy the `nullable` validator', () => {
      expect(VueTypes.nullable).toEqual({ type: null })
    })
  })

  describe('SHIM: `.custom`', () => {
    it('should exist', () => {
      expect(VueTypes.custom).toBeInstanceOf(Function)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.custom(() => true).type).toBe(undefined)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.custom(() => true)
      expect(type.isRequired).toBe(type as any)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.custom(() => true)
      expect(type.def(true)).toBe(type as any)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.custom(() => true)
      const defValue = 'x'
      expect(type.def(defValue).default).toBe(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.custom(() => true).validator).toBeInstanceOf(Function)
    })
  })

  describe('SHIM: `.oneOf`', () => {
    it('should exist', () => {
      expect(VueTypes.oneOf).toBeInstanceOf(Function)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.oneOf([]).type).toBe(undefined)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.oneOf([])
      expect(type.isRequired).toBe(type as any)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.oneOf([])
      expect(type.def(true)).toBe(type as any)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.oneOf([])
      const defValue = 'x'
      expect(type.def(defValue).default).toBe(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.oneOf([]).validator).toBeInstanceOf(Function)
    })
  })

  describe('SHIM: `.instanceOf`', () => {
    it('should exist', () => {
      expect(VueTypes.instanceOf).toBeInstanceOf(Function)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.instanceOf(Object).type).toBe(Object)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.instanceOf(Object)
      expect(type.isRequired).toBe(type as any)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.instanceOf(Object)
      expect(type.def(true)).toBe(type as any)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.instanceOf(Object)
      const defValue = 'x'
      expect(type.def(defValue).default).toBe(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.instanceOf(Object).validator).toBeInstanceOf(Function)
    })
  })

  describe('SHIM: `.arrayOf`', () => {
    it('should exist', () => {
      expect(VueTypes.arrayOf).toBeInstanceOf(Function)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.arrayOf(String).type).toBe(Array)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.arrayOf(String)
      expect(type.isRequired).toBe(type as any)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.arrayOf(String)
      expect(type.def(true)).toBe(type as any)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.arrayOf(String)
      const defValue = ['x']
      expect(type.def(defValue).default()).toEqual(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.arrayOf(String).validator).toBeInstanceOf(Function)
    })
  })

  describe('SHIM: `.objectOf`', () => {
    it('should exist', () => {
      expect(VueTypes.objectOf).toBeInstanceOf(Function)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.objectOf(String).type).toBe(Object)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.objectOf(String)
      expect(type.isRequired).toBe(type as any)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.objectOf(String)
      expect(type.def(true)).toBe(type as any)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.objectOf(String)
      const defValue = { key: 'x' }
      expect(type.def(defValue).default()).toEqual(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.objectOf(String).validator).toBeInstanceOf(Function)
    })
  })

  describe('SHIM: `.shape`', () => {
    it('should exist', () => {
      expect(VueTypes.shape).toBeInstanceOf(Function)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.shape({}).type).toBe(Object)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.shape({})
      expect(type.isRequired).toBe(type as any)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.shape({})
      expect(type.def({})).toBe(type as any)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.shape({})
      const defValue = { shape: 'x' }
      expect(type.def(defValue).default()).toEqual(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.shape({}).validator).toBeInstanceOf(Function)
    })

    it('should have a `loose` flag that returns the type itself', () => {
      const type = VueTypes.shape({})
      expect(type.loose).toBe(type as any)
    })
  })

  describe('SHIM: `.oneOfType`', () => {
    it('should exist', () => {
      expect(VueTypes.oneOfType).toBeInstanceOf(Function)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.oneOfType([String]).type).toBe(undefined)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.oneOfType([String])
      expect(type.isRequired).toBe(type as any)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.oneOfType([String])
      expect(type.def(true)).toBe(type as any)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.oneOfType([String])
      const defValue = 'x'
      expect(type.def(defValue).default).toBe(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.oneOfType([String]).validator).toBeInstanceOf(Function)
    })
  })

  describe('SHIM: `sensibleDefaults` option', () => {
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
      ]

      types.forEach((prop) => {
        expect(VueTypes[prop].default).toBe(undefined)
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
      ]

      types.forEach((prop) => {
        expect(Object.keys(VueTypes[prop])).toContain('default')
      })
    })

    it('should allow custom defaults for types', () => {
      VueTypes.sensibleDefaults = {
        func: noop,
        string: 'test',
      }

      const types = ['bool', 'number', 'array', 'object', 'integer']

      types.forEach((prop) => {
        expect(VueTypes[prop].default).toBe(undefined)
      })

      expect(VueTypes.func.default).toBe(noop)
      expect(VueTypes.string.default).toBe('test')
    })
  })

  describe('SHIM: `.extend` helper', () => {
    it('should add getter prop to the library', () => {
      VueTypes.extend({
        name: 'date',
        getter: true,
        type: Date,
      })

      const dateType = (VueTypes as any).date
      expect(dateType).not.toBe(undefined)
    })

    it('should add a method to the library', () => {
      VueTypes.extend({
        name: 'dateFn',
        type: Date,
      })
      expect((VueTypes as any).dateFn).toBeInstanceOf(Function)
      expect((VueTypes as any).dateFn().isRequired.required).toBe(true)
    })

    it('should accept multiple types as array', () => {
      VueTypes.extend([
        {
          name: 'type1',
          type: String,
          getter: true,
        },
        {
          name: 'type2',
          type: Number,
          getter: true,
        },
      ])

      expect((VueTypes as any).type1.type).toBe(String)
      expect((VueTypes as any).type2.type).toBe(Number)
    })

    it('should add a validate method to the prop', () => {
      VueTypes.extend({
        name: 'stringCustom',
        type: Date,
        getter: true,
        validate: true,
      })
      expect((VueTypes as any).stringCustom.validate).toBeInstanceOf(Function)
    })

    it('should ignore the type property when inheriting from a custom type', () => {
      VueTypes.extend({
        name: 'customTypeChild',
        type: VueTypes.string,
        getter: true,
        validate: true,
      })
      expect((VueTypes as any).customTypeChild.type).toBe(null)
    })

    it('should be able to be get multiple times (eg:to avoid redefined property)', () => {
      VueTypes.extend({
        name: 'booleanCustom',
        getter: true,
        type: Boolean,
        default: undefined,
      })
      expect((VueTypes as any).booleanCustom.type).toBe(Boolean)
      expect((VueTypes as any).booleanCustom.type).toBe(Boolean)
    })
  })
})

describe('SHIM: VueTypes.utils', () => {
  it('should be defined', () => {
    expect(VueTypes.utils).toBeInstanceOf(Object)
  })

  describe('SHIM: .toType', () => {
    it('should be a function', () => {
      expect(VueTypes.utils.toType).toBeInstanceOf(Function)
    })

    it('returns an object', () => {
      expect(VueTypes.utils.toType()).toBeInstanceOf(Object)
    })
  })

  describe('SHIM: .validate', () => {
    it('should be a function', () => {
      expect(VueTypes.utils.validate).toBeInstanceOf(Function)
    })

    it('returns true', () => {
      expect(VueTypes.utils.validate()).toBe(true)
    })
  })
})

describe('`toType()`', () => {
  it('should enhance the passed-in object without cloning', () => {
    const obj = {}

    const type = toType('testType', obj)
    expect(type).toBe(obj as any)
  })

  it('should add a non-enumerable name property', () => {
    const type = toType('demo', {})
    expect(type._vueTypes_name).toBe('demo')
    expect(Object.keys(type)).not.toContain('_vueTypes_name')
  })

  it('should allow the name property to be writtable', () => {
    const type = toType('demo', {})
    type._vueTypes_name = 'a'
    expect(type._vueTypes_name).toBe('a')
  })

  describe('`isRequired`', () => {
    it('should add a `isRequired` getter on passed in object', () => {
      const obj = {}

      toType('testType', obj)
      // eslint-disable-next-line no-prototype-builtins
      expect(obj.hasOwnProperty('isRequired')).toBe(true)
    })

    it('should set the required flag', () => {
      const type = toType('testType', {}).isRequired
      expect(type.required).toBe(true)
    })
  })

  describe('`def()`', () => {
    it('should set `def` on passed in object', () => {
      const obj = {} as any

      toType('testType', obj)
      expect(obj.def).toBeInstanceOf(Function)
    })

    it('`def` should NOT be enumerable', () => {
      const type = toType('testType', {})
      expect(Object.keys(type)).not.toContain('def')
    })

    it('`def` should NOT be writable', () => {
      const type = toType('testType', {})

      try {
        ;(type as any).def = 'demo'
        // eslint-disable-next-line no-empty
      } catch (e) {}
      expect(type.def).toBeInstanceOf(Function)
    })

    it('should remove the "default" key if passed-in value is undefined', () => {
      const type = toType('testType', { type: String })
      type.def('')
      expect(type.default).toBe('')
      type.def(undefined)
      expect(Object.keys(type)).not.toContain('default')
    })

    it('sets a `default` key on the object', () => {
      const type = toType('testType', {})

      const stubs = [true, null, 'string', () => {}, 0]

      stubs.forEach((v) => {
        type.def(v)
        expect(type.default).toBe(v)
      })
    })

    it('sets a factory function if value is an array', () => {
      const arr = [1, 2]
      const type = toType('testType', { type: Array }).def(arr)
      expect(type.default).toBeInstanceOf(Function)
      expect(type.default()).not.toBe(arr)
      expect(type.default()).toEqual(arr)
    })

    it('sets a factory function if value is an object', () => {
      const obj = { a: 'hello' }
      const type = toType('testType', { type: Object }).def(obj)
      expect(type.default).toBeInstanceOf(Function)
      expect(type.default()).not.toBe(obj)
      expect(type.default()).toEqual(obj)
    })
  })
})

describe('`toValidableType()`', () => {
  it('creates a type', () => {
    const obj = { a: 'hello' }
    const type = toValidableType('testType', { type: Object }).def(
      obj,
    ).isRequired
    expect(type.default()).toEqual(obj)
    expect(type.required).toBe(true)
    expect(type._vueTypes_name).toBe('testType')
  })
  it('adds a validate function', () => {
    const type = toValidableType('testType', { type: String })
    expect(type.validate).toBeInstanceOf(Function)
  })
})

describe('`fromType()`', () => {
  it('inherits from a type', () => {
    const base = toType('a', { type: String }).isRequired
    const copy = fromType('b', base)

    expect(copy).not.toBe(base)
    expect(copy._vueTypes_name).toBe('b')
    expect(copy.type).toBe(base.type)
    expect(copy.required).toBe(base.required)
  })

  it('overwrite the source type', () => {
    const base = toType('a', { type: String }).isRequired
    const copy = fromType('b', base, { required: false })

    expect(base.required).toBe(true)
    expect(copy.required).toBe(false)
  })
})

describe('API parity', () => {
  it('includes all methods from the full build', async () => {
    const fullBuild = await import('../src/index')
    const shimBuild = await import('../src/shim')

    expect(Object.keys(shimBuild).sort()).toStrictEqual(
      Object.keys(fullBuild).sort(),
    )
  })
})
