import Vue from 'vue'
import {
  createTypes,
  object,
  toValidableType,
  fromType,
  VueTypeValidableDef,
} from 'vue-types'

interface User {
  ID: number
  name: string
}

const userShape = object<User>()

interface CustomVueTypes extends ReturnType<typeof createTypes> {
  readonly test: VueTypeValidableDef<string>
  readonly user: typeof userShape
}
const MyTypes = createTypes({}).extend<CustomVueTypes>([
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

const userType = MyTypes.object.def({ ID: 1, name: 'John' })
const userType2 = MyTypes.object.def(() => ({ ID: 1, name: 'John' }))
const ageType = MyTypes.number.def(2).isRequired
const strType = MyTypes.string.def('a')

const userAsShape = MyTypes.shape<User>({}).def({ ID: 1 })

const userGetterType = MyTypes.user.isRequired
const customTestType = MyTypes.test.def('aaa')

const messageType = MyTypes.string

class MyTypesClass extends createTypes({}) {
  static get test() {
    return toValidableType('test', {})
  }
  static get user() {
    return fromType('user', userShape)
  }
}

const userGetter2 = MyTypesClass.user.isRequired
const stringT = MyTypesClass.string.isRequired

const UserComponent = Vue.extend({
  props: {
    user: userGetterType,
    message: messageType,
    age: ageType,
    msg: stringT,
  },
})

new Vue({
  render: (h) => h(UserComponent),
})
