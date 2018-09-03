// TypeScript Version: 2.8
import { Prop, PropOptions } from 'vue/types/options';

export interface Constructor {
  new (...args: any[]): any;
}

export type DefaultFactory<T> = (() => T) | T;

export type defaultType<T> = T extends any[] ? DefaultFactory<T>
  : T extends object ? DefaultFactory<T>
  : T;
export interface VueTypeDef<T = any, D = defaultType<T>> extends PropOptions<T> {
  readonly _vueTypes_name: string;
  readonly def: (def: D) => this & { default: D };
  readonly isRequired: this & { required: true };
}

export type VueProp = VueTypeDef | PropOptions;

export interface VueTypeInstanceOf<T extends Constructor> extends VueTypeDef<InstanceType<T>> {
  type: T;
}

export interface VueTypeShape<T> extends VueTypeDef<T> {
  readonly def: <P extends defaultType<{ [K in keyof T]?: any }>>(def: P) => this & { default: P };
  readonly loose: VueTypeLooseShape<T>;
}

export interface VueTypeLooseShape<T> extends VueTypeShape<T> {
  readonly _vueTypes_isLoose: true;
  readonly def: <D extends defaultType<{ [K in keyof T]?: any } & { [key: string]: any }>>(def: D) => this & { default: D };
}

export interface VueTypeArrayOf<T> extends VueTypeDef<T[]> {
}

export type ValidatorFunction<T = any> = (value: T) => boolean;

export interface VueTypeCustom<T, F extends ValidatorFunction<T>> extends VueTypeDef<T> {
  validator(value: T): ReturnType<F>;
}

export interface VueTypeObjectOf<T> extends VueTypeDef<Record<string, T>> {
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
  object?: () => Record<string, any>;
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
  oneOf<T = any>(arr: T[]): VueTypeDef<T[], T>;
  instanceOf<C extends Constructor>(instanceConstructor: C): VueTypeInstanceOf<C>;
  oneOfType<T = Prop<any> | VueProp>(arr: T[]): VueTypeDef<T, any>;
  arrayOf<V extends any>(type: VueTypeDef<V> | Prop<V>): VueTypeArrayOf<V>;
  objectOf<T = any>(type: Prop<T> | VueProp): VueTypeObjectOf<T>;
  shape<S extends { [key: string]: VueProp | Prop<any> }>(obj: S): VueTypeShape<S>;
}

export const VueTypes: VueTypes;
