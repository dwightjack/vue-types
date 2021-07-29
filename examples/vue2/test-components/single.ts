import Vue from 'vue2'
import {
  userType,
  messageType,
  ageType,
  arrayOfStringsType,
  arrayOfMultipleType,
  scoreType,
  funcType,
  anyType,
  objectOfTuple,
  oneOfTuple,
} from '../../shared/validators'

const UserComponent = Vue.extend({
  props: {
    user: userType,
    message: messageType,
    age: ageType,
    hobbies: arrayOfStringsType,
    randomData: arrayOfMultipleType,
    score: scoreType,
  },
})

const UserProfile = Vue.extend({
  props: {
    onClick: funcType,
    action: anyType,
    tupleObj: objectOfTuple,
    oneOf: oneOfTuple,
  },
})

new Vue({
  render: (h) => h(UserComponent),
})

new Vue({
  render: (h) => h(UserProfile),
})
