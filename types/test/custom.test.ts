import Vue from 'vue'
import { createTypes, object } from '../../src/index'
import { VueTypeValidableDef } from '../vue-types'

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
const ageType = MyTypes.number.def(2)

const userAsShape = MyTypes.shape<User>({}).def({ ID: 1 })

const userGetterType = MyTypes.user.isRequired
const customTestType = MyTypes.test.def('aaa')

const messageType = MyTypes.string

const UserComponent = Vue.extend({
  props: {
    user: userGetterType,
    message: messageType,
    age: ageType,
  },
})

new Vue({
  render: (h) => h(UserComponent),
})
