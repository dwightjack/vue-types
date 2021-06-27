import { defineComponent, createApp, h } from 'vue3'
// import Component from 'vue-class-component'
import VueTypes, { VueTypesInterface, VueTypeValidableDef } from 'vue-types'
import ProjectTypes from './namespaced-extended'

const noop = (): void => undefined

const anyType = VueTypes.any
anyType.def(0)
anyType.def('string')

const boolType = VueTypes.bool.def(true).isRequired

const funcType = VueTypes.func.def(noop).isRequired

const arrayType = VueTypes.array.def([]).isRequired
const arrayType2 = VueTypes.array.def(() => []).isRequired

const stringType = VueTypes.string.def('John').isRequired
const stringTypeValidate = VueTypes.string
  .def('John')
  .isRequired.validate((v: string): boolean => v === 'John')

const numberType = VueTypes.number.def(0).isRequired
const integerType = VueTypes.integer.def(0).isRequired

const objectType = VueTypes.object.def({ demo: true }).isRequired
const objectType2 = VueTypes.object.def(() => true).isRequired //FIXME: why this does not break?

interface Account {
  name: string
  ID: number
}

const userType = VueTypes.object.def({
  ID: 1,
  name: 'me',
})

const symbolType = VueTypes.symbol.def(Symbol('foo')).isRequired

const validator = (v: number) => v > 18
const customType = VueTypes.custom(validator).def(0).isRequired

const customTypeStrict = VueTypes.custom<number>(validator).def(0).isRequired

const oneOf = VueTypes.oneOf([0, 'string', null]).def(2).isRequired

const oneOfStrict = VueTypes.oneOf([true, 'string'] as const).def('string')
  .isRequired

class MyClass {
  public test = 'testProp'
}

const instance = new MyClass()

const instanceOfType = VueTypes.instanceOf(MyClass).def(instance).isRequired
instanceOfType.type = MyClass

const oneOfTypeType = VueTypes.oneOfType([
  String,
  {
    type: String,
  },
  VueTypes.number,
])

const ArrayOfType = VueTypes.arrayOf(VueTypes.string).def(['string', 'string'])
  .isRequired

const ObjectOfType = VueTypes.objectOf(VueTypes.string).def({
  prop: 'test',
}).isRequired

const ObjectOfType2 = VueTypes.objectOf(VueTypes.oneOf([1, 2, 3] as const)).def(
  {
    prop: 1,
  },
).isRequired

interface User {
  name: string
  surname: string
  age: number
  hobbies: any[]
}

const shapeType = VueTypes.shape<User>({
  name: String,
  surname: { type: String, default: 'Doe' },
  age: VueTypes.number,
  hobbies: VueTypes.array,
}).def({ name: 'test', age: 100, hobbies: [true] }).isRequired

const shapeTypeLoose = VueTypes.shape({
  name: String,
  surname: { type: String, default: 'Doe' },
  age: VueTypes.number,
  hobbies: VueTypes.oneOf(['climbing', 'coding'] as const),
}).loose.def({ nationality: 'unknown' }).isRequired

shapeType.type = Object

VueTypes.sensibleDefaults = {}
VueTypes.sensibleDefaults = false
VueTypes.sensibleDefaults = true

interface CustomVueTypes extends VueTypesInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly test: VueTypeValidableDef<any>
  readonly user: typeof shapeType
}

// extending
const myTypes = VueTypes.extend<CustomVueTypes>([
  {
    name: 'test',
    validate: true,
    getter: true,
  },
  {
    name: 'user',
    type: shapeType,
    getter: true,
  },
])

;(VueTypes as CustomVueTypes).test.isRequired

myTypes.test.isRequired
myTypes.test.isRequired

const a = myTypes.user.def({ name: 'xxx' })
const str = myTypes.string

const projectString = ProjectTypes.string.isRequired
const pjMax = ProjectTypes.maxLength(2)
const pjpositive = ProjectTypes.positive

const NativeComponent = defineComponent({
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

const OtherTypesComponent = defineComponent({
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

createApp({ render: () => h(OtherTypesComponent) })

// @Component
// class ClassComponent extends NativeComponent {
//   public msg = 10
// }

// new Vue({
//   render: (h: CreateElement) =>
//     h(ClassComponent, {
//       props: {
//         verified: true,
//         user: { ID: 10, name: 'me' },
//       },
//     }),
// })
