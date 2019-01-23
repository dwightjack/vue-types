import { setDefaults } from './sensibles';

var type = function type() {
  return {
    def: function def(v) {
      this.default = v;
      return this;
    },

    get isRequired() {
      this.required = true;
      return this;
    },

    validator: function validator() {}
  };
};

var vueTypes = setDefaults({
  utils: {
    toType: type,
    validate: function validate() {
      return true;
    }
  }
});

var createValidator = function createValidator(root, name, getter) {
  var _descr;

  if (getter === void 0) {
    getter = false;
  }

  var prop = getter ? 'get' : 'value';
  var descr = (_descr = {}, _descr[prop] = function () {
    return type().def(getter ? vueTypes.sensibleDefaults[name] : undefined);
  }, _descr);
  return Object.defineProperty(root, name, descr);
};

var getters = ['any', 'func', 'bool', 'string', 'number', 'array', 'object', 'integer', 'symbol'];
var methods = ['oneOf', 'custom', 'instanceOf', 'oneOfType', 'arrayOf', 'objectOf'];
getters.forEach(function (p) {
  return createValidator(vueTypes, p, true);
});
methods.forEach(function (p) {
  return createValidator(vueTypes, p, false);
});
Object.defineProperty(vueTypes, 'shape', {
  value: function value() {
    return Object.defineProperty(type(), 'loose', {
      get: function get() {
        return this;
      },
      enumerable: false
    });
  }
});
export default vueTypes;