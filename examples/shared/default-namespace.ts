import VueTypes, { VueTypesInterface, VueTypeValidableDef } from 'vue-types'
import { VueTypesProject } from './namespaced-extended'

const noop = (): void => undefined

export const anyType = VueTypes.any
anyType.def(0)
anyType.def('string')

export const boolType = VueTypes.bool.def(true).isRequired
export const funcType = VueTypes.func.def(noop).isRequired
export const arrayType = VueTypes.array.def([]).isRequired
export const arrayType2 = VueTypes.array.def(() => []).isRequired
export const stringType = VueTypes.string.def('John').isRequired
export const stringTypeValidate = VueTypes.string
  .def('John')
  .isRequired.validate((v: unknown): boolean => v === 'John')

export const numberType = VueTypes.number.def(0).isRequired
export const integerType = VueTypes.integer.def(0).isRequired

export const objectType = VueTypes.object.def({ demo: true }).isRequired
export const objectType2 = VueTypes.object.def(() => true).isRequired //FIXME: why this does not break?

export interface Account {
  name: string
  ID: number
}

export const userType = VueTypes.object.def({
  ID: 1,
  name: 'me',
})

export const symbolType = VueTypes.symbol.def(Symbol('foo')).isRequired

const validator = (v: number) => v > 18
export const customType = VueTypes.custom(validator).def(0).isRequired

export const customTypeStrict =
  VueTypes.custom<number>(validator).def(0).isRequired

export const oneOf = VueTypes.oneOf([0, 'string', null]).def(2).isRequired

export const oneOfStrict = VueTypes.oneOf([true, 'string'] as const).def(
  'string',
).isRequired

class MyClass {
  public test = 'testProp'
}

const instance = new MyClass()

export const instanceOfType =
  VueTypes.instanceOf(MyClass).def(instance).isRequired
instanceOfType.type = MyClass

export const oneOfTypeType = VueTypes.oneOfType([
  String,
  {
    type: String,
  },
  VueTypes.number,
])

export const ArrayOfType = VueTypes.arrayOf(VueTypes.string).def([
  'string',
  'string',
]).isRequired

export const ObjectOfType = VueTypes.objectOf(VueTypes.string).def({
  prop: 'test',
}).isRequired

export const ObjectOfType2 = VueTypes.objectOf(
  VueTypes.oneOf([1, 2, 3] as const),
).def({
  prop: 1,
}).isRequired

interface User {
  name: string
  surname: string
  age: number
  hobbies: any[]
}

export const shapeType = VueTypes.shape<User>({
  name: String,
  surname: { type: String, default: 'Doe' },
  age: VueTypes.number,
  hobbies: VueTypes.array,
}).def({ name: 'test', age: 100, hobbies: [true] }).isRequired

export const shapeTypeLoose = VueTypes.shape({
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
export const myTypes = VueTypes.extend<CustomVueTypes>([
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

export const a = myTypes.user.def({ name: 'xxx' })
export const str = myTypes.string

export const projectString = VueTypesProject.string.isRequired
export const pjMax = VueTypesProject.maxLength(2)
export const pjpositive = VueTypesProject.positive
