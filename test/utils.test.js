import expect from 'expect'
import * as utils from '../src/utils'
import {
  stub_validateType,
  reset_validateType,
  stub_isFunction,
  reset_isFunction
} from '../src/utils'

describe('`withDefault()`', () => {
  let obj

  beforeEach(() => {
    obj = Object.create(null)
  })

  it('should set a `def` function as property on the target object', () => {
    utils.withDefault(obj)
    expect(obj.def).toBeA(Function)
  })

  it('`def` should NOT be enumerable', () => {
    utils.withDefault(obj)
    expect(Object.keys(obj)).toExclude('def')
  })

  it('`def` should NOT be writtable', () => {
    utils.withDefault(obj)

    expect(() => {
      obj.def = 'demo'
    }).toThrow()
  })

  describe('passed-in value', () => {
    let validateSpy
    let isFunctionSpy

    beforeEach(() => {
      validateSpy = expect.createSpy().andReturn(true)
      isFunctionSpy = expect.createSpy().andReturn(false)
      stub_validateType(validateSpy)
      stub_isFunction(isFunctionSpy)
    })
    afterEach(() => {
      reset_validateType()
      reset_isFunction()
    })

    it('should check validity of passed-in value', () => {
      const value = 'test'
      utils.withDefault(obj)
      obj.def(value)
      expect(validateSpy).toHaveBeenCalledWith(obj, value)
    })

    it('skips validation if passed-in value is a function', () => {
      isFunctionSpy.andReturn(true)
      const value = 'test'
      utils.withDefault(obj)
      obj.def(value)
      expect(isFunctionSpy).toHaveBeenCalledWith(value)
      expect(validateSpy).toNotHaveBeenCalled()
    })

    it('exists if validation fails', () => {
      validateSpy.andReturn(false)
      utils.withDefault(obj)
      obj.def(true)
      expect(obj).toExcludeKey('default')
    })

    it('sets a `default` key on the object', () => {
      utils.withDefault(obj)

      const stubs = [true, null, 'string', () => {}, 0]

      stubs.forEach((v) => {
        obj.def(v)
        expect(obj.default).toBe(v)
      })
    })

    it('sets a factory function if value is an array', () => {
      const arr = [0, 1]
      utils.withDefault(obj)
      obj.def(arr)
      expect(obj.default).toBeA(Function)
      expect(obj.default()).toNotBe(arr)
      expect(obj.default()).toEqual(arr)
    })

    it('sets a factory function if value is an object', () => {
      const value = { test: 'demo' }
      utils.withDefault(obj)
      obj.def(value)
      expect(obj.default).toBeA(Function)
      expect(obj.default()).toNotBe(value)
      expect(obj.default()).toEqual(value)
    })

  })
})

describe('`toType()`', () => {
  it('should enhance the passed-in object without cloning', () => {
    const obj = {}

    const type = utils.toType('testType', obj)
    expect(type).toBe(obj)
  })

  it('should call `withRequired` on passed in object', () => {
    const obj = {}

    utils.toType('testType', obj)
    expect(obj.hasOwnProperty('isRequired')).toBe(true)
  })

  it('should call `utils.withDefault` on passed in object', () => {
    const obj = {}

    utils.toType('testType', obj)
    expect(obj.def).toBeA(Function)
  })

  it('should bind provided `validator function to the passed in object`', () => {
    const obj = {
      validator () {
        return this
      }
    }

    const type = utils.toType('testType', obj)
    const validator = type.validator

    expect(validator()).toBe(obj)
  })
})
