import Vue from 'vue';
import VueTypes from '../index';

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

const oneOfType = VueTypes.oneOf([0, 'string', null]).def(10).isRequired;

const shapeType = VueTypes.shape({
  name: String,
  surname: { type: String, default: 'Doe' },
  age: VueTypes.number,
}).def({}).loose.isRequired;

VueTypes.sensibleDefaults = false;
VueTypes.sensibleDefaults = true;
VueTypes.sensibleDefaults = {};
