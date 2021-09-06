import * as utils from '../src/utils'
import { VueTypeDef } from '../src'
import { config } from '../src'

beforeEach(() => {
  config.logLevel = 'warn'
  config.silent = false
})

describe('`getType()`', () => {
  it('return the type constructor as a string', () => {
    expect(utils.getType(String)).toBe('String')
    expect(utils.getType({ type: String })).toBe('String')
    expect(utils.getType(Array)).toBe('Array')
    expect(utils.getType(Object)).toBe('Object')
  })
})

describe('`getNativeType()`', () => {
  it('return the type constructor as a string', () => {
    expect(utils.getNativeType('demo')).toBe('String')
    expect(utils.getNativeType([])).toBe('Array')
    expect(utils.getNativeType({})).toBe('Object')
    expect(utils.getNativeType(() => undefined)).toBe('Function')
    expect(utils.getNativeType(null)).toBe('')
    expect(utils.getNativeType(undefined)).toBe('')
  })
})

describe('`has()`', () => {
  it('return true for own properties', () => {
    expect(utils.has({ a: true }, 'a')).toBe(true)
    expect(utils.has({ a: undefined }, 'a')).toBe(true)
  })
  it('return false non available properties', () => {
    expect(utils.has({ a: true }, 'b' as any)).toBe(false)
  })
  it('return false for inherited properties', () => {
    const obj = Object.create({ a: 1 })
    obj.b = 2
    expect(utils.has(obj, 'a')).toBe(false)
    expect(utils.has(obj, 'b')).toBe(true)
  })
})

describe('`isFunction()`', () => {
  it('checks for functions', () => {
    ;['', [], {}, null, true].forEach((v) => {
      expect(utils.isFunction(v)).toBe(false)
    })
    expect(utils.isFunction(() => undefined)).toBe(true)
  })
})

describe('`isVueTypeDef()`', () => {
  it('returns true when the argument is a valid VueTypes type', () => {
    expect(utils.isVueTypeDef({ type: String })).toBe(false)
    expect(utils.isVueTypeDef(utils.toType('demo', { type: String }))).toBe(
      true,
    )
    expect(
      utils.isVueTypeDef(utils.toValidableType('demo', { type: String })),
    ).toBe(true)
  })
})

describe('`isComplexType()`', () => {
  it('validates Vue prop definition', () => {
    expect(utils.isComplexType({ type: String })).toBe(true)
    expect(utils.isComplexType({ validator: () => true })).toBe(true)
    expect(utils.isComplexType({ required: false })).toBe(true)
    expect(utils.isComplexType({ default: '' })).toBe(true)
  })
  it('validates a VueTypes type', () => {
    const type = utils.toType('demo', { type: String })
    const type2 = utils.toType('demo', { validator: () => true })
    expect(utils.isComplexType(type)).toBe(true)
    expect(utils.isComplexType(type2)).toBe(true)
  })
  it('does NOT validate other objects', () => {
    expect(utils.isComplexType({ a: '' })).toBe(false)
    expect(utils.isComplexType('')).toBe(false)
    expect(utils.isComplexType(null)).toBe(false)
    expect(utils.isComplexType({})).toBe(false)
  })
})

describe('`bindTo()`', () => {
  it('binds a function and store its original value', () => {
    const fn = jest.fn()
    const ctx = {}
    const bound = utils.bindTo(fn, ctx)

    bound()

    expect(fn.mock.instances[0]).toBe(ctx)
    expect(bound.__original).toBe(fn)
  })
})

describe('`unwrap()`', () => {
  it('returns the original unbound function if set', () => {
    const fn = () => undefined
    const ctx = {}
    const bound = utils.bindTo(fn, ctx)

    expect(utils.unwrap(fn)).toBe(fn)
    expect(utils.unwrap(bound)).toBe(fn)
  })
})

describe('`validateType()`', () => {
  it('should pass when the type is undefined', () => {
    expect(utils.validateType(undefined, 'something')).toBe(true)
  })

  it('should allow undefined explicit values for non-required types', () => {
    expect(utils.validateType({ type: String }, undefined)).toBe(true)
  })
  it('should NOT allow undefined explicit values for required types', () => {
    expect(
      utils.validateType({ type: String, required: true }, undefined),
    ).toBe(false)
  })
})

describe('`toType()`', () => {
  it('should enhance the passed-in object without cloning', () => {
    const obj = {}

    const type = utils.toType('testType', obj)
    expect(type).toBe(obj as any)
  })

  it('should bind provided `validator function to the passed in object`', () => {
    const spy = jest.fn()
    const obj = {
      validator: spy,
    }

    const type = utils.toType('testType', obj)
    const { validator } = type
    validator(true)

    expect(spy.mock.instances[0]).toBe(type)
  })

  it('should add a non-enumerable name property', () => {
    const type = utils.toType('demo', {})
    expect(type._vueTypes_name).toBe('demo')
    expect(Object.keys(type)).not.toContain('_vueTypes_name')
  })

  it('should allow the name property to be writtable', () => {
    const type = utils.toType('demo', {})
    type._vueTypes_name = 'a'
    expect(type._vueTypes_name).toBe('a')
  })

  describe('`isRequired`', () => {
    it('should add a `isRequired` getter on passed in object', () => {
      const obj = {}

      utils.toType('testType', obj)
      // eslint-disable-next-line no-prototype-builtins
      expect(obj.hasOwnProperty('isRequired')).toBe(true)
    })

    it('should set the required flag', () => {
      const type = utils.toType('testType', {}).isRequired
      expect(type.required).toBe(true)
    })
  })

  describe('`def()`', () => {
    it('should set `def` on passed in object', () => {
      const obj = {} as VueTypeDef

      utils.toType('testType', obj)
      expect(obj.def).toBeInstanceOf(Function)
    })

    it('`def` should NOT be enumerable', () => {
      const type = utils.toType('testType', {})
      expect(Object.keys(type)).not.toContain('def')
    })

    it('`def` should NOT be writable', () => {
      const type = utils.toType('testType', {})

      try {
        ;(type as any).def = 'demo'
        // eslint-disable-next-line no-empty
      } catch (e) {}
      expect(type.def).toBeInstanceOf(Function)
    })

    it('should not set invalid values as default', () => {
      const type = utils.toType('testType', { type: String })

      type.def(true as any)

      expect(type.default).toBe(undefined)
    })

    it('should remove the "default" key if passed-in value is undefined', () => {
      const type = utils.toType('testType', { type: String })
      type.def('')
      expect(type.default).toBe('')
      type.def(undefined)
      expect(Object.keys(type)).not.toContain('default')
    })

    it('skips validation if passed-in value is a function', () => {
      const type = utils.toType('testType', { type: String })
      const fn = () => true
      type.def(fn as any)
      expect(type.default).toBe(fn)
    })

    it('sets a `default` key on the object', () => {
      const type = utils.toType('testType', {})

      const stubs = [true, null, 'string', () => {}, 0]

      stubs.forEach((v) => {
        type.def(v)
        expect(type.default).toBe(v)
      })
    })

    it('sets a factory function if value is an array', () => {
      const arr = [1, 2]
      const type = utils.toType('testType', { type: Array }).def(arr)
      expect(type.default).toBeInstanceOf(Function)
      expect(type.default()).not.toBe(arr)
      expect(type.default()).toEqual(arr)
    })

    it('sets a factory function if value is an object', () => {
      const obj = { a: 'hello' }
      const type = utils.toType('testType', { type: Object }).def(obj)
      expect(type.default).toBeInstanceOf(Function)
      expect(type.default()).not.toBe(obj)
      expect(type.default()).toEqual(obj)
    })
  })
})

describe('`toValidableType()`', () => {
  it('creates a type', () => {
    const obj = { a: 'hello' }
    const type = utils
      .toValidableType('testType', { type: Object })
      .def(obj).isRequired
    expect(type.default()).toEqual(obj)
    expect(type.required).toBe(true)
    expect(type._vueTypes_name).toBe('testType')
  })
  it('adds a validate function', () => {
    const type = utils.toValidableType('testType', { type: String })
    expect(type.validate).toBeInstanceOf(Function)
  })
  it('the validate function sets a custom validator', () => {
    const fn = jest.fn()
    const type = utils
      .toValidableType('testType', { type: String })
      .validate(fn)
    expect(typeof type.validator).toBe('function')

    type.validator('demo')
    expect(fn).toHaveBeenCalledWith('demo')
  })
  it('binds the validate function to the type object', () => {
    const fn = jest.fn()
    const type = utils
      .toValidableType('testType', { type: String })
      .validate(fn)
    type.validator('')
    expect(fn.mock.instances[0]).toBe(type)
  })
})

describe('`clone()`', () => {
  it('clones an object', () => {
    const obj = { a: true }
    const nonEnum = Object.defineProperty({ a: true }, 'demo', {
      value: true,
      enumerable: false,
    }) as any

    expect(utils.clone(obj)).not.toBe(obj)
    expect(utils.clone(obj)).toEqual(obj)

    expect(utils.clone(nonEnum)).toEqual(nonEnum)
    expect(utils.clone(nonEnum).demo).toBe(true)
    expect(Object.keys(utils.clone(nonEnum))).not.toContain('demo')
  })
})

describe('`fromType()`', () => {
  it('inherits from a type', () => {
    const base = utils.toType('a', { type: String }).isRequired
    const copy = utils.fromType('b', base)

    expect(copy).not.toBe(base)
    expect(copy._vueTypes_name).toBe('b')
    expect(copy.type).toBe(base.type)
    expect(copy.required).toBe(base.required)
  })

  it('overwrite the source type', () => {
    const base = utils.toType('a', { type: String }).isRequired
    const copy = utils.fromType('b', base, { required: false })

    expect(base.required).toBe(true)
    expect(copy.required).toBe(false)
  })

  it('composes validator functions', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const validator = jest.fn((...args: any[]) => true)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const validatorCopy = jest.fn((...args: any[]) => false)
    const base = utils.toType('a', {
      type: String,
      validator,
    })

    const copy = utils.fromType('b', base, { validator: validatorCopy })

    copy.validator('')

    expect(validator).toHaveBeenCalledWith('')
    expect(validatorCopy).toHaveBeenCalledWith('')
    expect(validator.mock.instances[0]).toBe(copy as any)
    expect(validatorCopy.mock.instances[0]).toBe(copy as any)
  })
})

describe('`warn()`', () => {
  it('calls `console.warn` by default', () => {
    const message = 'message'
    utils.warn(message)
    expect(console.warn).toHaveBeenCalledWith(`[VueTypes warn]: ${message}`)
  })

  it('calls `console.log` if `config.logLevel` is `log`', () => {
    config.logLevel = 'log'
    const message = 'message'
    utils.warn(message)
    expect(console.log).toHaveBeenCalledWith(`[VueTypes warn]: ${message}`)
  })

  it('calls `console.error` if `config.logLevel` is `error`', () => {
    config.logLevel = 'error'
    const message = 'message'
    utils.warn(message)
    expect(console.error).toHaveBeenCalledWith(`[VueTypes warn]: ${message}`)
  })

  it('calls `console.debug` if `config.logLevel` is `debug`', () => {
    config.logLevel = 'debug'
    const message = 'message'
    utils.warn(message)
    expect(console.debug).toHaveBeenCalledWith(`[VueTypes warn]: ${message}`)
  })

  it('calls `console.info` if `config.logLevel` is `info`', () => {
    config.logLevel = 'info'
    const message = 'message'
    utils.warn(message)
    expect(console.info).toHaveBeenCalledWith(`[VueTypes warn]: ${message}`)
  })
})
