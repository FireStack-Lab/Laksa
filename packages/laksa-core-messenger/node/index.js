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

      this.messageId = 0;
    }
    /**
     * @function {toPayload}
     * @param  {string} method {RPC method}
     * @param  {Array<object>} params {params that send to RPC}
     * @return {object} {payload object}
     */


  }

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
   * @param  {object} data {object get from provider}
   * @return {object} {data result or data}
   */
  function getResultForData(data) {
    if (data.result) return data.getResult;
    if (data.error) return data.getError;
    return data.getRaw;
  }

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

      this.provider = provider;
      this.scillaProvider = provider;
      this.config = config;
      this.JsonRpc = new JsonRpc();
    }
    /**
     * @function {send}
     * @param  {object} data {data object with method and params}
     * @return {object|Error} {result from provider}
     */


    /**
     * @function {setProvider}
     * @param  {Provider} provider {provider instance}
     * @return {Provider} {provider setter}
     */
    setProvider(provider) {
      this.provider = provider;
    }
    /**
     * @function {setScillaProvider}
     * @param  {Provider} provider {provider instance}
     * @return {Provider} {provider setter}
     */


    setScillaProvider(provider) {
      this.scillaProvider = provider;
    }
    /**
     * @function {providerCheck}
     * @return {Error|null} {provider validator}
     */


    providerCheck() {
      if (!this.provider) {
        laksaShared.InvalidProvider();
        return null;
      }
    }

    setReqMiddleware(middleware, method = '*') {
      return this.provider.middleware.request.use(middleware, method);
    }

    setResMiddleware(middleware, method = '*') {
      return this.provider.middleware.response.use(middleware, method);
    }

    setTransactionVersion(version) {
      let chainID = 1;

      switch (this.provider.url) {
        case this.config.Default.nodeProviderUrl:
          {
            chainID = this.config.Default.CHAIN_ID;
            break;
          }

        case this.config.TestNet.nodeProviderUrl:
          {
            chainID = this.config.TestNet.CHAIN_ID;
            break;
          }

        case this.config.MainNet.nodeProviderUrl:
          {
            chainID = this.config.MainNet.CHAIN_ID;
            break;
          }

        case this.config.Staging.nodeProviderUrl:
          {
            chainID = this.config.Staging.CHAIN_ID;
            break;
          }

        default:
          break;
      }

      return laksaUtils.pack(chainID, version);
    }

  }

  exports.Messenger = Messenger;
  exports.JsonRpc = JsonRpc;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
