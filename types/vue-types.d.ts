// TypeScript Version: 2.3
import { Prop, PropOptions } from 'vue/types/options';

export interface Constructor {
  new (...args: any[]): any;
}

export type   VueProp = VueTypeDef | PropOptions;

export interface VueTypeDef<T = any> extends PropOptions {
  readonly _vueTypes_name: string;
  readonly def: (def: T) => this & { default: T };
  readonly isRequired: this & { required: true };
}

export interface VueTypeOneOf<T> extends VueTypeDef {
  type?: Constructor[];
  readonly def: (def: T) => this & { default: T };
}

export interface VueTypeInstanceOf<T extends Constructor, I = InstanceType<T>> extends VueTypeDef {
  type: T;
  readonly def: (def: I) => this & { default: I };
}

export interface VueTypeShape<T> extends VueTypeDef {
  type: ObjectConstructor;
  _vueTypes_isLoose?: boolean;
  readonly def: <P extends { [K in keyof T]?: any }>(def: P) => this & { default: P };
  readonly loose: this & { _vueTypes_isLoose: true };
}

export interface VueTypeArrayOf<T> extends VueTypeDef {
  type: ArrayConstructor;
  readonly def: <A extends T[]>(def: A) => this & { default: A };
}

export type ValidatorFunction<T = any> = (value: T) => boolean;

export interface VueTypeCustom<T, F extends ValidatorFunction<T>> extends VueTypeDef {
  validator(value: T): ReturnType<F>;
  readonly def: (def: T) => this & { default: T };
}

export interface VueTypeObjectOf<T = any> extends VueTypeDef {
  readonly def: <O extends { [key: string]: T }>(def: O) => this & { default: O };
}

export interface VueTypesUtils {
  validate(value: any, type: VueProp | Prop<any> | Array<Prop<any>>): boolean;
  toType(name: string, obj: PropOptions): VueTypeDef;
}

export interface TypeDefaults {
  func?: () => any;
  bool?: boolean;
  string?: string;
  number?: number;
  array?: any[];
  object?: () => { [key: string]: any };
  integer?: number;
}

export interface VueTypes {
  sensibleDefaults: TypeDefaults | boolean;
  utils: VueTypesUtils;
  readonly any: VueTypeDef;
  readonly bool: VueTypeDef<boolean>;
  readonly func: VueTypeDef<() => any>;
  readonly array: VueTypeDef<any[]>;
  readonly string: VueTypeDef<string>;
  readonly number: VueTypeDef<number>;
  readonly object: VueTypeDef<object>;
  readonly integer: VueTypeDef<number>;
  readonly symbol: VueTypeDef<symbol>;
  custom<T = any>(fn: ValidatorFunction<T>, warnMsg?: string): VueTypeCustom<T, ValidatorFunction<T>>;
  oneOf<T = any>(arr: T[]): VueTypeOneOf<T>;
  instanceOf<C extends Constructor>(instanceConstructor: C): VueTypeInstanceOf<C>;
  oneOfType(arr: Array<Prop<any> | VueProp>): VueTypeDef;
  arrayOf<V extends any>(type: VueTypeDef<V> | Prop<V>): VueTypeArrayOf<V>;
  objectOf<T = any>(type: Prop<T> | VueProp): VueTypeObjectOf<T>;
  shape<S extends { [key: string]: VueProp | Prop<any> }>(obj: S): VueTypeShape<S>;
}

export const VueTypes: VueTypes;
