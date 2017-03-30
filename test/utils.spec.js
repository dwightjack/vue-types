import expect, { spyOn, createSpy } from 'expect'
import * as utils from '../src/utils'

describe('`toType()`', () => {

  it('should call `withRequired` on passed in object', () => {
    const obj = {}

    utils.toType(obj)
    expect(obj.hasOwnProperty('isRequired')).toBe(true)

  })

  it('should call `withDefault` on passed in object', () => {
    const obj = {}

    utils.toType(obj)
    expect(obj.def).toBeA(Function)

  })

  it('should bind provided `validator function to the passed in object`', () => {
    const obj = {
      validator() {
        return this
      }
    }

    const type = utils.toType(obj)
    const validator = type.validator

    expect(validator()).toBe(obj)
  })

})
