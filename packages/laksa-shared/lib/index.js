'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
require('regenerator-runtime/runtime');
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
require('core-js/modules/es6.number.constructor');
var laksaUtils = require('laksa-utils');
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));

var ConnectionTimeout = function ConnectionTimeout(ms) {
  return new Error("CONNECTION TIMEOUT: timeout of ".concat(ms, " ms achived"));
};

var InvalidNumberOfRPCParams = function InvalidNumberOfRPCParams() {
  return new Error('Invalid number of input parameters to RPC method');
};

var InvalidConnection = function InvalidConnection(host) {
  return new Error("CONNECTION ERROR: Couldn't connect to node ".concat(host, "."));
};

var InvalidProvider = function InvalidProvider() {
  return new Error('Provider not set or invalid');
};

var InvalidResponse = function InvalidResponse(result) {
  var message = !!result && !!result.error && !!result.error.message ? result.error.message : "Invalid JSON RPC response: ".concat(JSON.stringify(result));
  return new Error(message);
};

/* eslint-disable no-param-reassign */
var format = function format(input, output) {
  return function (target, key, descriptor) {
    var method = descriptor.value;

    descriptor.value = function () {
      var rawOutput = method(input.apply(void 0, arguments));
      return output(rawOutput);
    };
  };
};

/* eslint-disable no-param-reassign */

/**
 * sign
 *
 * This decorates a method by attempting to sign the first argument of the
 * intercepted method.
 *
 * @param {T} target
 * @param {K} key
 * @param {PropertyDescriptor} descriptor
 * @returns {PropertyDescriptor | undefined}
 */
var sign = function sign(target, key, descriptor) {
  var original = descriptor.value;

  function interceptor(_x, _x2) {
    return _interceptor.apply(this, arguments);
  }

  function _interceptor() {
    _interceptor = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime.mark(function _callee(arg, _ref) {
      var signer, password, signed;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              signer = _ref.signer, password = _ref.password;

              if (!(original && arg.bytes)) {
                _context.next = 6;
                break;
              }

              _context.next = 4;
              return signer.sign(arg, password);

            case 4:
              signed = _context.sent;
              return _context.abrupt("return", original.call(this, signed));

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));
    return _interceptor.apply(this, arguments);
  }

  descriptor.value = interceptor;
  return descriptor;
};

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
  isLong: [laksaUtils.isLong],
  isAddress: [laksaUtils.isAddress]
};
var transformerArray = {
  toBN: function toBN(number) {
    return new laksaUtils.BN(number);
  },
  toNumber: function toNumber(string) {
    return Number(string);
  },
  toString: function toString(string) {
    return String(string);
  }
  /**
   * @function {generateValidateObjects}
   * @return {object} {validate object}
   */

};
function generateValidateObjects(validatorObject) {
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
/* eslint-disable no-param-reassign */

var assertObject = function assertObject(input) {
  return function (target, key, descriptor) {
    var _generateValidateObje = generateValidateObjects(input),
        requiredArgs = _generateValidateObje.requiredArgs,
        optionalArgs = _generateValidateObje.optionalArgs;

    var original = descriptor.value;

    function interceptor() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      laksaUtils.validateArgs(args[0], requiredArgs, optionalArgs);
      return original.apply(this, args);
    }

    descriptor.value = interceptor;
    return descriptor;
  };
};

var Core =
/*#__PURE__*/
function () {
  function Core(messenger, signer, status) {
    _classCallCheck(this, Core);

    this.messenger = messenger;
    this.signer = signer;
    this.status = status;
  }

  _createClass(Core, [{
    key: "setMessenger",
    value: function setMessenger(p) {
      this.messenger = p;
    }
  }, {
    key: "getMessenger",
    value: function getMessenger() {
      return this.messenger;
    }
  }, {
    key: "setSigner",
    value: function setSigner(s) {
      this.signer = s;
    }
  }, {
    key: "getSigner",
    value: function getSigner() {
      return this.signer;
    }
  }, {
    key: "setStatus",
    value: function setStatus(s) {
      this.status = s;
    }
  }, {
    key: "getStatus",
    value: function getStatus() {
      return this.status;
    }
  }]);

  return Core;
}();

exports.ConnectionTimeout = ConnectionTimeout;
exports.InvalidResponse = InvalidResponse;
exports.InvalidConnection = InvalidConnection;
exports.InvalidProvider = InvalidProvider;
exports.InvalidNumberOfRPCParams = InvalidNumberOfRPCParams;
exports.format = format;
exports.sign = sign;
exports.validatorArray = validatorArray;
exports.transformerArray = transformerArray;
exports.generateValidateObjects = generateValidateObjects;
exports.assertObject = assertObject;
exports.Core = Core;
