// TypeScript Version: 2.8
import { Prop, PropOptions } from 'vue/types/options';
import { Constructor, VueTypeDef } from './index';

export const hasOwn: (v: string | PropertyKey) => boolean;

export const getType: (fn?: VueTypeDef | PropOptions | (() => any) | (new (...args: any[]) => any)) => string;
/**
 * Returns the native type of a constructor
 *
 */
export const getNativeType: (value: Constructor) => string;
/**
 * No-op function
 */
export const noop: () => void;
/**
 * Checks for a own property in an object
 *
 */
export const has: (obj: object, prop: string) => boolean;
/**
 * Determines whether the passed value is an integer. Uses `Number.isInteger` if available
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
 */
export const isInteger: (number: number) => boolean;
/**
 * Determines whether the passed value is an Array.
 *
 */
export const isArray: (arg: any) => arg is any[];
/**
 * Checks if a value is a function
 *
 */
export const isFunction: (value: any) => value is () => any;
export const isVueType: (value: any) => value is VueTypeDef;
export const isPropOptions: (value: any) => value is PropOptions<object>;
/**
 * Adds a `def` method to the object returning a new object with passed in argument as `default` property
 *
 */
export const withDefault: (type: PropOptions) => void;
/**
 * Adds a `isRequired` getter returning a new object with `required: true` key-value
 *
 */
export const withRequired: (type: PropOptions) => void;
/**
 * Adds `isRequired` and `def` modifiers to an object
 *
 */
export const toType: (name: string, obj: PropOptions) => VueTypeDef;
/**
 * Validates a given value against a prop type object
 *
 */
export const validateType: (type: VueTypeDef | PropOptions | (() => any) | (new (...args: any[]) => any) | Array<Prop<any>>, value: any, silent?: boolean) => boolean;

export const warn: (...msg: any[]) => void;
