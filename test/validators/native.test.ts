import * as native from '../../src/validators/native'
import { forceNoContext, checkRequired } from '../helpers'

describe('Native validators', () => {
  describe('`.any`', () => {
    it('should NOT have a type', () => {
      expect(native.any().type).toBe(undefined)
    })

    it('should add a `required` flag', () => {
      checkRequired(native.any())
    })

    it('should provide a method to set a custom default', () => {
      expect(native.any().def('test').default).toBe('test')
    })
  })

  describe('`.func`', () => {
    it('should match an object with methods, type and default function', () => {
      expect(native.func().type).toBe(Function)
    })

    it('should add a `required` flag', () => {
      checkRequired(native.func())
    })

    it('should provide a method to set a custom default', () => {
      function myFn() {}

      expect(native.func().def(myFn).default).toBe(myFn)
    })
  })

  describe('`.bool`', () => {
    it('should match an object with methods, type and default', () => {
      const match = jasmine.objectContaining({
        type: Boolean,
      })

      expect(native.bool()).toEqual(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(native.bool())
    })

    it('should provide a method to set a custom default', () => {
      expect(native.bool().def(false).default).toBe(false)
    })
  })

  describe('`.string`', () => {
    it('should match an object with methods, type and default', () => {
      const match = jasmine.objectContaining({
        type: String,
      })

      expect(native.string()).toEqual(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(native.string())
    })

    it('should provide a method to set a custom default', () => {
      expect(native.string().def('test').default).toBe('test')
    })
  })

  describe('`.number`', () => {
    it('should match an object with methods, type and default', () => {
      const match = jasmine.objectContaining({
        type: Number,
      })

      expect(native.number()).toEqual(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(native.number())
    })

    it('should provide a method to set a custom default', () => {
      expect(native.number().def(100).default).toBe(100)
    })
  })

  describe('`.array`', () => {
    it('should match an object with methods, type and default', () => {
      const match = jasmine.objectContaining({
        type: Array,
      })

      expect(native.array()).toEqual(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(native.array())
    })

    it('should provide a method to set a custom default. `default` value must be a function', () => {
      const arr = [0, 1]
      const def = native.array().def(arr).default
      expect(def).toEqual(jasmine.any(Function))
      expect(def()).toEqual(arr)
    })

    it('should provide a method to set a custom default. If default value is a function it will be used as factory function', () => {
      const arrFactory = () => [0, 1]
      const def = native.array().def(arrFactory).default
      expect(def).toBe(arrFactory)
    })
  })

  describe('`.object`', () => {
    it('should match an object with methods, type and default', () => {
      const match = jasmine.objectContaining({
        type: Object,
      })

      expect(native.object()).toEqual(match)
    })

    it('should add a `required` flag', () => {
      checkRequired(native.object())
    })

    it('should provide a method to set a custom default. `default` value must be a function', () => {
      const obj = { test: 'test' }
      const def = native.object().def(obj).default
      expect(def).toEqual(jasmine.any(Function))
      expect(def()).toEqual(obj)
    })

    it('should provide a method to set a custom default. If default value is a function it will be used as factory function', () => {
      const objFactory = () => ({ test: 'test' })
      const def = native.object().def(objFactory).default
      expect(def).toBe(objFactory)
    })
  })

  /**
   * Custom Types
   */

  describe('`.integer`', () => {
    it('should match an object with methods, type and default', () => {
      expect(native.integer()).toEqual(
        jasmine.objectContaining({
          type: Number,
          validator: jasmine.any(Function),
        }),
      )
    })

    it('should add a `required` flag', () => {
      checkRequired(native.integer())
    })

    it('should provide a method to set a custom default', () => {
      expect(native.integer().def(100).default).toBe(100)
    })

    it('should NOT allow float custom default', () => {
      expect(native.integer().def(0.1).default).not.toBe(0.1)
    })

    it('should provide a validator function that returns true on integer values', () => {
      const validator = forceNoContext(native.integer().validator)
      expect(validator(100)).toBe(true)
      expect(validator(Infinity)).toBe(false)
      expect(validator(0.1)).toBe(false)
    })
  })

  describe('symbol', () => {
    it('should match an object with type and validator, but not default', () => {
      expect(native.symbol()).toEqual(
        jasmine.objectContaining({
          validator: jasmine.any(Function),
        }),
      )
      expect(native.symbol().default).toBe(undefined)
    })

    it('should validate symbols', function () {
      if ('Symbol' in window && typeof Symbol() === 'symbol') {
        expect(native.symbol().validator(Symbol())).toBe(true)
      } else {
        this.skip()
      }
    })
  })
})
