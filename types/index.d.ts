// TypeScript Version: 2.3
import { Prop, PropOptions } from 'vue/types/options';

export interface VueTypeDef extends PropOptions {
  readonly _vueTypes_name: string;
  readonly def: <T>(def: T) => this & { default: T };
  readonly isRequired: this & { required: boolean };
  _vueTypes_isLoose?: boolean;
  readonly loose?: this & { _vueTypes_isLoose: boolean };
}

export interface Constructor {
  new (...args: any[]): any;
}

export type VueProp = VueTypeDef | PropOptions;

export interface Utils {
  validate(value: any, type: VueProp | Prop<any> | Array<Prop<any>>): boolean;
  toType(name: string, obj: PropOptions): VueTypeDef;
}

export interface VueTypes {
  sensibleDefaults?: {};
  utils: Utils;
  readonly any: VueTypeDef;
  readonly bool: VueTypeDef;
  readonly func: VueTypeDef;
  readonly array: VueTypeDef;
  readonly string: VueTypeDef;
  readonly number: VueTypeDef;
  readonly object: VueTypeDef;
  readonly integer: VueTypeDef;
  readonly symbol: VueTypeDef;
  custom(fn: (...value: any[]) => boolean, warnMsg?: string): VueTypeDef;
  oneOf(arr: any[]): VueTypeDef;
  instanceOf(instanceConstructor: Constructor): VueTypeDef;
  oneOfType(arr: Array<Prop<any> | VueProp>): VueTypeDef;
  arrayOf(type: VueTypeDef | Prop<any>): VueTypeDef;
  objectOf(type: VueTypeDef | Prop<any>): VueTypeDef;
  shape(obj: { [key: string]: VueProp|Prop<any> }): VueTypeDef;
}
