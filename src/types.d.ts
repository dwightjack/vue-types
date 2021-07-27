export type Prop<T = any> =
  | {
      // eslint-disable-next-line @typescript-eslint/ban-types
      new (...args: any[]): T & object
    }
  | {
      (): T
    }
  | PropMethod<T>

type PropMethod<T, TConstructor = any> = T extends (...args: any) => any
  ? {
      new (): TConstructor
      (): T
      readonly prototype: TConstructor
    }
  : never

// eslint-disable-next-line @typescript-eslint/ban-types
export type NativeType = string | boolean | number | null | undefined | Function

export type Constructor = new (...args: any[]) => any

export type PropType<T> = Prop<T> | Prop<T>[]

export interface PropOptions<T = any, D = T> {
  type?: PropType<T> | true | null
  required?: boolean
  default?:
    | D
    | null
    | undefined
    | (() => D | null | undefined)
    | ((props: Record<string, unknown>) => D)
    // eslint-disable-next-line @typescript-eslint/ban-types
    | object
  validator?(value: T): boolean
}

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

export type DefaultType<T> = T extends NativeType ? T : DefaultFactory<T>

export interface VueTypeBaseDef<
  T = unknown,
  D = DefaultType<T>,
  U = T extends NativeType ? T : () => T,
> extends PropOptions<T> {
  _vueTypes_name: string
  type?: PropType<T>
  readonly def: (def?: D) => this & {
    default: U
  }
  readonly isRequired: this & { required: true }
}

export type VueTypeDef<T = unknown> = VueTypeBaseDef<T>

export interface VueTypeValidableDef<T = unknown> extends VueTypeBaseDef<T> {
  readonly validate: (
    fn: ValidatorFunction<T | unknown>,
  ) => this & { validator: ValidatorFunction<T | unknown> }
}

export type VueProp<T> = VueTypeBaseDef<T> | PropOptions<T>

export interface VueTypeShape<T>
  extends VueTypeBaseDef<T, DefaultType<Partial<T>>, () => Partial<T>> {
  readonly loose: VueTypeLooseShape<T>
}

export interface VueTypeLooseShape<T>
  extends VueTypeBaseDef<
    T,
    DefaultFactory<Partial<T & { [key: string]: any }>>,
    () => Partial<T> & { [key: string]: any }
  > {
  readonly loose: VueTypeLooseShape<T>
  readonly _vueTypes_isLoose: true
}

export interface VueTypesDefaults {
  func: (...args: any[]) => any
  bool: boolean
  string: string
  number: number
  array: () => any[]
  object: () => { [key: string]: any }
  integer: number
}

export interface ExtendProps<T = any> {
  name: string
  getter?: boolean
  validate?: boolean
  type?: PropType<T> | VueTypeDef<T> | VueTypeValidableDef<T>
  required?: boolean
  default?: T | null | undefined | (() => T | null | undefined)
  validator?(...args: any[]): boolean
}
