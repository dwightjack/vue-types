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
} from 'vue-types'

/**
 * `any` validator examples
 */
export const anyType = any()
export const anyTypeCast = any<unknown>()

/**
 * `func` validator examples
 */
type OnClick = (e: MouseEvent) => void
export const funcType = func<OnClick>().def((e: Event) => {
  e.target
})

/**
 * `bool` validator examples
 */
export const boolType = bool().isRequired
export const boolTypeDef = boolType.def(true)

/**
 * `string` validator examples
 */
enum IntsWords {
  One = 'One',
  Two = 'Two',
}
export const stringType = string().isRequired
export const messageType = string().isRequired
export const stringUnionType = string<'one' | 'two'>().def('one')
export const stringEnumType = string<IntsWords>().def(IntsWords.One)
export const stringEnumTypeTS41 = string<`${IntsWords}`>().def(IntsWords.One)

/**
 * `number` validator examples
 */
export const numberType = number().isRequired
export const numberUnionType = number<1 | 2>().def(1)
export const ageType = number().isRequired.def(20).def(10)

/**
 * `array` validator examples
 */
export const arrayType = array().def([1, 2, 3])
export const arrayStringType = array<string>().def(['a'])

/**
 * `object` validator examples
 */
interface User {
  ID: number
  name: string
}
export const userType = object<User>().def({ ID: 1, name: 'John' })

/**
 * `custom` validator examples
 */
export const customType = custom<string>(
  (v) => typeof v === 'string' && v.length > 0,
)

type Pair = [string, number]
export const tupleType = custom<Pair>(
  ([a, b]) => typeof a === 'string' && typeof b === 'number',
)

/**
 * `oneOf` validator examples
 */
export const oneOfTuple = oneOf([1, 2, 'string'] as const).def(1)
interface OneUser {
  name: string
}
const oneObj: OneUser = {
  name: 'John',
}

export const oneOfInstances = oneOf(['hello', oneObj] as const)

oneOf(['large', 'medium'] as const)

/**
 * `oneOfType` validator examples
 */
type stringTuple = 'one' | 'two'
type UserOneOf = { name: string }
export const stringOrNumberOrBoolType = oneOfType([
  { type: String },
  Number,
  bool(),
])

export const stringOrObject = oneOfType([String, Object])
export const stringOrObjectCast = oneOfType<string | UserOneOf>([
  String,
  Object,
])
export const stringOrCastedObject = oneOfType([String, object<UserOneOf>()])

export const castedStringOrCastedObject = oneOfType([
  string<stringTuple>(),
  object<UserOneOf>(),
]).def('one')

/**
 * `arrayOf` validator examples
 */
export const arrayOfStringsType = arrayOf(string())
export const arrayOfTypedStringsType = arrayOf(string<'one' | 'two'>())
export const arrayofUsersType = arrayOf(userType)
export const arrayOfStringsType2 = arrayOf(String)
export const arrayOfMultipleType = arrayOf(stringOrNumberOrBoolType).def(['a'])
export const arrayOfVueProp = arrayOf({ type: [String, Number] })
type UserArrayOf = { name: string }

export const arrayOfCastedTypes = arrayOf(
  oneOfType([object<UserArrayOf>(), array<string>()]),
)

/**
 * `instanceOf` validator examples
 */
class Demo {
  id = 10
}
export const instanceOfDemo = instanceOf(Demo).def(() => new Demo())
export const instanceOfDemo2 = instanceOf(Demo).def(new Demo())

/**
 * `objectOf` validator examples
 */
export const objectOfString = objectOf(arrayOf(String))
export const objectOfTuple = objectOf(tupleType)

/**
 * `shape` validator examples
 */

export const userAsShape = shape<User>({ ID: Number, name: string() }).def({
  ID: 1,
  name: 'aaa',
})

export const userAsLooseShape = shape<User>({
  ID: Number,
  name: String,
}).loose.def({
  ID: 1,
  name: 'aaa',
  ops: true,
})

/**
 * `toType` validator examples
 */
function minMax(min: number, max: number) {
  return toType<number>('minmax', {
    type: Number,
    validator(v) {
      return v > min && v < max
    },
  })
}
export const scoreType = minMax(10, 200).isRequired

/**
 * `fromType` validator examples
 */

export const looseClone = fromType('looseClone', userAsShape).loose
export const messageTypeClone = fromType('message', messageType)
export const messageTypeClone2 = fromType('message', messageType, {
  default: 'sss',
})
