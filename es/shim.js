import Vue from 'vue';
import isPlainObject from 'is-plain-object';
import { setDefaults } from './sensibles';
var dfn = Object.defineProperty;

var isArray = Array.isArray || function (value) {
  return Object.prototype.toString.call(value) === '[object Array]';
};

function type(name, props, validable) {
  if (validable === void 0) {
    validable = false;
  }

  var descriptors = {
    _vueTypes_name: {
      value: name
    },
    def: {
      value: function value(v) {
        if (v === undefined && !this.default) {
          return this;
        }

        if (isArray(v)) {
          this.default = function () {
            return [].concat(v);
          };
        } else if (isPlainObject(v)) {
          this.default = function () {
            return Object.assign({}, v);
          };
        } else {
          this.default = v;
        }

        return this;
      }
    },
    isRequired: {
      get: function get() {
        this.required = true;
        return this;
      }
    }
  };

  if (validable) {
    descriptors.validate = {
      value: function value() {}
    };
  }

  return Object.assign(Object.defineProperties({
    validator: function validator() {
      return true;
    }
  }, descriptors), props);
}

var vueTypes = setDefaults({
  utils: {
    toType: type,
    validate: function validate() {
      return true;
    }
  }
});
var typeMap = {
  func: Function,
  bool: Boolean,
  string: String,
  number: Number,
  array: Array,
  object: Object,
  arrayOf: Array,
  objectOf: Object,
  shape: Object
};
var getters = ['any', 'func', 'bool', 'string', 'number', 'array', 'object', 'symbol'];
var methods = ['oneOf', 'custom', 'instanceOf', 'oneOfType', 'arrayOf', 'objectOf'];

function createValidator(root, name, props, getter, validable) {
  var _descr;

  if (getter === void 0) {
    getter = false;
  }

  if (validable === void 0) {
    validable = false;
  }

  var prop = getter ? 'get' : 'value';
  var descr = (_descr = {}, _descr[prop] = function () {
    return type(name, props, validable).def(getter ? vueTypes.sensibleDefaults[name] : undefined);
  }, _descr);
  return dfn(root, name, descr);
}

function recurseValidator(root, getter, validable) {
  return function (name) {
    return createValidator(root, name, {
      type: typeMap[name] || null
    }, getter, validable);
  };
}

getters.forEach(recurseValidator(vueTypes, true, true));
methods.forEach(recurseValidator(vueTypes, false));
createValidator(vueTypes, 'integer', {
  type: Number
}, true); // does not have a validate method

dfn(vueTypes, 'shape', {
  value: function value() {
    return dfn(type('shape', {
      type: Object
    }), 'loose', {
      get: function get() {
        return this;
      }
    });
  }
});

vueTypes.extend = function extend(props) {
  var name = props.name,
      validate = props.validate,
      _props$getter = props.getter,
      getter = _props$getter === void 0 ? false : _props$getter,
      _props$type = props.type,
      type = _props$type === void 0 ? null : _props$type; // If we are inheriting from a custom type, let's ignore the type property

  var extType = isPlainObject(type) && type.type ? null : type;
  return createValidator(vueTypes, name, {
    type: extType
  }, getter, !!validate);
};
/* eslint-disable no-console */


if (process.env.NODE_ENV !== 'production') {
  Vue.config.silent === false && console.warn('You are using the production shimmed version of VueTypes in a development build. Refer to https://github.com/dwightjack/vue-types#production-build to learn how to configure VueTypes for usage in multiple environments.');
}
/* eslint-enable no-console */


export default vueTypes;