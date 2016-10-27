import expect, { spyOn } from 'expect'

import { noop } from '../src/utils'
import vueProps from '../src/index'

const checkRequired = (type) => {

  expect(type).toIncludeKey('isRequired')

  expect(type.isRequired).toMatch({
    required: true
  })
}

describe('VuePropTypes', () => {

  describe('`.any`', () => {

    it('should have a `null` type', () => {
      expect(vueProps.any.type).toBe(null)
    })

    it('should add a `required` flag', () => {
      checkRequired(vueProps.any)
    })

    it('should provide a method to set a custom default', () => {
      expect(vueProps.any.def('test').default).toBe('test')
    })
  })

  describe('`.func`', () => {

    it('should match an object with methods, type and default function', () => {
      const match = {
        type: Function,
        default: noop
      }

      expect(vueProps.func).toMatch(match)
    })

    it('should add a `required` flag', () => {

      checkRequired(vueProps.func)

    })

    it('should provide a method to set a custom default', () => {
      function myFn () {}

      expect(vueProps.func.def(myFn).default).toBe(myFn)
    })

  })

  describe('`.bool`', () => {

    it('should match an object with methods, type and default', () => {
      const match = {
        type: Boolean,
        default: true
      }

      expect(vueProps.bool).toMatch(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(vueProps.bool)
    })

    it('should provide a method to set a custom default', () => {
      expect(vueProps.bool.def(false).default).toBe(false)
    })

  })

  describe('`.string`', () => {

    it('should match an object with methods, type and default', () => {
      const match = {
        type: String,
        default: ''
      }

      expect(vueProps.string).toMatch(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(vueProps.string)
    })

    it('should provide a method to set a custom default', () => {
      expect(vueProps.string.def('test').default).toBe('test')
    })

  })

  describe('`.number`', () => {

    it('should match an object with methods, type and default', () => {
      const match = {
        type: Number,
        default: 0
      }

      expect(vueProps.number).toMatch(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(vueProps.number)
    })

    it('should provide a method to set a custom default', () => {
      expect(vueProps.number.def(100).default).toBe(100)
    })

  })

  describe('`.array`', () => {

    it('should match an object with methods, type and default', () => {
      const match = {
        type: Array,
        default: Array
      }

      expect(vueProps.array).toMatch(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(vueProps.array)
    })

    it('should provide a method to set a custom default', () => {
      const arr = [0, 1]
      expect(vueProps.array.def(arr).default).toEqual(arr)
    })

  })

  describe('`.object`', () => {

    it('should match an object with methods, type and default', () => {
      const match = {
        type: Object,
        default: Object
      }

      expect(vueProps.object).toMatch(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(vueProps.object)
    })

    it('should provide a method to set a custom default', () => {
      const obj = { test: 'test' }
      expect(vueProps.object.def(obj).default).toEqual(obj)
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

      expect(vueProps.integer).toMatch(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(vueProps.integer)
    })

    it('should provide a method to set a custom default', () => {
      expect(vueProps.integer.def(100).default).toBe(100)
    })

    it('should provide a validator function that returns true on integer values', () => {
      expect(vueProps.integer.validator(100)).toBe(true)
      expect(vueProps.integer.validator(Infinity)).toBe(false)
      expect(vueProps.integer.validator(0.1)).toBe(false)
    })

  })

  describe('`.custom`', () => {

    let customType

    beforeEach(() => {
      customType = vueProps.custom((val) => typeof val === 'string')
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
      customType = vueProps.oneOf([0, 1, 2])
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

    it('shouldn\'t allow default values other than the provided ones', () => {
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
      customType = vueProps.instanceOf(MyClass)
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

    it('shouldn\'t allow default values other than the provided ones', () => {
      expect(customType.def(new Date())).toExcludeKey('default')
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
    const mixedTypes = [Number, vueProps.array, vueProps.integer]

    beforeEach(() => {
      spy = spyOn(vueProps, 'custom').andCallThrough()
    })

    afterEach(() => {
      spy.restore()
    })

    it('should return a prop object with `type` as an array', () => {
      const custom = vueProps.oneOfType(nativeTypes)
      expect(custom.type).toMatch(Array)
    })

    it('should not use the `custom` type creator', () => {
      expect(spy.calls.length).toBe(0)
    })

    it('should use the custom type creator for mixed (native, VuePropTypes) options', () => {
      const custom = vueProps.oneOfType(mixedTypes)

      expect(spy).toHaveBeenCalled()
      expect(custom).toExcludeKey('type')
    })

  })

})
