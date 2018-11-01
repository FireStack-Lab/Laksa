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
    this.messenger = null;
  }
  /**
   * @function {setMessenger}
   * @param  {Messenger} msg {messenger instance}
   * @return {Messenger} {messenger setter}
   */


  _createClass(Property, [{
    key: "setMessenger",
    value: function setMessenger(msg) {
      this.messenger = msg;
    }
    /**
     * @function {assignToObject}
     * @param  {object} object {method object}
     * @return {object} {assiged to some object}
     */

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
    /**
     * @function {propertyBuilder}
     * @return {any} {property built}
     */

  }, {
    key: "propertyBuilder",
    value: function propertyBuilder() {
      var _this = this;

      if (this.messenger !== null) {
        return function (callback) {
          if (callback) {
            return _this.messenger.sendAsync({
              method: _this.getter
            }, callback);
          }

          return _this.messenger.send({
            method: _this.getter
          });
        };
      }
    }
  }]);

  return Property;
}();

module.exports = Property;
