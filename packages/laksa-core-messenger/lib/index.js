/**
 * This source code is being disclosed to you solely for the purpose of your participation in
 * testing Zilliqa and Laksa. You may view, compile and run the code for that purpose and pursuant to
 * the protocols and algorithms that are programmed into, and intended by, the code. You may
 * not do anything else with the code without express permission from Zilliqa Research Pte. Ltd.,
 * including modifying or publishing the code (or any part of it), and developing or forming
 * another public or private blockchain network. This source code is provided ‘as is’ and no
 * warranties are given as to title or non-infringement, merchantability or fitness for purpose
 * and, to the extent permitted by law, all liability for your use of the code is disclaimed.
 * Some programs in this code are governed by the GNU General Public License v3.0 (available at
 * https://www.gnu.org/licenses/gpl-3.0.en.html) (‘GPLv3’). The programs that are governed by
 * GPLv3.0 are those programs that are located in the folders src/depends and tests/depends
 * and which include a reference to GPLv3 in their program files.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
var _objectSpread = _interopDefault(require('@babel/runtime/helpers/objectSpread'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
require('regenerator-runtime/runtime');
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
var laksaShared = require('laksa-shared');
var laksaUtils = require('laksa-utils');

var JsonRpc = function JsonRpc() {
  var _this = this;

  _classCallCheck(this, JsonRpc);

  _defineProperty(this, "toPayload", function (method, params) {
    // FIXME: error to be done by shared/errors
    if (!method) throw new Error('jsonrpc method should be specified!'); // advance message ID

    _this.messageId += 1;
    return {
      jsonrpc: '2.0',
      id: _this.messageId,
      method: method,
      params: params !== undefined ? [params] : []
    };
  });

  this.messageId = 0;
}
/**
 * @function {toPayload}
 * @param  {string} method {RPC method}
 * @param  {Array<object>} params {params that send to RPC}
 * @return {object} {payload object}
 */
;

var ResponseMiddleware =
/*#__PURE__*/
function () {
  function ResponseMiddleware(ResponseBody) {
    _classCallCheck(this, ResponseMiddleware);

    this.result = ResponseBody.result;
    this.error = ResponseBody.error;
    this.raw = ResponseBody;
  }

  _createClass(ResponseMiddleware, [{
    key: "getResult",
    get: function get() {
      return typeof this.result === 'string' ? this.result : _objectSpread({}, this.result, {
        responseType: 'result'
      });
    }
  }, {
    key: "getError",
    get: function get() {
      return typeof this.error === 'string' ? this.error : _objectSpread({}, this.error, {
        responseType: 'error'
      });
    }
  }, {
    key: "getRaw",
    get: function get() {
      return _objectSpread({}, this.raw, {
        responseType: 'raw'
      });
    }
  }]);

  return ResponseMiddleware;
}();

/**
 * @function getResultForData
 * @param  {object} data {object get from provider}
 * @return {object} {data result or data}
 */
function getResultForData(data) {
  if (data.result) return data.getResult;
  if (data.error) return data.getError;
  return data.getRaw;
}

var defaultConfig = {
  Default: {
    CHAIN_ID: 0,
    Network_ID: 'Default',
    nodeProviderUrl: 'http://localhost:4201'
  },
  Staging: {
    CHAIN_ID: 63,
    Network_ID: 'Staging',
    nodeProviderUrl: 'https://staging-api.aws.z7a.xyz'
  },
  DevNet: {
    CHAIN_ID: 333,
    Network_ID: 'DevNet',
    nodeProviderUrl: 'https://dev-api.zilliqa.com'
  },
  TestNet: {
    CHAIN_ID: 2,
    Network_ID: 'TestNet',
    nodeProviderUrl: 'https://api.zilliqa.com'
  },
  MainNet: {
    CHAIN_ID: 1,
    Network_ID: 'MainNet',
    nodeProviderUrl: 'https://api.zilliqa.com'
  }
};

var Messenger =
/*#__PURE__*/
function () {
  function Messenger(provider, config) {
    var _this = this;

    _classCallCheck(this, Messenger);

    _defineProperty(this, "send",
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(method, params) {
        var payload, result;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this.providerCheck();

                _context.prev = 1;
                payload = _this.JsonRpc.toPayload(method, params);

                _this.setResMiddleware(function (data) {
                  return new ResponseMiddleware(data);
                });

                _context.next = 6;
                return _this.provider.send(payload);

              case 6:
                result = _context.sent;
                return _context.abrupt("return", getResultForData(result));

              case 10:
                _context.prev = 10;
                _context.t0 = _context["catch"](1);
                throw new Error(_context.t0);

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 10]]);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());

    _defineProperty(this, "sendServer",
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2(endpoint, data) {
        var result;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this.providerCheck();

                _context2.prev = 1;
                _context2.next = 4;
                return _this.scillaProvider.sendServer(endpoint, data);

              case 4:
                result = _context2.sent;
                return _context2.abrupt("return", result);

              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2["catch"](1);
                throw new Error(_context2.t0);

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[1, 8]]);
      }));

      return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
      };
    }());

    this.provider = provider;
    this.scillaProvider = provider;
    this.config = config || defaultConfig;
    this.Network_ID = this.setNetworkID(this.config.Default.Network_ID);
    this.JsonRpc = new JsonRpc();
  }
  /**
   * @function {send}
   * @param  {object} data {data object with method and params}
   * @return {object|Error} {result from provider}
   */


  _createClass(Messenger, [{
    key: "setProvider",

    /**
     * @function {setProvider}
     * @param  {Provider} provider {provider instance}
     * @return {Provider} {provider setter}
     */
    value: function setProvider(provider) {
      this.provider = provider;
    }
    /**
     * @function {setScillaProvider}
     * @param  {Provider} provider {provider instance}
     * @return {Provider} {provider setter}
     */

  }, {
    key: "setScillaProvider",
    value: function setScillaProvider(provider) {
      this.scillaProvider = provider;
    }
    /**
     * @function {providerCheck}
     * @return {Error|null} {provider validator}
     */

  }, {
    key: "providerCheck",
    value: function providerCheck() {
      if (!this.provider) {
        laksaShared.InvalidProvider();
        return null;
      }
    }
  }, {
    key: "setReqMiddleware",
    value: function setReqMiddleware(middleware) {
      var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '*';
      return this.provider.middleware.request.use(middleware, method);
    }
  }, {
    key: "setResMiddleware",
    value: function setResMiddleware(middleware) {
      var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '*';
      return this.provider.middleware.response.use(middleware, method);
    }
  }, {
    key: "setTransactionVersion",
    value: function setTransactionVersion(version, networkId) {
      var chainID = 1;

      switch (networkId) {
        case this.config.Default.Network_ID:
          {
            chainID = this.config.Default.CHAIN_ID;
            this.setNetworkID(networkId);
            break;
          }

        case this.config.TestNet.Network_ID:
          {
            chainID = this.config.TestNet.CHAIN_ID;
            this.setNetworkID(networkId);
            break;
          }

        case this.config.MainNet.Network_ID:
          {
            chainID = this.config.MainNet.CHAIN_ID;
            this.setNetworkID(networkId);
            break;
          }

        case this.config.Staging.Network_ID:
          {
            chainID = this.config.Staging.CHAIN_ID;
            this.setNetworkID(networkId);
            break;
          }

        case this.config.DevNet.Network_ID:
          {
            chainID = this.config.DevNet.CHAIN_ID;
            this.setNetworkID(networkId);
            break;
          }

        default:
          break;
      }

      return laksaUtils.pack(chainID, version);
    }
  }, {
    key: "setNetworkID",
    value: function setNetworkID(id) {
      this.Network_ID = id;
    }
  }]);

  return Messenger;
}();

exports.Messenger = Messenger;
exports.JsonRpc = JsonRpc;
