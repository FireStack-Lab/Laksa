'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es6.object.assign');
require('core-js/modules/web.dom.iterable');
require('core-js/modules/es6.array.iterator');
require('core-js/modules/es6.object.keys');
require('core-js/modules/es6.function.name');
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
require('core-js/modules/es6.number.constructor');
var laksaUtils = require('laksa-utils');

var validatorArray = {
  isNumber: [laksaUtils.isNumber],
  isString: [laksaUtils.isString],
  isBoolean: [laksaUtils.isBoolean],
  isArray: [laksaUtils.isArray],
  isJson: [laksaUtils.isJson],
  isObject: [laksaUtils.isObject],
  isFunction: [laksaUtils.isFunction],
  isHash: [laksaUtils.isHash],
  isUrl: [laksaUtils.isUrl],
  isPubkey: [laksaUtils.isPubkey],
  isPrivateKey: [laksaUtils.isPrivateKey],
  isBN: [laksaUtils.isBN],
  isAddress: [laksaUtils.isAddress]
};
var transformerArray = {
  toBn: laksaUtils.toBN,
  toNumber: function toNumber(string) {
    return Number(string);
  },
  toString: function toString(string) {
    return String(string);
  }
};

var Method =
/*#__PURE__*/
function () {
  function Method(options) {
    _classCallCheck(this, Method);

    var name = options.name,
        call = options.call,
        params = options.params,
        endpoint = options.endpoint,
        transformer = options.transformer,
        isSendJson = options.isSendJson;
    this.name = name;
    this.call = call;
    this.messanger = null;
    this.params = params;
    this.transformer = transformer || {};
    this.endpoint = endpoint || 'client';
    this.isSendJson = isSendJson || false;
  }

  _createClass(Method, [{
    key: "setMessanger",
    value: function setMessanger(msg) {
      this.messanger = msg;
    }
  }, {
    key: "generateValidateObjects",
    value: function generateValidateObjects() {
      var validatorObject = this.params;
      var requiredArgs = {};
      var optionalArgs = {};

      for (var index in validatorObject) {
        if (index !== undefined) {
          var newObjectKey = index;
          var newObjectValid = validatorObject[index][0];
          var isRequired = validatorObject[index][1];

          if (isRequired === 'required') {
            requiredArgs[newObjectKey] = validatorArray[newObjectValid];
          } else {
            optionalArgs[newObjectKey] = validatorArray[newObjectValid];
          }
        }
      }

      return {
        requiredArgs: requiredArgs,
        optionalArgs: optionalArgs
      };
    }
  }, {
    key: "validateArgs",
    value: function validateArgs(args, requiredArgs, optionalArgs) {
      var reArgs = requiredArgs === undefined ? {} : requiredArgs;
      var opArgs = optionalArgs === undefined ? {} : optionalArgs;

      if (args && this.params !== {}) {
        return laksaUtils.validateArgs(args, reArgs, opArgs);
      }

      return true;
    }
  }, {
    key: "extractParams",
    value: function extractParams(args) {
      var _this = this;

      var paramsObject = laksaUtils.isObject(args) ? args : {};
      var result;
      var keyArrayLength = Object.keys(paramsObject).length;
      if (keyArrayLength === 0) result = [];

      if (keyArrayLength === 1 && !this.isSendJson) {
        var resultKey = Object.keys(paramsObject)[0];
        result = [this.transformedBeforeSend(paramsObject[resultKey], resultKey)];
      } else if (keyArrayLength > 0 && this.isSendJson) {
        var newObject = {};
        Object.keys(paramsObject).map(function (k) {
          newObject[k] = _this.transformedBeforeSend(paramsObject[k], k);
          return false;
        });
        result = [newObject];
      }

      return result;
    }
  }, {
    key: "transformedBeforeSend",
    value: function transformedBeforeSend(value, key) {
      var transformMethod = this.transformer[key];

      if (transformMethod !== undefined) {
        return transformerArray[transformMethod](value);
      } else return value;
    }
  }, {
    key: "assignToObject",
    value: function assignToObject(object) {
      var newObject = {};
      newObject[this.name] = this.methodBuilder();
      return Object.assign(object, newObject);
    }
  }, {
    key: "methodBuilder",
    value: function methodBuilder() {
      var _this2 = this;

      if (this.messanger !== null && this.endpoint === 'client') {
        return function (args, callback) {
          var _this2$generateValida = _this2.generateValidateObjects(),
              requiredArgs = _this2$generateValida.requiredArgs,
              optionalArgs = _this2$generateValida.optionalArgs;

          _this2.validateArgs(args, requiredArgs, optionalArgs);

          var params = _this2.extractParams(args);

          var newCallback = laksaUtils.isFunction(args) ? args : callback;

          if (newCallback) {
            return _this2.messanger.sendAsync({
              method: _this2.call,
              params: params
            }, newCallback);
          }

          return _this2.messanger.send({
            method: _this2.call,
            params: params
          });
        };
      }

      if (this.messanger !== null && this.endpoint !== 'client') {
        return function (args, callback) {
          var _this2$generateValida2 = _this2.generateValidateObjects(),
              requiredArgs = _this2$generateValida2.requiredArgs,
              optionalArgs = _this2$generateValida2.optionalArgs;

          _this2.validateArgs(args, requiredArgs, optionalArgs);

          var newCallback = laksaUtils.isFunction(args) ? args : callback;

          if (newCallback) {
            return _this2.messanger.sendAsyncServer(_this2.endpoint, args, newCallback);
          }

          return _this2.messanger.sendServer(_this2.endpoint, args);
        };
      }
    }
  }]);

  return Method;
}();

module.exports = Method;
