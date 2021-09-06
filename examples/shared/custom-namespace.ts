/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  createTypes,
  object,
  toValidableType,
  fromType,
  VueTypeValidableDef,
  toType,
} from 'vue-types'

interface User {
  ID: number
  name: string
}

export const userShape = object<User>()

interface CustomVueTypes extends ReturnType<typeof createTypes> {
  readonly test: VueTypeValidableDef<string>
  readonly user: typeof userShape
}
export const MyTypes = createTypes({}).extend<CustomVueTypes>([
  {
    name: 'test',
    validate: true,
    getter: true,
  },
  {
    name: 'user',
    type: userShape,
    getter: true,
  },
])

export const userType = MyTypes.object.def({ ID: 1, name: 'John' })
export const userType2 = MyTypes.object.def(() => ({ ID: 1, name: 'John' }))
export const ageType = MyTypes.number.def(2).isRequired
export const strType = MyTypes.string.def('a')

export const userAsShape = MyTypes.shape<User>({
  ID: Number,
  name: String,
}).def({ ID: 1 })

export const userGetterType = MyTypes.user.isRequired
export const customTestType = MyTypes.test.def('aaa')

export const messageType = MyTypes.string

export class MyTypesClass extends createTypes({}) {
  static get test() {
    return toValidableType('test', {})
  }
  static get user() {
    return fromType('user', userShape)
  }
  static get positive() {
    return toType('positive', { type: Number, validator: (v) => v >= 0 }).def(0)
  }
}

export const userGetter2 = MyTypesClass.user.isRequired
export const stringT = MyTypesClass.string.isRequired
export const positiveT = MyTypesClass.positive.isRequired
