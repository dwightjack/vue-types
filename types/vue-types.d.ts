// TypeScript Version: 2.3
import { Prop, PropOptions } from 'vue/types/options';

export interface VueTypeDef<T = any> extends PropOptions {
  readonly _vueTypes_name: string;
  readonly def: (def: T) => this & { default: T };
  readonly isRequired: this & { required: true };
}

export interface VueTypeShape<T = object> extends VueTypeDef {
  _vueTypes_isLoose?: boolean;
  readonly def: <P = Partial<T>>(def: P) => this & { default: P };
  readonly loose: this & { _vueTypes_isLoose: true };
}

export interface Constructor {
  new (...args: any[]): any;
}

export type VueProp = VueTypeDef | PropOptions;

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

export type ValidatorFunction = (value: any) => boolean;

export interface CustomType<T, F extends ValidatorFunction> extends VueTypeDef {
  validator(value: T): ReturnType<F>;
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
  custom<F extends ValidatorFunction>(fn: F, warnMsg?: string): CustomType<any, F>;
  oneOf(arr: any[]): VueTypeDef;
  instanceOf(instanceConstructor: Constructor): VueTypeDef;
  oneOfType(arr: Array<Prop<any> | VueProp>): VueTypeDef;
  arrayOf(type: VueTypeDef | Prop<any>): VueTypeDef;
  objectOf(type: VueTypeDef | Prop<any>): VueTypeDef;
  shape<S = { [key: string]: VueProp|Prop<any> }>(obj: S): VueTypeShape<S>;
}

export const VueTypes: VueTypes;
