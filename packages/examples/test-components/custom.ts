import { defineComponent, createApp, h } from 'vue'

import {
  userGetterType,
  messageType,
  ageType,
  stringT,
} from '../shared/custom-namespace'
const UserComponent = defineComponent({
  props: {
    user: userGetterType,
    message: messageType,
    age: ageType,
    msg: stringT,
  },
})

createApp({
  render: () => h(UserComponent),
})
