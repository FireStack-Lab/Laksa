"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    Object.defineProperty(object, zilName, zilObject); //

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

var _default = Property;
exports.default = _default;
module.exports = exports.default;