'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es6.object.assign');
require('core-js/modules/es6.function.name');
require('core-js/modules/web.dom.iterable');
require('core-js/modules/es6.array.iterator');
require('core-js/modules/es6.object.keys');
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
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

var Method = function Method(options) {
  var _this = this;

  _classCallCheck(this, Method);

  _defineProperty(this, "setMessanger", function (msg) {
    _this.messanger = msg;
  });

  _defineProperty(this, "generateValidateObjects", function () {
    var validatorObject = _this.params;
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
  });

  _defineProperty(this, "validateArgs", function (args, requiredArgs, optionalArgs) {
    var reArgs = requiredArgs === undefined ? {} : requiredArgs;
    var opArgs = optionalArgs === undefined ? {} : optionalArgs;

    if (args && _this.params !== {}) {
      return laksaUtils.validateArgs(args, reArgs, opArgs);
    }

    return true;
  });

  _defineProperty(this, "extractParams", function (args) {
    var paramsObject = laksaUtils.isObject(args) ? args : {};
    var result;
    var keyArrayLength = Object.keys(paramsObject).length;
    if (keyArrayLength === 0) result = [];

    if (keyArrayLength === 1 && !_this.isSendJson) {
      var resultKey = Object.keys(paramsObject)[0];
      result = [_this.transformedBeforeSend(paramsObject[resultKey], resultKey)];
    } else if (keyArrayLength > 0 && _this.isSendJson) {
      var newObject = {};
      Object.keys(paramsObject).map(function (k) {
        newObject[k] = _this.transformedBeforeSend(paramsObject[k], k);
        return false;
      });
      result = [newObject];
    }

    return result;
  });

  _defineProperty(this, "transformedBeforeSend", function (value, key) {
    var transformMethod = _this.transformer[key];

    if (transformMethod !== undefined) {
      return transformerArray[transformMethod](value);
    } else return value;
  });

  _defineProperty(this, "assignToObject", function (object) {
    var newObject = {};
    newObject[_this.name] = _this.methodBuilder();
    return Object.assign(object, newObject);
  });

  _defineProperty(this, "methodBuilder", function () {
    if (_this.messanger !== null && _this.endpoint === 'client') {
      return function (args, callback) {
        var _this$generateValidat = _this.generateValidateObjects(),
            requiredArgs = _this$generateValidat.requiredArgs,
            optionalArgs = _this$generateValidat.optionalArgs;

        _this.validateArgs(args, requiredArgs, optionalArgs);

        var params = _this.extractParams(args);

        var newCallback = laksaUtils.isFunction(args) ? args : callback;

        if (newCallback) {
          return _this.messanger.sendAsync({
            method: _this.call,
            params: params
          }, newCallback);
        }

        return _this.messanger.send({
          method: _this.call,
          params: params
        });
      };
    }

    if (_this.messanger !== null && _this.endpoint !== 'client') {
      return function (args, callback) {
        var _this$generateValidat2 = _this.generateValidateObjects(),
            requiredArgs = _this$generateValidat2.requiredArgs,
            optionalArgs = _this$generateValidat2.optionalArgs;

        _this.validateArgs(args, requiredArgs, optionalArgs);

        var newCallback = laksaUtils.isFunction(args) ? args : callback;

        if (newCallback) {
          return _this.messanger.sendAsyncServer(_this.endpoint, args, newCallback);
        }

        return _this.messanger.sendServer(_this.endpoint, args);
      };
    }
  });

  var name = options.name,
      call = options.call,
      _params = options.params,
      endpoint = options.endpoint,
      transformer = options.transformer,
      isSendJson = options.isSendJson;
  this.name = name;
  this.call = call;
  this.messanger = null;
  this.params = _params;
  this.transformer = transformer || {};
  this.endpoint = endpoint || 'client';
  this.isSendJson = isSendJson || false;
};

module.exports = Method;
