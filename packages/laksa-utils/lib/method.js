"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var R = _interopRequireWildcard(require("ramda"));

var _validator = require("./validator");

var _transformer = require("./transformer");

var validatorArray = {
  isNumber: [_validator.isNumber],
  isString: [_validator.isString],
  isBoolean: [_validator.isBoolean],
  isArray: [_validator.isArray],
  isJson: [_validator.isJson],
  isObject: [_validator.isObject],
  isFunction: [_validator.isFunction],
  isHash: [_validator.isHash],
  isUrl: [_validator.isUrl],
  isPubkey: [_validator.isPubkey],
  isPrivateKey: [_validator.isPrivateKey],
  isBN: [_validator.isBN],
  isAddress: [_validator.isAddress]
};
var transformerArray = {
  toBn: _transformer.toBN,
  toNumber: function toNumber(string) {
    return Number(string);
  },
  toString: function toString(string) {
    return String(string);
  }
};

var Method = function Method(options) {
  var _this = this;

  (0, _classCallCheck2.default)(this, Method);
  (0, _defineProperty2.default)(this, "setMessanger", function (msg) {
    _this.messanger = msg;
  });
  (0, _defineProperty2.default)(this, "generateValidateObjects", function () {
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
  (0, _defineProperty2.default)(this, "validateArgs", function (args, requiredArgs, optionalArgs) {
    var reArgs = requiredArgs === undefined ? {} : requiredArgs;
    var opArgs = optionalArgs === undefined ? {} : optionalArgs;

    if (args && _this.params !== {}) {
      return (0, _validator.validateArgs)(args, reArgs, opArgs);
    }

    return true;
  });
  (0, _defineProperty2.default)(this, "extractParams", function (args) {
    var paramsObject = (0, _validator.isObject)(args) ? args : {};
    var result;
    var keyArrayLength = Object.keys(paramsObject).length;
    if (keyArrayLength === 0) result = [];

    if (keyArrayLength > 0 && !_this.isSendJson) {
      var resultKey = Object.keys(paramsObject)[0];
      result = [_this.transformedBeforeSend(paramsObject[resultKey], resultKey)];
    } else if (keyArrayLength > 0 && _this.isSendJson) {
      var newObject = R.map(_this.transformedBeforeSend, paramsObject);
      result = [newObject];
    }

    return result;
  });
  (0, _defineProperty2.default)(this, "transformedBeforeSend", function (value, key) {
    var transformMethod = _this.transformer[key];

    if (transformMethod !== undefined) {
      return transformerArray[transformMethod](value);
    } else return value;
  });
  (0, _defineProperty2.default)(this, "assignToObject", function (object) {
    var newObject = {};
    newObject[_this.name] = _this.methodBuilder();
    return Object.assign(object, newObject);
  });
  (0, _defineProperty2.default)(this, "methodBuilder", function () {
    if (_this.messanger !== null && _this.endpoint === 'client') {
      return function (args, callback) {
        var _this$generateValidat = _this.generateValidateObjects(),
            requiredArgs = _this$generateValidat.requiredArgs,
            optionalArgs = _this$generateValidat.optionalArgs;

        _this.validateArgs(args, requiredArgs, optionalArgs);

        var params = _this.extractParams(args);

        if (callback) {
          return _this.messanger.sendAsync({
            method: _this.call,
            params: params
          }, callback);
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

        if (callback) {
          return _this.messanger.sendAsyncServer(_this.endpoint, args, callback);
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

var _default = Method;
exports.default = _default;
module.exports = exports.default;