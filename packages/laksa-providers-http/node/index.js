(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('axios'), require('mitt'), require('laksa-core-provider')) :
  typeof define === 'function' && define.amd ? define(['exports', 'axios', 'mitt', 'laksa-core-provider'], factory) :
  (factory((global.Laksa = {}),global.axios,global.Mitt,global.laksaCoreProvider));
}(this, (function (exports,axios,Mitt,laksaCoreProvider) { 'use strict';

  axios = axios && axios.hasOwnProperty('default') ? axios['default'] : axios;
  Mitt = Mitt && Mitt.hasOwnProperty('default') ? Mitt['default'] : Mitt;

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

  class AxiosProvider {
    constructor(url, timeout, user, password, headers) {
      _defineProperty(this, "subscribers", new Map());

      _defineProperty(this, "send", async payload => {
        const result = await this.requestFunc({
          payload
        });
        return result;
      });

      _defineProperty(this, "sendServer", async (endpoint, payload) => {
        const result = await this.requestFunc({
          endpoint,
          payload
        });
        return result;
      });

      _defineProperty(this, "subscribe", (event, subscriber) => {
        const subToken = Symbol('subToken');
        this.subscribers.set(subToken, subscriber);
        return subToken;
      });

      _defineProperty(this, "unsubscribe", token => {
        if (this.subscribers.has(token)) {
          this.subscribers.delete(token);
        }
      });

      this.url = url || 'http://localhost:4200';
      this.timeout = timeout || 0;
      this.user = user || null;
      this.password = password || null;
      this.headers = headers;
      this.request = this.instance();
      this.broadcaster = new Mitt();
    }

    instance() {
      const request = axios.create();

      if (this.user && this.password) {
        const AUTH_TOKEN = `Basic ${Buffer.from(`${this.user}:${this.password}`).toString('base64')}`;
        request.defaults.headers.common.Authorization = AUTH_TOKEN;
      }

      request.defaults.headers.post['Content-Type'] = 'application/json';

      if (this.headers) {
        this.headers.forEach(header => {
          request.defaults.headers.post[header.name] = header.value;
        });
      }

      if (this.timeout) {
        request.defaults.timeout = this.timeout;
      }

      return request;
    }

    sendAsync(payload, callback) {
      this.requestFunc({
        payload,
        callback
      });
    }

    sendAsyncServer(endpoint, payload, callback) {
      this.requestFunc({
        endpoint,
        payload,
        callback
      });
    }

    requestFunc({
      endpoint,
      payload,
      callback
    }) {
      const dest = endpoint !== null && endpoint !== undefined ? `${this.url}${endpoint}` : this.url;
      return this.request.post(dest, JSON.stringify(payload)).then(response => {
        const {
          data,
          status
        } = response;

        if (data && status >= 200 && status < 400) {
          if (callback === undefined) {
            return data;
          } else {
            callback(null, data);
          }
        }
      }).catch(err => {
        if (callback === undefined) {
          return err;
        } else {
          callback(err);
        }
      });
    }

  }

  const defaultOptions = {
    method: 'POST',
    timeout: 120000,
    user: null,
    password: null,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  class ProtobufProvider extends laksaCoreProvider.BaseProvider {
    constructor(url, options) {
      super();
      this.url = url || 'http://localhost:4200';

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
      return laksaCoreProvider.performRPC(req, resMiddleware);
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

  }

  exports.AxiosProvider = AxiosProvider;
  exports.ProtobufProvider = ProtobufProvider;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
