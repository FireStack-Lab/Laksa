'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
require('regenerator-runtime/runtime');
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));

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

  function interceptor(_x) {
    return _interceptor.apply(this, arguments);
  }

  function _interceptor() {
    _interceptor = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime.mark(function _callee(arg) {
      var signed;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(original && arg.bytes)) {
                _context.next = 5;
                break;
              }

              _context.next = 3;
              return this.signer.sign(arg);

            case 3:
              signed = _context.sent;
              return _context.abrupt("return", original.call(this, signed));

            case 5:
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

exports.ConnectionTimeout = ConnectionTimeout;
exports.InvalidResponse = InvalidResponse;
exports.InvalidConnection = InvalidConnection;
exports.InvalidProvider = InvalidProvider;
exports.InvalidNumberOfRPCParams = InvalidNumberOfRPCParams;
exports.format = format;
exports.sign = sign;
