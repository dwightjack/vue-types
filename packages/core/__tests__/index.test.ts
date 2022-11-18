import { noop } from '../src/utils'
import * as native from '../src/validators/native'
import custom from '../src/validators/custom'
import oneOf from '../src/validators/oneof'
import oneOfType from '../src/validators/oneoftype'
import arrayOf from '../src/validators/arrayof'
import objectOf from '../src/validators/objectof'
import instanceOf from '../src/validators/instanceof'
import shape from '../src/validators/shape'
import { VueTypeValidableDef, VueTypeDef } from '../src/types'
import VueTypes, { createTypes } from '../src/index'
import { getDescriptors, getExpectDescriptors } from './helpers'

type VueTypesType = typeof VueTypes

describe('VueTypes', () => {
  describe('`.any`', () => {
    it('should proxy the `any` validator', () => {
      const expected = getExpectDescriptors(native.any())
      expect(getDescriptors(VueTypes.any)).toEqual(expected)
    })
  })

  describe('`.func`', () => {
    it('should proxy the `func` validator with a sensible default', () => {
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
      ]

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
      ]

      types.forEach((prop) => {
        expect(VueTypes[prop].default).toBeDefined()
      })
    })

    it('should allow custom defaults for types', () => {
      VueTypes.sensibleDefaults = {
        func: noop,
        string: 'test',
      }

      const types = ['bool', 'number', 'array', 'object', 'integer']

      types.forEach((prop) => {
        expect(VueTypes[prop].default).toBeUndefined()
      })

      expect(VueTypes.func.default).toBe(noop)
      expect(VueTypes.string.default).toBe('test')

      VueTypes.sensibleDefaults = true
    })
  })

  describe('`.extend` helper', () => {
    it('should add getter prop to the library', () => {
      const validator = vi.fn()
      interface VueTypesDate extends VueTypesType {
        date: VueTypeDef<Date>
      }
      VueTypes.extend<VueTypesDate>({
        name: 'date',
        validator,
        getter: true,
        type: Date,
      })

      const dateType = (VueTypes as VueTypesDate).date

      expect(dateType).toBeDefined()
      const date = new Date()
      dateType.validator(date)
      expect(validator).toHaveBeenCalledWith(date)
    })

    it('should add a method to the library', () => {
      interface VueTypesDateFn extends VueTypesType {
        dateFn: () => VueTypeDef<Date>
      }
      VueTypes.extend<VueTypesDateFn>({
        name: 'dateFn',
        type: Date,
      })
      expect((VueTypes as VueTypesDateFn).dateFn).toBeInstanceOf(Function)
      expect((VueTypes as VueTypesDateFn).dateFn().isRequired).toEqual(
        expect.objectContaining({
          type: Date,
          required: true,
        }),
      )
    })

    it('should pass configuration params to the validator method', () => {
      const validator = vi.fn()
      interface VueTypesDateFnArgs extends VueTypesType {
        dateFnArgs: (...args: any[]) => VueTypeDef<Date>
      }
      VueTypes.extend<VueTypesDateFnArgs>({
        name: 'dateFnArgs',
        type: Date,
        validator,
      })

      const dateFnType = (VueTypes as VueTypesDateFnArgs).dateFnArgs(1, 2)
      const date = new Date()
      dateFnType.validator(date)
      expect(validator).toHaveBeenCalledWith(1, 2, date)
    })

    it('should add a validate method to the prop', () => {
      interface VueTypesString extends VueTypesType {
        stringCustom: VueTypeValidableDef<string>
      }
      VueTypes.extend<VueTypesString>({
        name: 'stringCustom',
        type: String,
        getter: true,
        validate: true,
      })
      expect((VueTypes as VueTypesString).stringCustom.validate).toBeInstanceOf(
        Function,
      )
    })

    it('should clone the base type definition at each call', () => {
      interface VueTypesClone extends VueTypesType {
        cloneDemo: VueTypeValidableDef<{ [key: string]: any }>
      }
      VueTypes.extend<VueTypesClone>({
        name: 'cloneDemo',
        type: Object,
        getter: true,
        validate: true,
      })
      expect((VueTypes as VueTypesClone).cloneDemo).not.toBe(
        (VueTypes as VueTypesClone).cloneDemo,
      )
    })

    it('should accept multiple types as array', () => {
      interface VueTypesMulti extends VueTypesType {
        type1: VueTypeValidableDef<string>
        type2: VueTypeValidableDef<string>
      }
      VueTypes.extend<VueTypesMulti>([
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
      expect((VueTypes as VueTypesMulti).type1.type).toBe(String)
      expect((VueTypes as VueTypesMulti).type2.type).toBe(Number)
    })

    it('should inherit from vue-types types', () => {
      const parent = VueTypes.string.isRequired.def('parent')

      interface VueTypesAlias extends VueTypesType {
        stringAlias: VueTypeValidableDef<string>
      }

      VueTypes.extend({
        name: 'stringAlias',
        type: parent,
        getter: true,
      })
      expect((VueTypes as VueTypesAlias).stringAlias).toEqual(
        expect.objectContaining({
          type: String,
          required: true,
          default: 'parent',
        }),
      )

      expect((VueTypes as VueTypesAlias).stringAlias.validate).toBeInstanceOf(
        Function,
      )
    })

    it('should inherit from vue-types type and add custom validation', () => {
      const parent = VueTypes.string
      const validator = vi.fn(() => true)

      interface VueTypesAliasValidate extends VueTypesType {
        stringValidationAlias: VueTypeValidableDef<string>
      }

      VueTypes.extend({
        name: 'stringValidationAlias',
        type: parent,
        getter: true,
        validator,
      })

      const type = (VueTypes as VueTypesAliasValidate).stringValidationAlias

      expect(type.type).toBe(String)
      expect(type.validator('a')).toBe(true)
      expect(validator).toHaveBeenCalledWith('a')
      expect(validator.mock.instances[0]).toBe(type)
    })

    it('should inherit from vue-types (complex types)', () => {
      const parent = VueTypes.shape({
        name: VueTypes.string.isRequired,
        number: VueTypes.oneOf([1, 2, 3] as const),
      }).isRequired.loose

      const spy = vi.spyOn(parent, 'validator')

      VueTypes.extend({
        name: 'shapeAlias',
        type: parent,
        getter: true,
      })

      const type = (VueTypes as any).shapeAlias

      expect(type).toEqual(
        expect.objectContaining({
          type: Object,
          required: true,
        }),
      )

      expect(typeof type.validator).toBe('function')

      const pass = {
        name: 'John',
        number: 1 as const,
      }

      const passLoose = {
        ...pass,
        other: true,
      }

      const fail = {
        ...pass,
        number: 4,
      }

      expect(type.validator(pass)).toBe(true)
      expect(spy).toHaveBeenCalledWith(pass)
      expect(spy.mock.instances[0]).toBe(type)

      expect(type.validator(passLoose)).toBe(true)
      expect(type.validator(fail)).toBe(false)
    })

    it('should inherit from other extended types', () => {
      VueTypes.extend({
        name: 'routerLocation',
        getter: true,
        type: VueTypes.oneOfType([
          VueTypes.shape({
            path: VueTypes.string.isRequired,
            query: VueTypes.object,
          }).loose,
          VueTypes.shape({
            name: VueTypes.string.isRequired,
            params: VueTypes.object,
          }).loose,
        ]),
      })

      VueTypes.extend({
        name: 'routerTo',
        getter: true,
        type: VueTypes.oneOfType([String, (VueTypes as any).routerLocation]),
      })

      const type = (VueTypes as any).routerTo

      // validate as string
      expect(type.validator('/url')).toBe(true)
      // validate as custom type
      expect(type.validator({ path: '/url' })).toBe(true)
    })

    it('should inherit from vue-types type (oneOf parent)', () => {
      const parent = VueTypes.oneOfType([Number, VueTypes.string])

      VueTypes.extend({
        name: 'aliasOneOf',
        getter: true,
        type: parent,
      })

      const type = (VueTypes as any).aliasOneOf

      expect(type.type).toBe(parent.type)
      expect(VueTypes.utils.validate(1, type)).toBe(true)
      expect(VueTypes.utils.validate(false, type)).toBe(false)
    })

    it('should inherit from vue-types type (non-getter types)', () => {
      const parent = VueTypes.string
      const validator = vi.fn()

      VueTypes.extend({
        name: 'aliasMinLength',
        type: parent,
        validator,
      })

      const type = (VueTypes as any).aliasMinLength(3)

      expect(type.type).toBe(String)
      type.validator('a')
      expect(validator).toHaveBeenCalledWith(3, 'a')
      expect(validator.mock.instances[0]).toBe(type)
    })
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
      expect((_utils.toType('demo', { type: String }) as any).validate).toBe(
        undefined,
      )
    })

    it('returns a validable type is 3rd argument is true', () => {
      expect(
        (_utils.toType('demo', { type: String }, true) as any).validate,
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
