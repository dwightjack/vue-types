"use strict";

exports.__esModule = true;
exports.default = void 0;

var _sensibles = require("./sensibles");

var type = function type(props) {
  return Object.assign({
    def: function def(v) {
      this.default = v;
      return this;
    },

    get isRequired() {
      this.required = true;
      return this;
    },

    validator: function validator() {}
  }, props);
};

var vueTypes = (0, _sensibles.setDefaults)({
  utils: {
    toType: type,
    validate: function validate() {
      return true;
    }
  }
});

var createValidator = function createValidator(root, name, getter, props) {
  var _descr;

  if (getter === void 0) {
    getter = false;
  }

  var prop = getter ? 'get' : 'value';
  var descr = (_descr = {}, _descr[prop] = function () {
    return type(props).def(getter ? vueTypes.sensibleDefaults[name] : undefined);
  }, _descr);
  return Object.defineProperty(root, name, descr);
};

var getters = ['any', 'func', 'bool', 'string', 'number', 'array', 'object', 'symbol'];
var methods = ['oneOf', 'custom', 'instanceOf', 'oneOfType', 'arrayOf', 'objectOf'];
getters.forEach(function (p) {
  return createValidator(vueTypes, p, true, {
    validate: function validate() {}
  });
});
methods.forEach(function (p) {
  return createValidator(vueTypes, p, false);
});
createValidator(vueTypes, 'integer', true); // does not have a validate method

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

vueTypes.extend = function (props) {
  var name = props.name,
      validate = props.validate,
      _props$getter = props.getter,
      getter = _props$getter === void 0 ? false : _props$getter;
  return createValidator(vueTypes, name, getter, validate && {
    validate: function validate() {}
  });
};

var _default = vueTypes;
exports.default = _default;