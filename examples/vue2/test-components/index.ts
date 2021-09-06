import Vue from 'vue2'
import VueTypes from 'vue-types'
import {
  boolType,
  funcType,
  arrayType,
  stringType,
  numberType,
  integerType,
  objectType,
  objectType2,
  symbolType,
  ArrayOfType,
  userType,
  instanceOfType,
  customTypeStrict,
  ObjectOfType,
  shapeTypeLoose,
  shapeType,
} from '../../shared/default-namespace'

const NativeComponent = Vue.extend({
  props: {
    verified: boolType,
    funcProp: funcType,
    hobbies: arrayType,
    name: stringType,
    height: numberType,
    age: integerType,
    obj: objectType,
    obj2: objectType2,
    uniqueSym: symbolType,
  },
})

const OtherTypesComponent = Vue.extend({
  props: {
    friends: ArrayOfType,
    user: userType,
    ageLimit: customTypeStrict,
    colors: VueTypes.oneOf(['red', 'blue']),
    userType: instanceOfType,
    fieldWithText: VueTypes.oneOfType([String, VueTypes.string]),
    friendsId: VueTypes.arrayOf(VueTypes.number).isRequired,
    simpleObj: ObjectOfType,
    meta: shapeType,
    extendedMeta: shapeTypeLoose,
  },
})

new Vue({ render: (h) => h(NativeComponent) })
new Vue({ render: (h) => h(OtherTypesComponent) })
