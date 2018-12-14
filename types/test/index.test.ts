import Vue from 'vue';
import Component from 'vue-class-component';
import VueTypes from '../index';

const noop = () => { };

const anyType = VueTypes.any;
anyType.def(0);
anyType.def('string');

const boolType = VueTypes.bool.def(true).isRequired;

const funcType = VueTypes.func.def(noop).isRequired;

const arrayType = VueTypes.array.def([]).isRequired;
const arrayType2 = VueTypes.array.def(() => []).isRequired;

const stringType = VueTypes.string.def('John').isRequired;

const numberType = VueTypes.number.def(0).isRequired;
const integerType = VueTypes.integer.def(0).isRequired;

const objectType = VueTypes.object.def({ demo: true }).isRequired;
const objectType2 = VueTypes.object.def(() => { }).isRequired;

const symbolType = VueTypes.symbol.def(Symbol('foo')).isRequired;

const validator = (v: number) => v > 18;
const customType = VueTypes.custom(validator).def(0).isRequired;

const customTypeStrict = VueTypes.custom<number>(validator).def(0).isRequired;

const oneOfType = VueTypes.oneOf([0, 'string', null]).def('test').isRequired;

const oneOfTypeStrict = VueTypes.oneOf<string | boolean>([true, 'string']).def(true).isRequired;

class MyClass {
  test = 'testProp';
}

const instance = new MyClass();

const instanceOfType = VueTypes.instanceOf(MyClass).def(instance).isRequired;
instanceOfType.type = MyClass;

const oneOfTypeType = VueTypes.oneOfType([
  String,
  {
    type: String
  },
  VueTypes.number
]).def(null).isRequired; // check can be just at runtime

const ArrayOfType = VueTypes.arrayOf(VueTypes.string).def(['test', 'string']).isRequired;

const ObjectOfType = VueTypes.objectOf<string>(VueTypes.string).def({ prop: 'test' }).isRequired;

const shapeType = VueTypes.shape({
  name: String,
  surname: { type: String, default: 'Doe' },
  age: VueTypes.number,
}).def({ name: 'test' }).isRequired;

const shapeTypeLoose = VueTypes.shape({
  name: String,
  surname: { type: String, default: 'Doe' },
  age: VueTypes.number,
}).loose.def({ nationality: 'unknown' }).isRequired;

shapeType.type = Object;

VueTypes.sensibleDefaults = {};
VueTypes.sensibleDefaults = false;
VueTypes.sensibleDefaults = true;

const BaseComponent = Vue.extend({
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
    ageLimit: customTypeStrict,
    colors: VueTypes.oneOf(['red', 'blue']),
    userType: instanceOfType,
    fieldWithText: VueTypes.oneOfType([String, VueTypes.string]),
    friendsId: VueTypes.arrayOf(VueTypes.number).isRequired,
    simpleObj: ObjectOfType,
    meta: shapeType,
    extendedMeta: shapeTypeLoose
  }
});

@Component({
  props: {
    verified: boolType,
    funcProp: funcType,
    hobbies: arrayType,
    name: stringType,
    height: numberType,
    age: integerType,
    obj: objectType,
    uniqueSym: symbolType,
    ageLimit: customTypeStrict,
    colors: VueTypes.oneOf(['red', 'blue']),
    userType: instanceOfType,
    fieldWithText: VueTypes.oneOfType([String, VueTypes.string]),
    friendsId: VueTypes.arrayOf(VueTypes.number).isRequired,
    simpleObj: ObjectOfType,
    meta: shapeType,
    extendedMeta: shapeTypeLoose
  }
})
class ClassComponent extends Vue {
  msg = 10;
}
