import { toType, toValidableType, isInteger } from '../utils'
import { PropType } from '../types'

export const any = <T = any>() => toValidableType<T>('any', {})

export const func = <T extends (...args: any[]) => any>() =>
  toValidableType<T>('function', {
    type: Function as PropType<T>,
  })

export const bool = () =>
  toValidableType('boolean', {
    type: Boolean,
  })

export const string = <T extends string = string>() =>
  toValidableType<T>('string', {
    type: String as unknown as PropType<T>,
  })

export const number = <T extends number = number>() =>
  toValidableType<T>('number', {
    type: Number as unknown as PropType<T>,
  })

export const array = <T>() =>
  toValidableType<T[]>('array', {
    type: Array,
  })

export const object = <T extends { [key: string]: any }>() =>
  toValidableType<T>('object', {
    type: Object,
  })

export const integer = <T extends number = number>() =>
  toType<T>('integer', {
    type: Number as unknown as PropType<T>,
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

export const nullable = () => ({
  type: null as unknown as PropType<null>,
})
