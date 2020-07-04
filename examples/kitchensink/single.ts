import Vue from 'vue'
import {
  any,
  func,
  bool,
  string,
  number,
  array,
  object,
  custom,
  oneOf,
  oneOfType,
  arrayOf,
  instanceOf,
  objectOf,
  shape,
  toType,
  fromType,
  VueTypeShape,
} from '../../src'

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

const instanceOfDemo = instanceOf(Demo).def(() => new Demo())
const instanceOfDemo2 = instanceOf(Demo).def(new Demo())

type OnClick = (e: MouseEvent) => void
const funcType = func<OnClick>().def((e: Event) => {
  e.target
})

const anyType = any()

const userType = object<User>().def({ ID: 1, name: 'John' })
const ageType = number().isRequired.def(20).def(10)

const customType = custom<string>((v) => typeof v === 'string' && v.length > 0)

const userAsShape = shape<User>({ ID: Number, name: string() }).def({
  ID: 1,
  name: 'aaa',
})

const userAsLooseShape = shape<User>({ ID: Number, name: String }).loose.def({
  ID: 1,
  name: 'aaa',
  ops: true,
})

const looseClone = fromType('looseClone', userAsShape).loose

const messageType = string().isRequired

const messageTypeClone = fromType('message', messageType)
const messageTypeClone2 = fromType('message', messageType, {
  default: 'sss',
})

const stringOrNumberOrBoolType = oneOfType([{ type: String }, Number, bool()])

const arrayType = array().def([1, 2, 3])
const arrayStringType = array<string>().def(['a'])
const arrayOfStringsType = arrayOf(string())
const arrayofUsersType = arrayOf(userType)
const arrayOfStringsType2 = arrayOf(String)
const arrayOfMultipleType = arrayOf(stringOrNumberOrBoolType).def(['a'])
const arrayOfVueProp = arrayOf({ type: [String, Number] })

const scoreType = minMax(10, 200).isRequired

const objectOfString = objectOf(arrayOf(String))

type Pair = [string, number]

const tupleType = custom<Pair>(
  ([a, b]) => typeof a === 'string' && typeof b === 'number',
)
const objectOfTuple = objectOf(tupleType)

const oneOfTuple = oneOf([1, 2, 'string'] as const).def(1)

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
