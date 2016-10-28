import expect, { spyOn } from 'expect'

import { noop } from '../src/utils'
import vueTypes from '../src/index'

const checkRequired = (type) => {

  expect(type).toIncludeKey('isRequired')

  expect(type.isRequired).toMatch({
    required: true
  })
}

describe('VuePropTypes', () => {

  describe('`.any`', () => {

    it('should have a `null` type', () => {
      expect(vueTypes.any.type).toBe(null)
    })

    it('should add a `required` flag', () => {
      checkRequired(vueTypes.any)
    })

    it('should provide a method to set a custom default', () => {
      expect(vueTypes.any.def('test').default).toBe('test')
    })
  })

  describe('`.func`', () => {

    it('should match an object with methods, type and default function', () => {
      const match = {
        type: Function,
        default: noop
      }

      expect(vueTypes.func).toMatch(match)
    })

    it('should add a `required` flag', () => {

      checkRequired(vueTypes.func)

    })

    it('should provide a method to set a custom default', () => {
      function myFn () {}

      expect(vueTypes.func.def(myFn).default).toBe(myFn)
    })

  })

  describe('`.bool`', () => {

    it('should match an object with methods, type and default', () => {
      const match = {
        type: Boolean,
        default: true
      }

      expect(vueTypes.bool).toMatch(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(vueTypes.bool)
    })

    it('should provide a method to set a custom default', () => {
      expect(vueTypes.bool.def(false).default).toBe(false)
    })

  })

  describe('`.string`', () => {

    it('should match an object with methods, type and default', () => {
      const match = {
        type: String,
        default: ''
      }

      expect(vueTypes.string).toMatch(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(vueTypes.string)
    })

    it('should provide a method to set a custom default', () => {
      expect(vueTypes.string.def('test').default).toBe('test')
    })

  })

  describe('`.number`', () => {

    it('should match an object with methods, type and default', () => {
      const match = {
        type: Number,
        default: 0
      }

      expect(vueTypes.number).toMatch(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(vueTypes.number)
    })

    it('should provide a method to set a custom default', () => {
      expect(vueTypes.number.def(100).default).toBe(100)
    })

  })

  describe('`.array`', () => {

    it('should match an object with methods, type and default', () => {
      const match = {
        type: Array,
        default: Array
      }

      expect(vueTypes.array).toMatch(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(vueTypes.array)
    })

    it('should provide a method to set a custom default. `default` value must be a function', () => {
      const arr = [0, 1]
      const def = vueTypes.array.def(arr).default
      expect(def).toMatch(Function)
      expect(def()).toEqual(arr)
    })

  })

  describe('`.object`', () => {

    it('should match an object with methods, type and default', () => {
      const match = {
        type: Object,
        default: Object
      }

      expect(vueTypes.object).toMatch(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(vueTypes.object)
    })

    it('should provide a method to set a custom default. `default` value must be a function', () => {
      const obj = { test: 'test' }
      const def = vueTypes.object.def(obj).default
      expect(def).toMatch(Function)
      expect(def()).toEqual(obj)
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
        validator: Function
      }

      expect(vueTypes.integer).toMatch(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(vueTypes.integer)
    })

    it('should provide a method to set a custom default', () => {
      expect(vueTypes.integer.def(100).default).toBe(100)
    })

    it('should provide a validator function that returns true on integer values', () => {
      expect(vueTypes.integer.validator(100)).toBe(true)
      expect(vueTypes.integer.validator(Infinity)).toBe(false)
      expect(vueTypes.integer.validator(0.1)).toBe(false)
    })

  })

  describe('`.custom`', () => {

    let customType

    beforeEach(() => {
      customType = vueTypes.custom((val) => typeof val === 'string')
    })

    it('should match an object with a validator method', () => {
      const match = {
        validator: Function
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
      expect(customType.validator('mytest')).toBe(true)
      expect(customType.validator(0)).toBe(false)
    })

  })

  describe('`.oneOf`', () => {

    let customType

    beforeEach(() => {
      customType = vueTypes.oneOf([0, 1, 2])
    })

    it('should match an object with a validator method', () => {
      const match = {
        validator: Function
      }

      expect(customType).toMatch(match)
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
      expect(customType.validator(0)).toBe(true)
      expect(customType.validator(5)).toBe(false)
    })

  })

  describe('`.instanceOf`', () => {

    let customType

    class MyClass {
      constructor(name) {
        this.name = name
      }
    }

    beforeEach(() => {
      customType = vueTypes.instanceOf(MyClass)
    })

    it('should match an object with a validator method', () => {
      const match = {
        type: MyClass
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
      const customType = vueTypes.arrayOf(Number)
      expect(customType.type).toBe(Array)
    })

    it('should add a `required` flag', () => {
      const customType = vueTypes.arrayOf(Number)
      checkRequired(customType)
    })

    it('should provide a method to set a custom default. `default` value must be a function', () => {
      const customType = vueTypes.arrayOf(Number)
      const def = customType.def([0, 1]).default
      expect(def).toMatch(Function)
      expect(def()).toEqual([0, 1])
    })

    it('should NOT accept default values out of the allowed one', () => {
      const customType = vueTypes.arrayOf(Number)
      expect(customType.def(['test', 1])).toExcludeKey('default')
    })

    it('should validate an array of same-type values', () => {
      const customType = vueTypes.arrayOf(Number)
      expect(customType.validator([0, 1, 2])).toBe(true)

    })

    it('should NOT validate an array of mixed-type values', () => {
      const customType = vueTypes.arrayOf(Number)
      expect(customType.validator([0, 1, 'string'])).toBe(false)
    })

    it('should allow validation of VuePropTypes native types', () => {
      const customType = vueTypes.arrayOf(vueTypes.number)
      expect(customType.validator([0, 1, 2])).toBe(true)
    })

    it('should allow validation of VuePropTypes custom types', () => {
      const customType = vueTypes.arrayOf(vueTypes.integer)
      expect(customType.validator([0, 1, 2])).toBe(true)
      expect(customType.validator([0, 1.2, 2])).toBe(false)
    })

  })

  describe('`.objectOf`', () => {

    it('should have a type `Object`', () => {
      const customType = vueTypes.objectOf(Number)
      expect(customType.type).toBe(Object)
    })

    it('should add a `required` flag', () => {
      const customType = vueTypes.objectOf(Number)
      checkRequired(customType)
    })

    it('should provide a method to set a custom default. `default` value must be a function', () => {
      const customType = vueTypes.objectOf(Number)
      const def = customType.def({ id: 10, age: 30 }).default
      expect(def).toMatch(Function)
      expect(def()).toEqual({ id: 10, age: 30 })
    })

    it('should NOT accept default values out of the allowed one', () => {
      const customType = vueTypes.objectOf(Number)
      expect(customType.def({ id: '10', age: 30 })).toExcludeKey('default')
    })

    it('should validate an object of same-type values', () => {
      const customType = vueTypes.objectOf(Number)
      expect(customType.validator({ id: 10, age: 30 })).toBe(true)

    })

    it('should NOT validate an array of mixed-type values', () => {
      const customType = vueTypes.objectOf(Number)
      expect(customType.validator({ id: '10', age: 30 })).toBe(false)
    })

    it('should allow validation of VuePropTypes native types', () => {
      const customType = vueTypes.objectOf(vueTypes.number)
      expect(customType.validator({ id: 10, age: 30 })).toBe(true)
    })

    it('should allow validation of VuePropTypes custom types', () => {
      const customType = vueTypes.objectOf(vueTypes.integer)
      expect(customType.validator({ id: 10, age: 30 })).toBe(true)
      expect(customType.validator({ id: 10.2, age: 30 })).toBe(false)
    })

  })

  describe('`.shape`', () => {

    let shape

    beforeEach(() => {
      shape = {
        id: Number,
        name: String,
        age: vueTypes.integer,

      }
    })

    it('should add a `required` flag', () => {
      const customType = vueTypes.shape(shape)
      checkRequired(customType)
    })

    it('should validate an object with a given shape', () => {

      const customType = vueTypes.shape(shape)
      expect(customType.validator({
        id: 10,
        name: 'John',
        age: 30
      })).toBe(true)
    })

    it('should NOT validate an object without a given shape', () => {

      const customType = vueTypes.shape(shape)
      expect(customType.validator({
        id: '10',
        name: 'John',
        age: 30
      })).toBe(false)
    })

    it('should NOT validate a value which is NOT an object', () => {
      const customType = vueTypes.shape(shape)
      expect(customType.validator('a string')).toBe(false)

      class MyClass {
        constructor() {
          this.id = '10'
          this.name = 'John'
          this.age = 30
        }
      }

      expect(customType.validator(new MyClass())).toBe(false)
    })

    it('should provide a method to set a custom default', () => {
      const customType = vueTypes.shape(shape)
      const defVals = {
        id: 10,
        name: 'John',
        age: 30
      }
      const def = customType.def(defVals).default
      expect(def).toMatch(Function)
      expect(def()).toEqual(defVals)
    })

    it('should NOT accept default values with an incorrect shape', () => {
      const customType = vueTypes.shape(shape)
      const def = {
        id: '10',
        name: 'John',
        age: 30
      }
      expect(customType.def(def)).toExcludeKey('default')
    })

  })

  describe('`.oneOfType`', () => {

    let spy

    class MyClass {
      constructor(name) {
        this.name = name
      }
    }

    const nativeTypes = [Number, Array, MyClass]
    const mixedTypes = [Number, vueTypes.array, vueTypes.integer]
    const complexTypes = [
      vueTypes.oneOf([0, 1]),
      vueTypes.shape({ id: Number })
    ]

    beforeEach(() => {
      spy = spyOn(vueTypes, 'custom').andCallThrough()
    })

    afterEach(() => {
      spy.restore()
    })

    it('should add a `required` flag', () => {
      const customType = vueTypes.oneOfType(nativeTypes)
      checkRequired(customType)
    })

    it('should provide a method to set a custom default', () => {
      const customType = vueTypes.oneOfType(nativeTypes)
      expect(customType.def(1).default).toBe(1)
    })

    it('should NOT accept default values out of the allowed ones', () => {
      const customType = vueTypes.oneOfType(nativeTypes)
      expect(customType.def('test')).toExcludeKey('default')
    })

    it('should return a prop object with `type` as an array', () => {
      const customType = vueTypes.oneOfType(nativeTypes)
      expect(customType.type).toMatch(Array)
    })

    it('should NOT use the `custom` type creator', () => {
      expect(spy.calls.length).toBe(0)
    })

    it('should use the custom type creator for mixed (native, VuePropTypes) options', () => {
      const customType = vueTypes.oneOfType(mixedTypes)

      expect(spy).toHaveBeenCalled()
      expect(customType).toExcludeKey('type')
    })

    it('should validate custom types with complex shapes', () => {
      const customType = vueTypes.oneOfType(complexTypes)

      expect(customType.validator(1)).toBe(true)
      expect(customType.validator(5)).toBe(false)

      expect(customType.validator({ id: 10 })).toBe(true)
      expect(customType.validator({ id: '10' })).toBe(false)

    })

  })

})
