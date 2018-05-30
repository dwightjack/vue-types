import Vue from 'vue';
import VueTypes, { VueTypeOneOf, VueTypeCustom } from '../index';

const noop = () => {};

const anyType = VueTypes.any;
anyType.def(0);
anyType.def('string');

const boolType = VueTypes.bool.def(true).isRequired;

const funcType = VueTypes.func.def(noop).isRequired;

const arrayType = VueTypes.array.def([]).isRequired;

const stringType = VueTypes.string.def('string').isRequired;

const numberType = VueTypes.number.def(0).isRequired;
const integerType = VueTypes.integer.def(0).isRequired;

const objectType = VueTypes.object.def({}).isRequired;

const symbolType = VueTypes.symbol.def(Symbol('foo')).isRequired;

const validator = (v: number) => true;
const customType = VueTypes.custom(validator).def(0).isRequired;

const oneOfType = VueTypes.oneOf([0, 'string', null]).def('test').isRequired;

const oneOfTypeStrict = VueTypes.oneOf<string | boolean>([true, 'string']).def(true).isRequired;
oneOfType.type = [Boolean, Number];

class MyClass {
  test = 'testProp';
}

const instance = new MyClass();

const instanceOfType = VueTypes.instanceOf(MyClass).def(instance).isRequired;
instanceOfType.type = MyClass;

const oneOfTypeType = VueTypes.oneOfType([
  String,
  {
    type: Boolean,
  },
  VueTypes.number
]).def(null).isRequired; // check can be just at runtime

const ArrayOfType = VueTypes.arrayOf(VueTypes.string).def(['test', 'string']).isRequired;

const ObjectOfType = VueTypes.objectOf<string>(VueTypes.string).def({ prop: 'test' }).isRequired;

const shapeType = VueTypes.shape({
  name: String,
  surname: { type: String, default: 'Doe' },
  age: VueTypes.number,
}).def({ name: 'test' }).loose.isRequired;

VueTypes.sensibleDefaults = false;
VueTypes.sensibleDefaults = true;
VueTypes.sensibleDefaults = {};
