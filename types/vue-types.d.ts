// TypeScript Version: 2.8
import { PropOptions, PropType, Prop } from 'vue/types/options'

export type Constructor = new (...args: any[]) => any

// see https://github.com/vuejs/vue-next/blob/22717772dd83b67ffaa6ad9805c6269e184c7e41/packages/runtime-core/src/componentProps.ts#L67
export type InferType<T> = T extends { type: null | true }
  ? any
  : T extends ObjectConstructor | { type: ObjectConstructor }
  ? { [key: string]: any }
  : T extends Prop<infer V>
  ? V
  : T extends PropOptions<infer V>
  ? V
  : T extends VueTypeDef<infer V>
  ? V
  : T extends VueTypeValidableDef<infer V>
  ? V
  : T

export type ValidatorFunction<T> = (value: T) => boolean

export type DefaultFactory<T> = (() => T) | T

export type DefaultType<T> = T extends
  | string
  | boolean
  | number
  | null
  | undefined
  | Function
  ? T
  : DefaultFactory<T>

export interface VueTypeDef<T = unknown, D = DefaultType<T>>
  extends PropOptions<T> {
  readonly _vueTypes_name: string
  readonly def: (def?: D) => this & { default: D }
  readonly isRequired: this & { required: true }
}

export interface VueTypeValidableDef<T = unknown, D = DefaultType<T>>
  extends VueTypeDef<T, D> {
  readonly validate: (
    fn: ValidatorFunction<T>,
  ) => this & { validator: ValidatorFunction<T> }
}

export type VueProp<T> = VueTypeValidableDef<T> | VueTypeDef<T> | PropOptions<T>

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

export interface VueTypesDefaults {
  func: Function
  bool: boolean
  string: string
  number: number
  array: () => any[]
  object: () => { [key: string]: any }
  integer: number
}

export interface ExtendProps<T> {
  name: string
  getter?: boolean
  validate?: boolean
  type?: PropType<T> | VueTypeDef<T> | VueTypeValidableDef<T>
  required?: boolean
  default?: T | null | undefined | (() => T | null | undefined)
  validator?(value: T): boolean
}
