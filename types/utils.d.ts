import { Prop, PropOptions } from 'vue/types/options';
import { IConstructor, IVueTypeDef } from './index';
export declare const hasOwn: {
    (v: string): boolean;
    (v: PropertyKey): boolean;
};
export declare const getType: (fn?: IVueTypeDef | PropOptions<any> | (() => any) | (new (...args: any[]) => any) | undefined) => string;
/**
 * Returns the native type of a constructor
 *
 * @param value
 */
export declare const getNativeType: (value: IConstructor) => string;
/**
 * No-op function
 */
export declare const noop: () => void;
/**
 * Checks for a own property in an object
 *
 * @param {object} obj - Object
 * @param {string} prop - Property to check
 */
export declare const has: (obj: object, prop: string) => boolean;
/**
 * Determines whether the passed value is an integer. Uses `Number.isInteger` if available
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
 * @param {*} value - The value to be tested for being an integer.
 * @returns {boolean}
 */
export declare const isInteger: (number: number) => boolean;
/**
 * Determines whether the passed value is an Array.
 *
 * @param {*} value - The value to be tested for being an array.
 * @returns {boolean}
 */
export declare const isArray: (arg: any) => arg is any[];
/**
 * Checks if a value is a function
 *
 * @param {any} value - Value to check
 * @returns {boolean}
 */
export declare const isFunction: (value: any) => value is () => any;
export declare const isVueType: (value: any) => value is IVueTypeDef;
export declare const isPropOptions: (value: any) => value is PropOptions<object>;
/**
 * Adds a `def` method to the object returning a new object with passed in argument as `default` property
 *
 * @param {object} type - Object to enhance
 */
export declare const withDefault: (type: PropOptions<any>) => void;
/**
 * Adds a `isRequired` getter returning a new object with `required: true` key-value
 *
 * @param {object} type - Object to enhance
 */
export declare const withRequired: (type: PropOptions<any>) => void;
/**
 * Adds `isRequired` and `def` modifiers to an object
 *
 * @param {string} name - Type internal name
 * @param {object} obj - Object to enhance
 * @returns {object}
 */
export declare const toType: (name: string, obj: PropOptions<any>) => IVueTypeDef;
/**
 * Validates a given value against a prop type object
 *
 * @param {Object|*} type - Type to use for validation. Either a type object or a constructor
 * @param {*} value - Value to check
 * @param {boolean} silent - Silence warnings
 * @returns {boolean}
 */
export declare const validateType: (type: IVueTypeDef | PropOptions<any> | (() => any) | (new (...args: any[]) => any) | Prop<any>[], value: any, silent?: boolean) => boolean;

export declare const warn: (...msg: any[]) => void
