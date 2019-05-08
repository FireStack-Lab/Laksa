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

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('laksa-shared'), require('laksa-utils')) :
  typeof define === 'function' && define.amd ? define(['exports', 'laksa-shared', 'laksa-utils'], factory) :
  (factory((global.Laksa = {}),global.laksaShared,global.laksaUtils));
}(this, (function (exports,laksaShared,laksaUtils) { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  /**
   * @class JsonRpc
   * @description json rpc instance
   * @return {JsonRpc} Json RPC instance
   */
  class JsonRpc {
    constructor() {
      _defineProperty(this, "toPayload", (method, params) => {
        // FIXME: error to be done by shared/errors
        if (!method) throw new Error('jsonrpc method should be specified!'); // advance message ID

        this.messageId += 1;
        return {
          jsonrpc: '2.0',
          id: this.messageId,
          method,
          params: params !== undefined ? [params] : []
        };
      });

      /**
       * @var {Number} messageId
       * @memberof JsonRpc.prototype
       * @description message id, default 0
       */
      this.messageId = 0;
    }
    /**
     * @function toPayload
     * @memberof JsonRpc.prototype
     * @description convert method and params to payload object
     * @param  {String} method - RPC method
     * @param  {Array<object>} params - params that send to RPC
     * @return {Object} payload object
     */


  }

  /**
   * @class ResponseMiddleware
   * @description Response middleware of RPC
   * @param  {Object}  ResponseBody - response from rpc
   * @return {ResponseMiddleware} response middleware instance
   */
  class ResponseMiddleware {
    constructor(ResponseBody) {
      this.result = ResponseBody.result;
      this.error = ResponseBody.error;
      this.raw = ResponseBody;
    }

    get getResult() {
      return typeof this.result === 'string' ? this.result : _objectSpread({}, this.result, {
        responseType: 'result'
      });
    }

    get getError() {
      return typeof this.error === 'string' ? this.error : _objectSpread({}, this.error, {
        responseType: 'error'
      });
    }

    get getRaw() {
      return _objectSpread({}, this.raw, {
        responseType: 'raw'
      });
    }

  }

  /**
   * @function getResultForData
   * @description get result for data by default
   * @param  {Object} data - object get from provider
   * @return {Object} data result or data
   */
  function getResultForData(data) {
    if (data.result) return data.getResult;
    if (data.error) return data.getError;
    return data.getRaw;
  }

  const defaultConfig = {
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
    /**
     * @class Messenger
     * @description Messenger instance
     * @param  {HttpProvider} provider HttpProvider
     * @param  {Object}  config config object
     * @return {Messenger} Messenger instance
     */

  };

  class Messenger {
    constructor(provider, config) {
      _defineProperty(this, "send", async (method, params) => {
        this.providerCheck();

        try {
          const payload = this.JsonRpc.toPayload(method, params);
          this.setResMiddleware(data => new ResponseMiddleware(data));
          const result = await this.provider.send(payload);
          return getResultForData(result); // getResultForData(result)
        } catch (e) {
          throw new Error(e);
        }
      });

      _defineProperty(this, "sendServer", async (endpoint, data) => {
        this.providerCheck();

        try {
          const result = await this.scillaProvider.sendServer(endpoint, data);
          return result;
        } catch (e) {
          throw new Error(e);
        }
      });

      /**
       * @var {Provider} provider
       * @memberof Messenger.prototype
       * @description Provider instance
       */
      this.provider = provider;
      /**
       * @var {Provider} scillaProvider
       * @memberof Messenger.prototype
       * @description scilla Provider instance
       */

      this.scillaProvider = provider;
      /**
       * @var {Object} config
       * @memberof Messenger.prototype
       * @description Messenger config
       */

      this.config = config || defaultConfig;
      /**
       * @var {Number} Network_ID
       * @memberof Messenger.prototype
       * @description Network ID for current provider
       */

      this.Network_ID = this.setNetworkID(this.config.Default.Network_ID);
      /**
       * @var {JsonRpc} JsonRpc
       * @memberof Messenger.prototype
       * @description JsonRpc instance
       */

      this.JsonRpc = new JsonRpc();
    }
    /**
     * @function send
     * @memberof Messenger.prototype
     * @param  {String} method - RPC method
     * @param  {Object} params - RPC method params
     * @return {Object} RPC result
     */


    /**
     * @function setProvider
     * @memberof Messenger
     * @description provider setter
     * @param  {Provider} provider - provider instance
     */
    setProvider(provider) {
      this.provider = provider;
    }
    /**
     * @function setScillaProvider
     * @memberof Messenger
     * @description scilla provider setter
     * @param  {Provider} provider - provider instance
     */


    setScillaProvider(provider) {
      this.scillaProvider = provider;
    }
    /**
     * @function providerCheck
     * @memberof Messenger
     * @description provider checker
     * @return {Error|null} provider validator
     */


    providerCheck() {
      if (!this.provider) {
        laksaShared.InvalidProvider();
        return null;
      }
    }
    /**
     * @function setReqMiddleware
     * @description set request middleware
     * @memberof Messenger
     * @param  {any} middleware - middle ware for req
     * @param  {String} method  - method name
     */


    setReqMiddleware(middleware, method = '*') {
      return this.provider.middleware.request.use(middleware, method);
    }
    /**
     * @function setResMiddleware
     * @description set response middleware
     * @memberof Messenger
     * @param  {any} middleware - middle ware for req
     * @param  {String} method  - method name
     */


    setResMiddleware(middleware, method = '*') {
      return this.provider.middleware.response.use(middleware, method);
    }
    /**
     * @function setTransactionVersion
     * @description set transasction version
     * @memberof Messenger
     * @param  {Number} version   - version number
     * @param  {String} networkId - network id
     */


    setTransactionVersion(version, networkId) {
      let chainID = 1;

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
    /**
     * @function setNetworkID
     * @description set network id
     * @memberof Messenger
     * @param  {String} id network id string
     */


    setNetworkID(id) {
      this.Network_ID = id;
    }

  }

  exports.Messenger = Messenger;
  exports.JsonRpc = JsonRpc;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
