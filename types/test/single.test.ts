import Vue from 'vue'
import {
  string,
  bool,
  object,
  shape,
  number,
  arrayOf,
  toType,
  oneOfType,
  custom,
  instanceOf,
} from '../../src/index'

interface User {
  ID: number
  name: string
}

function minMax(min: number, max: number) {
  return toType<number>('minmax', {
    type: Number,
    validator(v) {
      return v > min && v < max
    },
  })
}

class Demo {
  id = 10
}

const instanceOfDemo = instanceOf(Demo).def(Demo)

const userType = object<User>().def({ ID: 1, name: 'John' })
const ageType = number().isRequired

const customType = custom<string>((v) => typeof v === 'string' && v.length > 0)

const userAsShape = shape<User>({}).def({ ID: 1 })

const messageType = string().isRequired

const stringOrNumberOrBoolType = oneOfType([{ type: String }, Number, bool()])

const arrayOfStringsType = arrayOf(string())
const arrayOfStringsType2 = arrayOf(String)
const arrayOfMultipleType = arrayOf(stringOrNumberOrBoolType)

const scoreType = minMax(10, 200).isRequired

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

new Vue({
  render: (h) => h(UserComponent),
})
