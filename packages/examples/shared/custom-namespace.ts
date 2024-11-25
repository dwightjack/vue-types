import {
  createTypes,
  object,
  toValidableType,
  fromType,
  toType,
} from 'vue-types'

interface User {
  ID: number
  name: string
}

export const userShape = object<User>()

export class MyTypes extends createTypes({}) {
  static get test() {
    return toValidableType('test', {})
  }
  static get user() {
    return fromType('user', userShape)
  }
  static get positive() {
    return toType('positive', {
      type: Number,
      validator: (v) => Number(v) >= 0,
    }).def(0)
  }
}

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

export const userGetter2 = MyTypes.user.isRequired
export const stringT = MyTypes.string.isRequired
export const positiveT = MyTypes.positive.isRequired
