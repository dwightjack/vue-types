import Vue from 'vue'
import { createTypes } from '../../src/index'

interface User {
  ID: number
  name: string
}

const MyTypes = createTypes({})

const userType = MyTypes.object.def({ ID: 1, name: 'John' })
const ageType = MyTypes.number.def(2)

const userAsShape = MyTypes.shape<User>({}).def({ ID: 1 })

const messageType = MyTypes.string.isRequired

const UserComponent = Vue.extend({
  props: {
    user: userType,
    message: messageType,
    age: ageType,
  },
})

new Vue({
  render: (h) => h(UserComponent),
})
