process.env.NODE_ENV = 'production'

import expect from 'expect'
import Vue from 'vue'

import { noop } from '../src/utils'
import VueTypes from '../src/shim'

Vue.config.productionTip = false
Vue.config.silent = true

describe('SHIM: VueTypes', () => {
  describe('SHIM: `.any`', () => {
    it('should exist', () => {
      expect(VueTypes.any).toNotBe(undefined)
    })

    it('should have a `type` property', () => {
      const type = VueTypes.any
      expect(type.type).toBe(null)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.any
      expect(type.isRequired).toBe(type)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.any
      expect(type.def(true)).toBe(type)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.any
      const defValue = 'demo'
      expect(type.def(defValue).default).toBe(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.any.validator).toBeA(Function)
    })

    it('should have a `validate` method', () => {
      expect(VueTypes.any.validate).toBeA(Function)
    })
  })

  describe('SHIM: `.func`', () => {
    it('should exist', () => {
      expect(VueTypes.func).toNotBe(undefined)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.func.type).toBe(Function)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.func
      expect(type.isRequired).toBe(type)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.func
      expect(type.def()).toBe(type)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.func
      const defValue = () => undefined
      expect(type.def(defValue).default).toBe(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.func.validator).toBeA(Function)
    })

    it('should have a `validate` method', () => {
      expect(VueTypes.func.validate).toBeA(Function)
    })
  })

  describe('SHIM: `.bool`', () => {
    it('should exist', () => {
      expect(VueTypes.bool).toNotBe(undefined)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.bool.type).toBe(Boolean)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.bool
      expect(type.isRequired).toBe(type)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.bool
      expect(type.def(true)).toBe(type)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.bool
      const defValue = true
      expect(type.def(defValue).default).toBe(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.bool.validator).toBeA(Function)
    })

    it('should have a `validate` method', () => {
      expect(VueTypes.bool.validate).toBeA(Function)
    })
  })

  describe('SHIM: `.string`', () => {
    it('should exist', () => {
      expect(VueTypes.string).toNotBe(undefined)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.string.type).toBe(String)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.string
      expect(type.isRequired).toBe(type)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.string
      expect(type.def(true)).toBe(type)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.string
      const defValue = 'demo'
      expect(type.def(defValue).default).toBe(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.string.validator).toBeA(Function)
    })

    it('should have a `validate` method', () => {
      expect(VueTypes.string.validate).toBeA(Function)
    })
  })

  describe('SHIM: `.number`', () => {
    it('should exist', () => {
      expect(VueTypes.number).toNotBe(undefined)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.number.type).toBe(Number)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.number
      expect(type.isRequired).toBe(type)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.number
      expect(type.def(true)).toBe(type)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.number
      const defValue = 10
      expect(type.def(defValue).default).toBe(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.number.validator).toBeA(Function)
    })

    it('should have a `validate` method', () => {
      expect(VueTypes.number.validate).toBeA(Function)
    })
  })

  describe('SHIM: `.array`', () => {
    it('should exist', () => {
      expect(VueTypes.array).toNotBe(undefined)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.array.type).toBe(Array)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.array
      expect(type.isRequired).toBe(type)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.array
      expect(type.def(true)).toBe(type)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.array
      const defValue = ['demo']
      expect(type.def(defValue).default()).toEqual(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.array.validator).toBeA(Function)
    })

    it('should have a `validate` method', () => {
      expect(VueTypes.array.validate).toBeA(Function)
    })
  })

  describe('SHIM: `.object`', () => {
    it('should exist', () => {
      expect(VueTypes.object).toNotBe(undefined)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.object.type).toBe(Object)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.object
      expect(type.isRequired).toBe(type)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.object
      expect(type.def(true)).toBe(type)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.object
      const defValue = { demo: true }
      expect(type.def(defValue).default()).toEqual(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.object.validator).toBeA(Function)
    })

    it('should have a `validate` method', () => {
      expect(VueTypes.object.validate).toBeA(Function)
    })
  })

  /**
   * Custom Types
   */

  describe('SHIM: `.integer`', () => {
    it('should exist', () => {
      expect(VueTypes.integer).toNotBe(undefined)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.integer.type).toBe(Number)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.integer
      expect(type.isRequired).toBe(type)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.integer
      expect(type.def(true)).toBe(type)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.integer
      const defValue = 10
      expect(type.def(defValue).default).toBe(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.integer.validator).toBeA(Function)
    })
  })

  describe('symbol', () => {
    it('should exist', () => {
      expect(VueTypes.symbol).toNotBe(undefined)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.symbol.type).toBe(null)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.symbol
      expect(type.isRequired).toBe(type)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.symbol
      expect(type.def(true)).toBe(type)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.symbol
      const defValue = Symbol('demo')
      expect(type.def(defValue).default).toBe(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.symbol.validator).toBeA(Function)
    })

    it('should have a `validate` method', () => {
      expect(VueTypes.symbol.validate).toBeA(Function)
    })
  })

  describe('SHIM: `.custom`', () => {
    it('should exist', () => {
      expect(VueTypes.custom).toBeA(Function)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.custom().type).toBe(null)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.custom()
      expect(type.isRequired).toBe(type)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.custom()
      expect(type.def(true)).toBe(type)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.custom()
      const defValue = 'x'
      expect(type.def(defValue).default).toBe(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.custom().validator).toBeA(Function)
    })
  })

  describe('SHIM: `.oneOf`', () => {
    it('should exist', () => {
      expect(VueTypes.oneOf).toBeA(Function)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.oneOf().type).toBe(null)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.oneOf()
      expect(type.isRequired).toBe(type)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.oneOf()
      expect(type.def(true)).toBe(type)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.oneOf()
      const defValue = 'x'
      expect(type.def(defValue).default).toBe(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.oneOf().validator).toBeA(Function)
    })
  })

  describe('SHIM: `.instanceOf`', () => {
    it('should exist', () => {
      expect(VueTypes.instanceOf).toBeA(Function)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.instanceOf().type).toBe(null)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.instanceOf()
      expect(type.isRequired).toBe(type)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.instanceOf()
      expect(type.def(true)).toBe(type)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.instanceOf()
      const defValue = 'x'
      expect(type.def(defValue).default).toBe(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.instanceOf().validator).toBeA(Function)
    })
  })

  describe('SHIM: `.arrayOf`', () => {
    it('should exist', () => {
      expect(VueTypes.arrayOf).toBeA(Function)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.arrayOf().type).toBe(Array)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.arrayOf()
      expect(type.isRequired).toBe(type)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.arrayOf()
      expect(type.def(true)).toBe(type)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.arrayOf()
      const defValue = ['x']
      expect(type.def(defValue).default()).toEqual(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.arrayOf().validator).toBeA(Function)
    })
  })

  describe('SHIM: `.objectOf`', () => {
    it('should exist', () => {
      expect(VueTypes.objectOf).toBeA(Function)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.objectOf().type).toBe(Object)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.objectOf()
      expect(type.isRequired).toBe(type)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.objectOf()
      expect(type.def(true)).toBe(type)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.objectOf()
      const defValue = { key: 'x' }
      expect(type.def(defValue).default()).toEqual(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.objectOf().validator).toBeA(Function)
    })
  })

  describe('SHIM: `.shape`', () => {
    it('should exist', () => {
      expect(VueTypes.shape).toBeA(Function)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.shape().type).toBe(Object)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.shape()
      expect(type.isRequired).toBe(type)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.shape()
      expect(type.def(true)).toBe(type)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.shape()
      const defValue = { shape: 'x' }
      expect(type.def(defValue).default()).toEqual(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.shape().validator).toBeA(Function)
    })

    it('should have a `loose` flag that returns the type itself', () => {
      const type = VueTypes.shape()
      expect(type.loose).toBe(type)
    })
  })

  describe('SHIM: `.oneOfType`', () => {
    it('should exist', () => {
      expect(VueTypes.oneOfType).toBeA(Function)
    })

    it('should have a `type` property', () => {
      expect(VueTypes.oneOfType().type).toBe(null)
    })

    it('should have a `isRequired` flag that returns the type itself', () => {
      const type = VueTypes.oneOfType()
      expect(type.isRequired).toBe(type)
    })

    it('should have a `def` method that returns the type itself', () => {
      const type = VueTypes.oneOfType()
      expect(type.def(true)).toBe(type)
    })

    it('should have a `def` method that sets a `default` property', () => {
      const type = VueTypes.oneOfType()
      const defValue = 'x'
      expect(type.def(defValue).default).toBe(defValue)
    })

    it('should have a `validator` method', () => {
      expect(VueTypes.oneOfType().validator).toBeA(Function)
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

      const dateType = VueTypes.date
      expect(dateType).toNotBe(undefined)
    })

    it('should add a method to the library', () => {
      VueTypes.extend({
        name: 'dateFn',
        type: Date,
      })
      expect(VueTypes.dateFn).toBeA(Function)
      expect(VueTypes.dateFn().isRequired.required).toBe(true)
    })

    it('should add a validate method to the prop', () => {
      VueTypes.extend({
        name: 'stringCustom',
        type: Date,
        getter: true,
        validate: true,
      })
      expect(VueTypes.stringCustom.validate).toBeA(Function)
    })
  })
})

describe('SHIM: VueTypes.utils', () => {
  it('should be defined', () => {
    expect(VueTypes.utils).toBeA(Object)
  })

  describe('SHIM: .toType', () => {
    it('should be a function', () => {
      expect(VueTypes.utils.toType).toBeA(Function)
    })

    it('returns an object', () => {
      expect(VueTypes.utils.toType()).toBeA(Object)
    })
  })

  describe('SHIM: .validate', () => {
    it('should be a function', () => {
      expect(VueTypes.utils.validate).toBeA(Function)
    })

    it('returns true', () => {
      expect(VueTypes.utils.validate()).toBe(true)
    })
  })
})
