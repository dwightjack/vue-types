import { toType, toValidableType, isInteger } from '../utils'
import { PropType } from '../types'

export const any = () => toValidableType('any', {})

export const func = <T extends (...args: any[]) => any>() =>
  toValidableType<T>('function', {
    type: Function as PropType<T>,
  })

export const bool = () =>
  toValidableType('boolean', {
    type: Boolean,
  })

export const string = () =>
  toValidableType('string', {
    type: String,
  })

export const number = () =>
  toValidableType('number', {
    type: Number,
  })

export const array = <T>() =>
  toValidableType<T[]>('array', {
    type: Array,
  })

export const object = <T extends { [key: string]: any }>() =>
  toValidableType<T>('object', {
    type: Object,
  })

export const integer = () =>
  toType('integer', {
    type: Number,
    validator(value) {
      return isInteger(value)
    },
  })

export const symbol = () =>
  toType<symbol>('symbol', {
    validator(value) {
      return typeof value === 'symbol'
    },
  })
