'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es6.object.assign');
require('core-js/modules/es6.function.name');
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));

var Property = function Property(options) {
  var _this = this;

  _classCallCheck(this, Property);

  _defineProperty(this, "setMessanger", function (msg) {
    _this.messanger = msg;
  });

  _defineProperty(this, "assignToObject", function (object) {
    var zilName = _this.name;

    var asyncGetterName = function asyncGetterName(getName) {
      return "get".concat(getName.charAt(0).toUpperCase()).concat(getName.slice(1));
    };

    var zilObject = {
      get: _this.propertyBuilder(),
      enumerable: true
    };
    var newZilObject = {};
    newZilObject[asyncGetterName(zilName)] = _this.propertyBuilder();
    Object.defineProperty(object, zilName, zilObject);
    Object.assign(object, newZilObject);
  });

  _defineProperty(this, "propertyBuilder", function () {
    if (_this.messanger !== null) {
      return function (callback) {
        if (callback) {
          return _this.messanger.sendAsync({
            method: _this.getter
          }, callback);
        }

        return _this.messanger.send({
          method: _this.getter
        });
      };
    }
  });

  var name = options.name,
      getter = options.getter,
      setter = options.setter;
  this.name = name;
  this.getter = getter;
  this.setter = setter;
  this.messanger = null;
};

module.exports = Property;
