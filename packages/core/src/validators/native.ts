import { toType, toValidableType, isInteger, warn } from '../utils'
import { PropOptions, PropType } from '../types'

export const any = <T = any>() => toValidableType<T>('any', {})

export const func = <T extends (...args: any[]) => any>() =>
  toValidableType<T>('function', {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    type: Function as PropType<T>,
  })

export const bool = () =>
  toValidableType('boolean', {
    type: Boolean,
  })

export const string = <T extends string = string>() =>
  toValidableType<T>('string', {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    type: String as unknown as PropType<T>,
  })

export const number = <T extends number = number>() =>
  toValidableType<T>('number', {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    type: Number as unknown as PropType<T>,
  })

export const array = <T>() =>
  toValidableType<T[]>('array', {
    type: Array,
  })

export const object = <T extends Record<string, any>>() =>
  toValidableType<T>('object', {
    type: Object,
  })

export const integer = <T extends number = number>() =>
  toType<T>('integer', {
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    type: Number as unknown as PropType<T>,
    validator(value) {
      const res = isInteger(value)
      if (!res) {
        warn(`integer - "${value?.toString()}" is not an integer`)
      }
      return res
    },
  })

export const symbol = () =>
  toType<symbol>('symbol', {
    validator(value: unknown) {
      const res = typeof value === 'symbol'
      if (!res) {
        warn(`symbol - invalid value "${value?.toString()}"`)
      }
      return res
    },
  })

export const nullable = () =>
  Object.defineProperty(
    {
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      type: null as unknown as PropType<null>,
      validator(value: unknown) {
        const res = value === null
        if (!res) {
          warn(`nullable - value should be null`)
        }
        return res
      },
    },
    '_vueTypes_name',
    { value: 'nullable' },
  ) as PropOptions<null>
