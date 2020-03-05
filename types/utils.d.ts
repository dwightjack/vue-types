import { Prop, PropOptions } from 'vue/types/options'
import { Constructor, VueTypeDef } from './index'

export function hasOwn(v: string | PropertyKey): boolean

export function getType(
  fn?: VueTypeDef | PropOptions | (() => any) | (new (...args: any[]) => any),
): string
/**
 * Returns the native type of a constructor
 *
 */
export function getNativeType(value: Constructor): string
/**
 * No-op function
 */
export function noop(): undefined
/**
 * Checks for a own property in an object
 *
 */
export function has(obj: object, prop: string): boolean
/**
 * Determines whether the passed value is an integer. Uses `Number.isInteger` if available
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
 */
export function isInteger(number: number): boolean
/**
 * Determines whether the passed value is an Array.
 *
 */
export function isArray(arg: any): arg is any[]
/**
 * Checks if a value is a function
 *
 */
export function isFunction(value: any): value is () => any
export function isVueType(value: any): value is VueTypeDef
export function isPropOptions(value: any): value is PropOptions<object>
/**
 * Adds a `def` method to the object returning a new object with passed in argument as `default` property
 *
 */
export function withDefault(type: PropOptions): undefined
/**
 * Adds a `isRequired` getter returning a new object with `required: true` key-value
 *
 */
export function withRequired(type: PropOptions): undefined
/**
 * Adds `isRequired` and `def` modifiers to an object
 *
 */
export function toType(name: string, obj: PropOptions): VueTypeDef
/**
 * Validates a given value against a prop type object
 *
 */
export function validateType(
  type:
    | VueTypeDef
    | PropOptions
    | (() => any)
    | (new (...args: any[]) => any)
    | Prop<any>[],
  value: any,
  silent?: boolean,
): boolean

export function warn(...msg: any[]): undefined
