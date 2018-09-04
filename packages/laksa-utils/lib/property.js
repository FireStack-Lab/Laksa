"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var Property = function Property(options) {
  var _this = this;

  (0, _classCallCheck2.default)(this, Property);
  (0, _defineProperty2.default)(this, "setMessanger", function (msg) {
    _this.messanger = msg;
  });
  (0, _defineProperty2.default)(this, "assignToObject", function (object) {
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
  (0, _defineProperty2.default)(this, "propertyBuilder", function () {
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