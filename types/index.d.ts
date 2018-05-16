import { Prop, PropOptions } from 'vue/types/options'

export as namespace VueTypes;

export interface IVueTypeDef extends PropOptions {
  readonly _vueTypes_name: string
  readonly def: <T>(def: T) => this & { default: T },
  readonly isRequired: this & { required: boolean },
  _vueTypes_isLoose?: boolean
  readonly loose?: this & { _vueTypes_isLoose: boolean }
}

export interface IConstructor {
  new (...args: any[]): any
}

export type VueProp = IVueTypeDef | PropOptions<any>

export interface IUtils {
  validate(value: any, type: VueProp | Prop<any> | Array<Prop<any>>): boolean
  toType(name: string, obj: PropOptions): IVueTypeDef
}

export interface IVueTypes {
  sensibleDefaults?: {},
  utils: IUtils
  readonly any: IVueTypeDef
  readonly bool: IVueTypeDef
  readonly func: IVueTypeDef
  readonly array: IVueTypeDef
  readonly string: IVueTypeDef
  readonly number: IVueTypeDef
  readonly object: IVueTypeDef
  readonly integer: IVueTypeDef
  readonly symbol: IVueTypeDef
  custom(fn: (...value: any[]) => boolean, warnMsg?: string): IVueTypeDef
  oneOf<T>(arr: T[]): IVueTypeDef,
  instanceOf(instanceConstructor: IConstructor): IVueTypeDef
  oneOfType(arr: Array<Prop<any> | VueProp>): IVueTypeDef
  arrayOf(type: IVueTypeDef | Prop<any>): IVueTypeDef
  objectOf(type: IVueTypeDef | Prop<any>): IVueTypeDef
  shape(obj: { [key: string]: VueProp|Prop<any> }): IVueTypeDef
}

declare const VueTypes: IVueTypes;

export default VueTypes;
