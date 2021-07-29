import Vue from 'vue2'

import {
  userGetterType,
  messageType,
  ageType,
  stringT,
} from '../../shared/custom-namespace'

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
