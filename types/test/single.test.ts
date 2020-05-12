import Vue from 'vue'
import { string, object, shape, number } from '../../src/index'

interface User {
  ID: number
  name: string
}

const userType = object<User>().def({ ID: 1, name: 'John' })
const ageType = number().isRequired

const userAsShape = shape<User>({}).def({ ID: 1 })

const messageType = string().isRequired

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
