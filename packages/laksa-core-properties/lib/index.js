'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es6.object.assign');
require('core-js/modules/es6.function.name');
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));

var Property =
/*#__PURE__*/
function () {
  function Property(options) {
    _classCallCheck(this, Property);

    var name = options.name,
        getter = options.getter,
        setter = options.setter;
    this.name = name;
    this.getter = getter;
    this.setter = setter;
    this.messanger = null;
  }

  _createClass(Property, [{
    key: "setMessanger",
    value: function setMessanger(msg) {
      this.messanger = msg;
    }
  }, {
    key: "assignToObject",
    value: function assignToObject(object) {
      var zilName = this.name;

      var asyncGetterName = function asyncGetterName(getName) {
        return "get".concat(getName.charAt(0).toUpperCase()).concat(getName.slice(1));
      };

      var zilObject = {
        get: this.propertyBuilder(),
        enumerable: true
      };
      var newZilObject = {};
      newZilObject[asyncGetterName(zilName)] = this.propertyBuilder();
      Object.defineProperty(object, zilName, zilObject);
      Object.assign(object, newZilObject);
    }
  }, {
    key: "propertyBuilder",
    value: function propertyBuilder() {
      var _this = this;

      if (this.messanger !== null) {
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
    }
  }]);

  return Property;
}();

module.exports = Property;
