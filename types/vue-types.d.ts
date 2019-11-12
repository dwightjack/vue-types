// TypeScript Version: 2.8
import { Prop, PropOptions } from 'vue/types/options'

export type Constructor = new (...args: any[]) => any

export type ValidatorFunction<T = any> = (value: T) => boolean

export type DefaultFactory<T> = (() => T) | T

export type defaultType<T> = T extends any[]
  ? DefaultFactory<T>
  : T extends object
  ? DefaultFactory<T>
  : T
export interface VueTypeDef<T = any, D = defaultType<T>>
  extends PropOptions<T> {
  readonly _vueTypes_name: string
  readonly def: (def: D) => this & { default: D }
  readonly isRequired: this & { required: true }
}

export interface VueTypeValidableDef<T = any> extends VueTypeDef<T> {
  readonly validate: (
    fn: ValidatorFunction<T>,
  ) => this & { validator: ValidatorFunction<T> }
}

export type VueProp<T, D = defaultType<T>> =
  | VueTypeValidableDef<T>
  | VueTypeDef<T, D>
  | PropOptions<T>

export interface VueTypeInstanceOf<T extends Constructor>
  extends VueTypeDef<InstanceType<T>> {
  type: T
}

export interface VueTypeShape<T, D = DefaultFactory<Partial<T>>>
  extends VueTypeDef<T, D> {
  readonly loose: VueTypeLooseShape<T>
}

export interface VueTypeLooseShape<
  T,
  D = DefaultFactory<Partial<T & { [key: string]: any }>>
> extends VueTypeShape<T, D> {
  readonly _vueTypes_isLoose: true
}

export interface VueTypeCustom<T, F extends ValidatorFunction<T>>
  extends VueTypeDef<T> {
  validator(value: T): ReturnType<F>
}

export type VueTypeObjectOf<T> = VueTypeDef<Record<string, T>>

export interface VueTypesUtils {
  validate(value: any, type: VueProp<any> | Prop<any> | Prop<any>[]): boolean
  toType(name: string, obj: PropOptions): VueTypeDef
}

export interface TypeDefaults {
  func?: () => any
  bool?: boolean
  string?: string
  number?: number
  array?: any[]
  object?: () => Record<string, any>
  integer?: number
}

export interface ExtendProps extends PropOptions {
  name: string
  getter?: boolean
  validate?: boolean
}

export interface VueTypesInterface {
  sensibleDefaults: TypeDefaults | boolean
  extend<T extends VueTypesInterface>(props: ExtendProps): T
  utils: VueTypesUtils
  readonly any: VueTypeValidableDef
  readonly bool: VueTypeValidableDef<boolean>
  readonly func: VueTypeValidableDef<() => any>
  readonly array: VueTypeValidableDef<any[]>
  readonly string: VueTypeValidableDef<string>
  readonly number: VueTypeValidableDef<number>
  readonly object: VueTypeValidableDef<{ [key: string]: any }>
  readonly integer: VueTypeDef<number>
  readonly symbol: VueTypeValidableDef<symbol>
  custom<T = any>(
    fn: ValidatorFunction<T>,
    warnMsg?: string,
  ): VueTypeCustom<T, ValidatorFunction<T>>
  oneOf<T = any>(arr: T[]): VueTypeDef<T>
  instanceOf<C extends Constructor>(
    instanceConstructor: C,
  ): VueTypeInstanceOf<C>
  oneOfType(arr: (Prop<any> | VueProp<any>)[]): VueTypeDef
  arrayOf<V extends any, D = defaultType<V>>(
    type: VueTypeValidableDef<V> | VueTypeDef<V, D> | Prop<V>,
  ): VueTypeDef<V[]>
  objectOf<T extends any>(type: Prop<T> | VueProp<T>): VueTypeObjectOf<T>
  shape<T>(
    obj: { [K in keyof T]?: Prop<T[K]> | VueProp<T[K], any> },
  ): VueTypeShape<T>
}

export const VueTypes: VueTypesInterface
