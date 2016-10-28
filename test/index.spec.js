import expect, { spyOn } from 'expect'

import { noop } from '../src/utils'
import vuePropTypes from '../src/index'

const checkRequired = (type) => {

  expect(type).toIncludeKey('isRequired')

  expect(type.isRequired).toMatch({
    required: true
  })
}

describe('VuePropTypes', () => {

  describe('`.any`', () => {

    it('should have a `null` type', () => {
      expect(vuePropTypes.any.type).toBe(null)
    })

    it('should add a `required` flag', () => {
      checkRequired(vuePropTypes.any)
    })

    it('should provide a method to set a custom default', () => {
      expect(vuePropTypes.any.def('test').default).toBe('test')
    })
  })

  describe('`.func`', () => {

    it('should match an object with methods, type and default function', () => {
      const match = {
        type: Function,
        default: noop
      }

      expect(vuePropTypes.func).toMatch(match)
    })

    it('should add a `required` flag', () => {

      checkRequired(vuePropTypes.func)

    })

    it('should provide a method to set a custom default', () => {
      function myFn () {}

      expect(vuePropTypes.func.def(myFn).default).toBe(myFn)
    })

  })

  describe('`.bool`', () => {

    it('should match an object with methods, type and default', () => {
      const match = {
        type: Boolean,
        default: true
      }

      expect(vuePropTypes.bool).toMatch(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(vuePropTypes.bool)
    })

    it('should provide a method to set a custom default', () => {
      expect(vuePropTypes.bool.def(false).default).toBe(false)
    })

  })

  describe('`.string`', () => {

    it('should match an object with methods, type and default', () => {
      const match = {
        type: String,
        default: ''
      }

      expect(vuePropTypes.string).toMatch(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(vuePropTypes.string)
    })

    it('should provide a method to set a custom default', () => {
      expect(vuePropTypes.string.def('test').default).toBe('test')
    })

  })

  describe('`.number`', () => {

    it('should match an object with methods, type and default', () => {
      const match = {
        type: Number,
        default: 0
      }

      expect(vuePropTypes.number).toMatch(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(vuePropTypes.number)
    })

    it('should provide a method to set a custom default', () => {
      expect(vuePropTypes.number.def(100).default).toBe(100)
    })

  })

  describe('`.array`', () => {

    it('should match an object with methods, type and default', () => {
      const match = {
        type: Array,
        default: Array
      }

      expect(vuePropTypes.array).toMatch(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(vuePropTypes.array)
    })

    it('should provide a method to set a custom default. `default` value must be a function', () => {
      const arr = [0, 1]
      const def = vuePropTypes.array.def(arr).default
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

      expect(vuePropTypes.object).toMatch(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(vuePropTypes.object)
    })

    it('should provide a method to set a custom default. `default` value must be a function', () => {
      const obj = { test: 'test' }
      const def = vuePropTypes.object.def(obj).default
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

      expect(vuePropTypes.integer).toMatch(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(vuePropTypes.integer)
    })

    it('should provide a method to set a custom default', () => {
      expect(vuePropTypes.integer.def(100).default).toBe(100)
    })

    it('should provide a validator function that returns true on integer values', () => {
      expect(vuePropTypes.integer.validator(100)).toBe(true)
      expect(vuePropTypes.integer.validator(Infinity)).toBe(false)
      expect(vuePropTypes.integer.validator(0.1)).toBe(false)
    })

  })

  describe('`.custom`', () => {

    let customType

    beforeEach(() => {
      customType = vuePropTypes.custom((val) => typeof val === 'string')
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
      customType = vuePropTypes.oneOf([0, 1, 2])
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
      customType = vuePropTypes.instanceOf(MyClass)
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
      const customType = vuePropTypes.arrayOf(Number)
      expect(customType.type).toBe(Array)
    })

    it('should add a `required` flag', () => {
      const customType = vuePropTypes.arrayOf(Number)
      checkRequired(customType)
    })

    it('should provide a method to set a custom default. `default` value must be a function', () => {
      const customType = vuePropTypes.arrayOf(Number)
      const def = customType.def([0, 1]).default
      expect(def).toMatch(Function)
      expect(def()).toEqual([0, 1])
    })

    it('should NOT accept default values out of the allowed one', () => {
      const customType = vuePropTypes.arrayOf(Number)
      expect(customType.def(['test', 1])).toExcludeKey('default')
    })

    it('should validate an array of same-type values', () => {
      const customType = vuePropTypes.arrayOf(Number)
      expect(customType.validator([0, 1, 2])).toBe(true)

    })

    it('should NOT validate an array of mixed-type values', () => {
      const customType = vuePropTypes.arrayOf(Number)
      expect(customType.validator([0, 1, 'string'])).toBe(false)
    })

    it('should allow validation of VuePropTypes native types', () => {
      const customType = vuePropTypes.arrayOf(vuePropTypes.number)
      expect(customType.validator([0, 1, 2])).toBe(true)
    })

    it('should allow validation of VuePropTypes custom types', () => {
      const customType = vuePropTypes.arrayOf(vuePropTypes.integer)
      expect(customType.validator([0, 1, 2])).toBe(true)
      expect(customType.validator([0, 1.2, 2])).toBe(false)
    })

  })

  describe('`.objectOf`', () => {

    it('should have a type `Object`', () => {
      const customType = vuePropTypes.objectOf(Number)
      expect(customType.type).toBe(Object)
    })

    it('should add a `required` flag', () => {
      const customType = vuePropTypes.objectOf(Number)
      checkRequired(customType)
    })

    it('should provide a method to set a custom default. `default` value must be a function', () => {
      const customType = vuePropTypes.objectOf(Number)
      const def = customType.def({ id: 10, age: 30 }).default
      expect(def).toMatch(Function)
      expect(def()).toEqual({ id: 10, age: 30 })
    })

    it('should NOT accept default values out of the allowed one', () => {
      const customType = vuePropTypes.objectOf(Number)
      expect(customType.def({ id: '10', age: 30 })).toExcludeKey('default')
    })

    it('should validate an object of same-type values', () => {
      const customType = vuePropTypes.objectOf(Number)
      expect(customType.validator({ id: 10, age: 30 })).toBe(true)

    })

    it('should NOT validate an array of mixed-type values', () => {
      const customType = vuePropTypes.objectOf(Number)
      expect(customType.validator({ id: '10', age: 30 })).toBe(false)
    })

    it('should allow validation of VuePropTypes native types', () => {
      const customType = vuePropTypes.objectOf(vuePropTypes.number)
      expect(customType.validator({ id: 10, age: 30 })).toBe(true)
    })

    it('should allow validation of VuePropTypes custom types', () => {
      const customType = vuePropTypes.objectOf(vuePropTypes.integer)
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
        age: vuePropTypes.integer,

      }
    })

    it('should add a `required` flag', () => {
      const customType = vuePropTypes.shape(shape)
      checkRequired(customType)
    })

    it('should validate an object with a given shape', () => {

      const customType = vuePropTypes.shape(shape)
      expect(customType.validator({
        id: 10,
        name: 'John',
        age: 30
      })).toBe(true)
    })

    it('should NOT validate an object without a given shape', () => {

      const customType = vuePropTypes.shape(shape)
      expect(customType.validator({
        id: '10',
        name: 'John',
        age: 30
      })).toBe(false)
    })

    it('should NOT validate a value which is NOT an object', () => {
      const customType = vuePropTypes.shape(shape)
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
      const customType = vuePropTypes.shape(shape)
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
      const customType = vuePropTypes.shape(shape)
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
    const mixedTypes = [Number, vuePropTypes.array, vuePropTypes.integer]
    const complexTypes = [
      vuePropTypes.oneOf([0, 1]),
      vuePropTypes.shape({ id: Number })
    ]

    beforeEach(() => {
      spy = spyOn(vuePropTypes, 'custom').andCallThrough()
    })

    afterEach(() => {
      spy.restore()
    })

    it('should add a `required` flag', () => {
      const customType = vuePropTypes.oneOfType(nativeTypes)
      checkRequired(customType)
    })

    it('should provide a method to set a custom default', () => {
      const customType = vuePropTypes.oneOfType(nativeTypes)
      expect(customType.def(1).default).toBe(1)
    })

    it('should NOT accept default values out of the allowed ones', () => {
      const customType = vuePropTypes.oneOfType(nativeTypes)
      expect(customType.def('test')).toExcludeKey('default')
    })

    it('should return a prop object with `type` as an array', () => {
      const customType = vuePropTypes.oneOfType(nativeTypes)
      expect(customType.type).toMatch(Array)
    })

    it('should NOT use the `custom` type creator', () => {
      expect(spy.calls.length).toBe(0)
    })

    it('should use the custom type creator for mixed (native, VuePropTypes) options', () => {
      const customType = vuePropTypes.oneOfType(mixedTypes)

      expect(spy).toHaveBeenCalled()
      expect(customType).toExcludeKey('type')
    })

    it('should validate custom types with complex shapes', () => {
      const customType = vuePropTypes.oneOfType(complexTypes)

      expect(customType.validator(1)).toBe(true)
      expect(customType.validator(5)).toBe(false)

      expect(customType.validator({ id: 10 })).toBe(true)
      expect(customType.validator({ id: '10' })).toBe(false)

    })

  })

})
