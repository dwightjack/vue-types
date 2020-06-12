import expect from 'expect'
import Vue from 'vue'

import { noop, toType } from '../src/utils'
import { VueTypeValidableDef, VueTypeDef } from '../types/vue-types'
import VueTypes from '../src/index'

Vue.config.productionTip = false
Vue.config.silent = true

type VueTypesType = typeof VueTypes

const checkRequired = (type) => {
  expect(type).toIncludeKey('isRequired')

  expect(type.isRequired).toMatch({
    required: true,
  })
}

// Vue.js does keep the context for validators, so there is no `this`
const forceNoContext = (validator) => validator.bind(undefined)

describe('VueTypes', () => {
  describe('`.any`', () => {
    it('should have a `null` type', () => {
      expect(VueTypes.any.type).toBe(null)
    })

    it('should add a `required` flag', () => {
      checkRequired(VueTypes.any)
    })

    it('should provide a method to set a custom default', () => {
      expect(VueTypes.any.def('test').default).toBe('test')
    })
  })

  describe('`.func`', () => {
    it('should match an object with methods, type and default function', () => {
      expect(VueTypes.func.type).toBe(Function)
      expect(VueTypes.func.default).toBeA(Function)
    })

    it('should add a `required` flag', () => {
      checkRequired(VueTypes.func)
    })

    it('should provide a method to set a custom default', () => {
      function myFn() {}

      expect(VueTypes.func.def(myFn).default).toBe(myFn)
    })
  })

  describe('`.bool`', () => {
    it('should match an object with methods, type and default', () => {
      const match = {
        type: Boolean,
        default: true,
      }

      expect(VueTypes.bool).toMatch(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(VueTypes.bool)
    })

    it('should provide a method to set a custom default', () => {
      expect(VueTypes.bool.def(false).default).toBe(false)
    })
  })

  describe('`.string`', () => {
    it('should match an object with methods, type and default', () => {
      const match = {
        type: String,
        default: '',
      }

      expect(VueTypes.string).toMatch(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(VueTypes.string)
    })

    it('should provide a method to set a custom default', () => {
      expect(VueTypes.string.def('test').default).toBe('test')
    })
  })

  describe('`.number`', () => {
    it('should match an object with methods, type and default', () => {
      const match = {
        type: Number,
        default: 0,
      }

      expect(VueTypes.number).toMatch(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(VueTypes.number)
    })

    it('should provide a method to set a custom default', () => {
      expect(VueTypes.number.def(100).default).toBe(100)
    })
  })

  describe('`.array`', () => {
    it('should match an object with methods, type and default', () => {
      const match = {
        type: Array,
      }

      expect(VueTypes.array).toMatch(match)
      expect(VueTypes.array.default()).toBeA(Array)
    })

    it('should have default as a function', () => {
      expect(VueTypes.array.default).toBeA(Function)
    })

    it('should return an array as default value', () => {
      expect(VueTypes.array.default()).toBeA(Array)
    })

    it('should add a `required` flag', () => {
      checkRequired(VueTypes.array)
    })

    it('should provide a method to set a custom default. `default` value must be a function', () => {
      const arr = [0, 1]
      const def = VueTypes.array.def(arr).default
      expect(def).toMatch(Function)
      expect(def()).toEqual(arr)
    })

    it('should provide a method to set a custom default. If default value is a function it will be used as factory function', () => {
      const arrFactory = () => [0, 1]
      const def = VueTypes.array.def(arrFactory).default
      expect(def).toBe(arrFactory)
    })
  })

  describe('`.object`', () => {
    it('should match an object with methods, type and default', () => {
      const match = {
        type: Object,
      }

      expect(VueTypes.object).toMatch(match)
    })

    it('should have default as a function', () => {
      expect(VueTypes.array.default).toBeA(Function)
    })

    it('should return an object as default value', () => {
      expect(VueTypes.array.default()).toBeA(Object)
    })

    it('should add a `required` flag', () => {
      checkRequired(VueTypes.object)
    })

    it('should provide a method to set a custom default. `default` value must be a function', () => {
      const obj = { test: 'test' }
      const def = VueTypes.object.def(obj).default
      expect(def).toMatch(Function)
      expect(def()).toEqual(obj)
    })

    it('should provide a method to set a custom default. If default value is a function it will be used as factory function', () => {
      const objFactory = () => ({ test: 'test' })
      const def = VueTypes.object.def(objFactory).default
      expect(def).toBe(objFactory)
    })
  })

  /**
   * Custom Types
   */

  describe('`.integer`', () => {
    it('should match an object with methods, type and default', () => {
      const match = {
        type: Number,
        default: 0,
        validator: Function,
      }

      expect(VueTypes.integer).toMatch(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(VueTypes.integer)
    })

    it('should provide a method to set a custom default', () => {
      expect(VueTypes.integer.def(100).default).toBe(100)
    })

    it('should NOT allow float custom default', () => {
      expect(VueTypes.integer.def(0.1).default).toNotBe(0.1)
    })

    it('should provide a validator function that returns true on integer values', () => {
      const validator = forceNoContext(VueTypes.integer.validator)
      expect(validator(100)).toBe(true)
      expect(validator(Infinity)).toBe(false)
      expect(validator(0.1)).toBe(false)
    })
  })

  describe('symbol', () => {
    it('should match an object with type and validator, but not default', () => {
      const match = {
        type: null,
        validator: Function,
      }

      expect(VueTypes.symbol).toMatch(match)
      expect(VueTypes.symbol.default).toBe(undefined)
    })

    it('should validate symbols', function () {
      if ('Symbol' in window && typeof Symbol() === 'symbol') {
        expect(VueTypes.symbol.validator(Symbol())).toBe(true)
      } else {
        this.skip()
      }
    })
  })

  describe('`.custom`', () => {
    let customType

    beforeEach(() => {
      customType = VueTypes.custom((val) => typeof val === 'string')
    })

    it('should match an object with a validator method', () => {
      const match = {
        validator: Function,
      }

      expect(customType).toMatch(match)
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

  describe('`.oneOf`', () => {
    let customType

    beforeEach(() => {
      customType = VueTypes.oneOf([0, 1, 'string'])
    })

    it('should match an object with a validator method', () => {
      const match = {
        validator: Function,
      }

      expect(customType).toMatch(match)
    })

    it('should have a valid array `type` property', () => {
      expect(customType.type).toBeA(Array)
      expect(customType.type[0]).toBe(Number)
    })

    it('should add a `required` flag', () => {
      checkRequired(customType)
    })

    it('should provide a method to set a custom default', () => {
      expect(customType.def(1).default).toBe(1)
    })

    it('should NOT allow default values other than the provided ones', () => {
      expect(customType.def('not this')).toExcludeKey('default')
    })

    it('should provide a custom validator function', () => {
      const validator = forceNoContext(customType.validator)
      expect(validator(0)).toBe(true)
      expect(validator(5)).toBe(false)
    })

    it('should filter `null` values type checking', () => {
      const myType = VueTypes.oneOf([null, undefined, 'string', 2])
      expect(myType.type).toEqual([String, Number])

      const myType2 = VueTypes.oneOf([null])
      expect(myType2.type).toBe(null)
    })
  })

  describe('`.instanceOf`', () => {
    let customType

    class MyClass {
      constructor(public name: string) {}
    }

    beforeEach(() => {
      customType = VueTypes.instanceOf(MyClass)
    })

    it('should match an object with a validator method', () => {
      const match = {
        type: MyClass,
      }

      expect(customType).toMatch(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(customType)
    })

    it('should provide a method to set a custom default', () => {
      const obj = new MyClass('john')
      expect(customType.def(obj).default).toBe(obj)
    })

    it('should NOT allow default values other than the provided ones', () => {
      expect(customType.def(new Date())).toExcludeKey('default')
    })
  })

  describe('`.arrayOf`', () => {
    it('should have a type `Array`', () => {
      const customType = VueTypes.arrayOf(Number)
      expect(customType.type).toBe(Array)
    })

    it('should add a `required` flag', () => {
      const customType = VueTypes.arrayOf(Number)
      checkRequired(customType)
    })

    it('should provide a method to set a custom default. `default` value must be a function', () => {
      const customType = VueTypes.arrayOf(Number)
      const def = customType.def([0, 1]).default
      expect(def).toMatch(Function)
      expect(def()).toEqual([0, 1])
    })

    it('should NOT accept default values out of the allowed one', () => {
      const customType = VueTypes.arrayOf(Number)
      expect(customType.def(['test' as any, 1])).toExcludeKey('default')
    })

    it('should validate an array of same-type values', () => {
      const customType = VueTypes.arrayOf(Number)
      expect(forceNoContext(customType.validator)([0, 1, 2])).toBe(true)
    })

    it('should NOT validate an array of mixed-type values', () => {
      const customType = VueTypes.arrayOf(Number)
      expect(forceNoContext(customType.validator)([0, 1, 'string'])).toBe(false)
    })

    it('should allow validation of VuePropTypes native types', () => {
      const customType = VueTypes.arrayOf(VueTypes.number)
      expect(forceNoContext(customType.validator)([0, 1, 2])).toBe(true)
    })

    it('should allow validation of VuePropTypes custom types', () => {
      const customType = VueTypes.arrayOf(VueTypes.integer)
      const validator = forceNoContext(customType.validator)
      expect(validator([0, 1, 2])).toBe(true)
      expect(validator([0, 1.2, 2])).toBe(false)
    })
  })

  describe('`.objectOf`', () => {
    it('should have a type `Object`', () => {
      const customType = VueTypes.objectOf(Number)
      expect(customType.type).toBe(Object)
    })

    it('should add a `required` flag', () => {
      const customType = VueTypes.objectOf(Number)
      checkRequired(customType)
    })

    it('should provide a method to set a custom default. `default` value must be a function', () => {
      const customType = VueTypes.objectOf(Number)
      const def = customType.def({ id: 10, age: 30 }).default
      expect(def).toMatch(Function)
      expect(def()).toEqual({ id: 10, age: 30 })
    })

    it('should NOT accept default values out of the allowed one', () => {
      const customType = VueTypes.objectOf(Number)
      expect(customType.def({ id: '10', age: 30 } as any)).toExcludeKey(
        'default',
      )
    })

    it('should validate an object of same-type values', () => {
      const customType = VueTypes.objectOf(Number)
      expect(forceNoContext(customType.validator)({ id: 10, age: 30 })).toBe(
        true,
      )
    })

    it('should NOT validate an array of mixed-type values', () => {
      const customType = VueTypes.objectOf(Number)
      expect(forceNoContext(customType.validator)({ id: '10', age: 30 })).toBe(
        false,
      )
    })

    it('should allow validation of VuePropTypes native types', () => {
      const customType = VueTypes.objectOf(VueTypes.number)
      expect(forceNoContext(customType.validator)({ id: 10, age: 30 })).toBe(
        true,
      )
    })

    it('should allow validation of VuePropTypes custom types', () => {
      const customType = VueTypes.objectOf(VueTypes.integer)
      const validator = forceNoContext(customType.validator)
      expect(validator({ id: 10, age: 30 })).toBe(true)
      expect(validator({ id: 10.2, age: 30 })).toBe(false)
    })
  })

  describe('`.shape`', () => {
    let shape

    beforeEach(() => {
      shape = {
        id: Number,
        name: String,
        age: VueTypes.integer,
      }
    })

    it('should add a `required` flag', () => {
      const customType = VueTypes.shape(shape)
      checkRequired(customType)
    })

    it('should validate an object with a given shape', () => {
      const customType = VueTypes.shape(shape)
      expect(
        forceNoContext(customType.validator)({
          id: 10,
          name: 'John',
          age: 30,
        }),
      ).toBe(true)
    })

    it('should NOT validate an object without a given shape', () => {
      const customType = VueTypes.shape(shape)
      expect(
        forceNoContext(customType.validator)({
          id: '10',
          name: 'John',
          age: 30,
        }),
      ).toBe(false)
    })

    it('should NOT validate an object with keys NOT present in the shape', () => {
      const customType = VueTypes.shape(shape)
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
      const customType = VueTypes.shape(shape).loose
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
      const customType = VueTypes.shape(shape).loose.isRequired
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
      const customType = VueTypes.shape(shape).isRequired.loose
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
      const customType = VueTypes.shape(shape)
      const validator = forceNoContext(customType.validator)
      expect(validator('a string')).toBe(false)

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
      const customType = VueTypes.shape(shape)
      const defVals = {
        id: 10,
        name: 'John',
        age: 30,
      }
      const def = customType.def(defVals).default
      expect(def).toMatch(Function)
      expect(def()).toEqual(defVals)
    })

    it('should NOT accept default values with an incorrect shape', () => {
      const customType = VueTypes.shape(shape)
      const def = {
        id: '10',
        name: 'John',
        age: 30,
      }
      expect(customType.def(def)).toExcludeKey('default')
    })

    it('should allow required keys in shape (simple)', () => {
      const customType = VueTypes.shape({
        id: VueTypes.integer.isRequired,
        name: String,
      })
      const validator = forceNoContext(customType.validator)

      expect(
        validator({
          name: 'John',
        }),
      ).toBe(false)

      expect(
        validator({
          id: 10,
        }),
      ).toBe(true)
    })

    it('should allow required keys in shape (with a null type required)', () => {
      const customType = VueTypes.shape({
        myKey: VueTypes.any.isRequired,
        name: null,
      })
      const validator = forceNoContext(customType.validator)

      expect(
        validator({
          name: 'John',
        }),
      ).toBe(false)

      expect(
        validator({
          myKey: null,
        }),
      ).toBe(true)
    })

    it('Should accept properties explicitly set to undefined', () => {
      const customType = VueTypes.shape({
        message: VueTypes.string,
      })
      const validator = forceNoContext(customType.validator)

      expect(
        validator({
          message: undefined,
        }),
      ).toBe(true)
    })
  })

  describe('`.oneOfType`', () => {
    let spy: any

    class MyClass {
      constructor(public name: string) {}
    }

    const nativeTypes = [Number, Array, MyClass]
    const mixedTypes = [Number, VueTypes.array, VueTypes.integer]
    const complexTypes = [
      VueTypes.oneOf([0, 1, 'string']),
      VueTypes.shape({ id: Number }),
    ]

    beforeEach(() => {
      spy = expect.spyOn(VueTypes, 'custom').andCallThrough()
    })

    afterEach(() => {
      spy.restore()
    })

    it('should add a `required` flag', () => {
      const customType = VueTypes.oneOfType(nativeTypes)
      checkRequired(customType)
    })

    it('should provide a method to set a custom default', () => {
      const customType = VueTypes.oneOfType(nativeTypes)
      expect(customType.def(1).default).toBe(1)
    })

    it('should NOT accept default values out of the allowed ones', () => {
      const customType = VueTypes.oneOfType(nativeTypes)
      expect(customType.def('test' as any)).toExcludeKey('default')
    })

    it('should return a prop object with `type` as an array', () => {
      const customType = VueTypes.oneOfType(nativeTypes)
      expect(customType.type).toMatch(Array)
    })

    it('should NOT use the `custom` type creator', () => {
      expect(spy.calls.length).toBe(0)
    })

    it('should use the custom type creator for mixed (native, VuePropTypes) options', () => {
      const customType = VueTypes.oneOfType(mixedTypes)

      expect(spy).toHaveBeenCalled()
      expect(customType).toExcludeKey('type')
    })

    it('should validate custom types with complex shapes', () => {
      const customType = VueTypes.oneOfType(complexTypes)
      const validator = forceNoContext(customType.validator)

      expect(validator(1)).toBe(true)

      // validates types not values!
      expect(validator(5)).toBe(true)

      expect(validator({ id: 10 })).toBe(true)
      expect(validator({ id: '10' })).toBe(false)
    })

    it('should validate multiple shapes', () => {
      const customType = VueTypes.oneOfType([
        VueTypes.shape({
          id: Number,
          name: VueTypes.string.isRequired,
        }),
        VueTypes.shape({
          id: Number,
          age: VueTypes.integer.isRequired,
        }),
        VueTypes.shape({}),
      ])

      const validator = forceNoContext(customType.validator)
      expect(validator({ id: 1, name: 'John' })).toBe(true)
      expect(validator({ id: 2, age: 30 })).toBe(true)
      expect(validator({})).toBe(true)

      expect(validator({ id: 2 })).toBe(false)
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
        expect(VueTypes[prop]).toExcludeKey('default')
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
        expect(VueTypes[prop]).toIncludeKey('default')
      })
    })

    it('should allow custom defaults for types', () => {
      VueTypes.sensibleDefaults = {
        func: noop,
        string: 'test',
      }

      const types = ['bool', 'number', 'array', 'object', 'integer']

      types.forEach((prop) => {
        expect(VueTypes[prop]).toExcludeKey('default')
      })

      expect(VueTypes.func.default).toBe(noop)
      expect(VueTypes.string.default).toBe('test')
    })
  })

  describe('`.extend` helper', () => {
    it('should add getter prop to the library', () => {
      const validator = expect.createSpy()
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

      expect(dateType).toNotBe(undefined)
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
      expect((VueTypes as VueTypesDateFn).dateFn).toBeA(Function)
      expect((VueTypes as VueTypesDateFn).dateFn().isRequired).toEqual({
        type: Date,
        required: true,
      })
    })

    it('should pass configuration params to the validator method', () => {
      const validator = expect.createSpy()
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
      expect((VueTypes as VueTypesString).stringCustom.validate).toBeA(Function)
    })

    it('should clone the base type definition at each call', () => {
      interface VueTypesClone extends VueTypesType {
        cloneDemo: VueTypeValidableDef<object>
      }
      VueTypes.extend<VueTypesClone>({
        name: 'cloneDemo',
        type: Object,
        getter: true,
        validate: true,
      })
      expect((VueTypes as VueTypesClone).cloneDemo).toNotBe(
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
      expect((VueTypes as VueTypesAlias).stringAlias).toMatch({
        type: String,
        required: true,
        default: 'parent',
      })

      expect((VueTypes as VueTypesAlias).stringAlias.validate).toBeA(Function)
    })

    it('should inherit from vue-types type and add custom validation', () => {
      const parent = VueTypes.string
      const validator = expect.createSpy().andReturn(true)

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
      expect(validator.calls[0].context).toBe(type)
    })

    it('should inherit from vue-types (complex types)', () => {
      const parent = VueTypes.shape({
        name: VueTypes.string.isRequired,
        number: VueTypes.oneOf([1, 2, 3]),
      }).isRequired.loose

      const spy = expect.spyOn(parent, 'validator').andCallThrough()

      VueTypes.extend({
        name: 'shapeAlias',
        type: parent,
        getter: true,
      })

      const type = (VueTypes as any).shapeAlias

      expect(type).toInclude({
        type: Object,
        required: true,
      })

      expect(type.validator).toBeA(Function)
      expect(type.validate).toBeA(Function)

      const pass = {
        name: 'John',
        number: 1,
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
      expect(spy.calls[0].context).toBe(parent)

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
      const validator = expect.createSpy()

      VueTypes.extend({
        name: 'aliasMinLength',
        type: parent,
        validator,
      })

      const type = (VueTypes as any).aliasMinLength(3)

      expect(type.type).toBe(String)
      type.validator('a')
      expect(validator).toHaveBeenCalledWith(3, 'a')
      expect(validator.calls[0].context).toBe(type)
    })
  })
})

describe('VueTypes.utils', () => {
  const _utils = VueTypes.utils

  it('should be defined', () => {
    expect(VueTypes.utils).toBeA(Object)
  })

  describe('.toType', () => {
    it('should be a function', () => {
      expect(_utils.toType).toBeA(Function)
    })

    it('proxes to `toType` internal utility function', () => {
      expect(_utils.toType).toBe(toType)
    })
  })

  describe('.validate', () => {
    it('should be a function', () => {
      expect(_utils.validate).toBeA(Function)
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
