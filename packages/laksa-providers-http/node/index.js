(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('cross-fetch'), require('laksa-core-provider')) :
  typeof define === 'function' && define.amd ? define(['exports', 'cross-fetch', 'laksa-core-provider'], factory) :
  (factory((global.Laksa = {}),global.fetch,global.laksaCoreProvider));
}(this, (function (exports,fetch,laksaCoreProvider) { 'use strict';

  fetch = fetch && fetch.hasOwnProperty('default') ? fetch['default'] : fetch;

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

  const fetchRPC = {
    requestHandler: (request, headers) => fetch(request.url, {
      method: request.options && request.options.method ? request.options.method : 'POST',
      cache: 'no-cache',
      mode: 'cors',
      redirect: 'follow',
      referrer: 'no-referrer',
      body: JSON.stringify(request.payload),
      headers: _objectSpread({}, headers, request.options && request.options.headers ? request.options.headers : {})
    }),
    responseHandler: (response, request, handler) => response.json().then(body => {
      return _objectSpread({}, body, {
        req: request
      });
    }).then(handler)
  };

  const defaultOptions = {
    method: 'POST',
    timeout: laksaCoreProvider.DEFAULT_TIMEOUT,
    headers: laksaCoreProvider.DEFAULT_HEADERS,
    user: null,
    password: null
  };

  class HttpProvider extends laksaCoreProvider.BaseProvider {
    constructor(url, options, fetcher) {
      super();
      this.url = url || 'http://localhost:4201';
      this.fetcher = fetcher || fetchRPC;

      if (options) {
        this.options = {
          method: options.method || defaultOptions.method,
          timeout: options.timeout || defaultOptions.timeout,
          user: options.user || defaultOptions.user,
          password: options.password || defaultOptions.password,
          headers: options.headers || defaultOptions.headers
        };
      } else {
        this.options = defaultOptions;
      }
    }
    /**
     * @function {send}
     * @param  {object} payload  {payload object}
     * @param  {function} callback {callback function}
     * @return {function} {to requestFunc}
     */


    send(payload, callback) {
      return this.requestFunc({
        payload,
        callback
      });
    }
    /**
     * @function {sendServer}
     * @param  {string} endpoint {endpoint to the server}
     * @param  {object} payload  {payload object}
     * @param  {function} callback {callback function}
     * @return {function} {to requestFunc}
     */


    sendServer(endpoint, payload, callback) {
      return this.requestFunc({
        endpoint,
        payload,
        callback
      });
    }
    /**
     * @function {requestFunc}
     * @param  {string} endpoint {endpoint to the server}
     * @param  {object} payload  {payload object}
     * @param  {function} callback {callback function}
     * @return {function} {performRPC call from laksa-core-provider}
     */


    requestFunc({
      endpoint,
      payload,
      callback
    }) {
      const [tReq, tRes] = this.getMiddleware(payload.method);
      const reqMiddleware = laksaCoreProvider.composeMiddleware(...tReq, obj => this.optionsHandler(obj), obj => this.endpointHandler(obj, endpoint), this.payloadHandler);
      const resMiddleware = laksaCoreProvider.composeMiddleware(data => this.callbackHandler(data, callback), ...tRes);
      const req = reqMiddleware(payload);
      return laksaCoreProvider.performRPC(req, resMiddleware, this.fetcher);
    }
    /**
     * @function {payloadHandler}
     * @param  {object} payload {payload object}
     * @return {object} {to payload object}
     */


    payloadHandler(payload) {
      return {
        payload
      };
    }
    /**
     * @function {endpointHandler}
     * @param  {object} obj      {payload object}
     * @param  {string} endpoint {add the endpoint to payload object}
     * @return {object} {assign a new object}
     */


    endpointHandler(obj, endpoint) {
      return Object.assign({}, obj, {
        url: endpoint !== null && endpoint !== undefined ? `${this.url}${endpoint}` : this.url
      });
    }
    /**
     * @function {optionsHandler}
     * @param  {object} obj {options object}
     * @return {object} {assign a new option object}
     */


    optionsHandler(obj) {
      if (this.options.user && this.options.password) {
        const AUTH_TOKEN = `Basic ${Buffer.from(`${this.options.user}:${this.options.password}`).toString('base64')}`;
        this.options.headers.Authorization = AUTH_TOKEN;
      }

      return Object.assign({}, obj, {
        options: this.options
      });
    }
    /**
     * @function {callbackHandler}
     * @param  {object} data {from server}
     * @param  {function} cb   {callback function}
     * @return {object|function} {return object or callback function}
     */


    callbackHandler(data, cb) {
      if (cb) {
        cb(null, data);
      }

      return data;
    }

    subscribe() {
      throw new Error('HTTPProvider does not support subscriptions.');
    }

    unsubscribe() {
      throw new Error('HTTPProvider does not support subscriptions.');
    }

  }

  exports.HttpProvider = HttpProvider;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
