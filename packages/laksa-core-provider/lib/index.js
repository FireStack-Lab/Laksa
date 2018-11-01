'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es6.regexp.constructor');
var _slicedToArray = _interopDefault(require('@babel/runtime/helpers/slicedToArray'));
var _toConsumableArray = _interopDefault(require('@babel/runtime/helpers/toConsumableArray'));
require('core-js/modules/web.dom.iterable');
require('core-js/modules/es6.array.iterator');
require('core-js/modules/es6.map');
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
require('core-js/modules/es7.symbol.async-iterator');
require('core-js/modules/es6.symbol');
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
var _objectSpread = _interopDefault(require('@babel/runtime/helpers/objectSpread'));
require('regenerator-runtime/runtime');
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
require('core-js/modules/es6.promise');
var fetch = _interopDefault(require('cross-fetch'));

var MiddlewareType = {
  REQ: Symbol('REQ'),
  RES: Symbol('RES')
};

var BaseProvider =
/*#__PURE__*/
function () {
  function BaseProvider() {
    var _this = this;

    var reqMiddleware = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Map();
    var resMiddleware = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Map();

    _classCallCheck(this, BaseProvider);

    _defineProperty(this, "middleware", {
      request: {
        use: function use(fn) {
          var match = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '*';
          return _this.pushMiddleware(fn, MiddlewareType.REQ, match);
        }
      },
      response: {
        use: function use(fn) {
          var match = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '*';
          return _this.pushMiddleware(fn, MiddlewareType.RES, match);
        }
      }
    });

    this.reqMiddleware = reqMiddleware;
    this.resMiddleware = resMiddleware;
  }

  _createClass(BaseProvider, [{
    key: "pushMiddleware",
    value: function pushMiddleware(fn, type, match) {
      if (type !== MiddlewareType.REQ && type !== MiddlewareType.RES) {
        throw new Error('Please specify the type of middleware being added');
      }

      if (type === MiddlewareType.REQ) {
        var current = this.reqMiddleware.get(match) || [];
        this.reqMiddleware.set(match, _toConsumableArray(current).concat([fn]));
      } else {
        var _current = this.resMiddleware.get(match) || [];

        this.resMiddleware.set(match, _toConsumableArray(_current).concat([fn]));
      }
    }
  }, {
    key: "getMiddleware",
    value: function getMiddleware(method) {
      var reqFns = [];
      var resFns = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.reqMiddleware.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              key = _step$value[0],
              transformers = _step$value[1];

          if (typeof key === 'string' && key !== '*' && key === method) {
            reqFns.push.apply(reqFns, _toConsumableArray(transformers));
          }

          if (key instanceof RegExp && key.test(method)) {
            reqFns.push.apply(reqFns, _toConsumableArray(transformers));
          }

          if (key === '*') {
            reqFns.push.apply(reqFns, _toConsumableArray(transformers));
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.resMiddleware.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _step2$value = _slicedToArray(_step2.value, 2),
              key = _step2$value[0],
              transformers = _step2$value[1];

          if (typeof key === 'string' && key !== '*' && key === method) {
            resFns.push.apply(resFns, _toConsumableArray(transformers));
          }

          if (key instanceof RegExp && key.test(method)) {
            resFns.push.apply(resFns, _toConsumableArray(transformers));
          }

          if (key === '*') {
            resFns.push.apply(resFns, _toConsumableArray(transformers));
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return [reqFns, resFns];
    }
  }]);

  return BaseProvider;
}();

var DEFAULT_TIMEOUT = 120000;
var DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
};

function _fetch(fetchPromise, timeout) {
  var abortFn = null;
  var abortPromise = new Promise(function (resolve, reject) {
    abortFn = function abortFn() {
      return reject(new Error("request Timeout in ".concat(timeout, " ms")));
    };
  });
  var abortablePromise = Promise.race([fetchPromise, abortPromise]);
  setTimeout(function () {
    abortFn();
  }, timeout);
  return abortablePromise;
}

var performRPC =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(request, handler) {
    var response;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _fetch(fetch(request.url, {
              method: request.options && request.options.method ? request.options.method : 'POST',
              cache: 'no-cache',
              mode: 'cors',
              redirect: 'follow',
              referrer: 'no-referrer',
              body: JSON.stringify(request.payload),
              headers: _objectSpread({}, DEFAULT_HEADERS, request.options && request.options.headers ? request.options.headers : {})
            }), request.options && request.options.timeout ? request.options.timeout : DEFAULT_TIMEOUT);

          case 3:
            response = _context.sent;
            return _context.abrupt("return", response.json().then(function (body) {
              return _objectSpread({}, body, {
                req: request
              });
            }).then(handler));

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            throw _context.t0;

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 7]]);
  }));

  return function performRPC(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var composeMiddleware = function composeMiddleware() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  if (fns.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (fns.length === 1) {
    return fns[0];
  }

  return fns.reduce(function (a, b) {
    return function (arg) {
      return a(b(arg));
    };
  });
};

exports.BaseProvider = BaseProvider;
exports.performRPC = performRPC;
exports.composeMiddleware = composeMiddleware;
