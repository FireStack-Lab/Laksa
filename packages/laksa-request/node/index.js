(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('axios'), require('laksa-shared')) :
  typeof define === 'function' && define.amd ? define(['exports', 'axios', 'laksa-shared'], factory) :
  (factory((global.Laksa = {}),global.axios,global.laksaShared));
}(this, (function (exports,axios,laksaShared) { 'use strict';

  axios = axios && axios.hasOwnProperty('default') ? axios['default'] : axios;

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

  class HttpProvider {
    constructor(url, timeout, user, password, headers) {
      _defineProperty(this, "instance", () => {
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
      });

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

      _defineProperty(this, "sendAsync", (payload, callback) => {
        this.requestFunc({
          payload,
          callback
        });
      });

      _defineProperty(this, "sendAsyncServer", (endpoint, payload, callback) => {
        this.requestFunc({
          endpoint,
          payload,
          callback
        });
      });

      _defineProperty(this, "requestFunc", ({
        endpoint,
        payload,
        callback
      }) => {
        const dest = endpoint !== null && endpoint !== undefined ? `${this.url}${endpoint}` : this.url;
        return this.request.post(dest, JSON.stringify(payload)).then(response => {
          const {
            data,
            status
          } = response;

          if (data.result && status === 200) {
            if (callback === undefined) {
              return data.result;
            } else {
              callback(null, data.result);
            }
          }
        }).catch(err => {
          if (callback === undefined) {
            return err;
          } else {
            callback(err);
          }
        });
      });

      this.url = url || 'http://localhost:4200';
      this.timeout = timeout || 0;
      this.user = user || null;
      this.password = password || null;
      this.headers = headers;
      this.request = this.instance();
    }

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
          params: params || []
        };
      });

      _defineProperty(this, "toBatchPayload", messages => {
        return messages.map(message => {
          return this.toPayload(message.method, message.params);
        });
      });

      this.messageId = 0;
    }

  }

  class Messanger {
    constructor(_provider) {
      _defineProperty(this, "send", async data => {
        this.providerCheck();
        const payload = this.JsonRpc.toPayload(data.method, data.params);
        const result = await this.provider.send(payload);
        return result;
      });

      _defineProperty(this, "sendAsync", (data, callback) => {
        this.providerCheck();
        const payload = this.JsonRpc.toPayload(data.method, data.params);
        this.provider.sendAsync(payload, (err, result) => {
          if (err) {
            return callback(err);
          }

          callback(null, result);
        });
      });

      _defineProperty(this, "sendBatch", (data, callback) => {
        this.providerCheck();
        const payload = this.JsonRpc.toBatchPayload(data);
        this.provider.sendAsync(payload, (err, results) => {
          if (err) {
            return callback(err);
          }

          callback(null, results);
        });
      });

      _defineProperty(this, "sendServer", async (endpoint, data) => {
        this.providerCheck();
        const result = await this.provider.sendServer(endpoint, data);
        return result;
      });

      _defineProperty(this, "sendAsyncServer", (endpoint, data, callback) => {
        this.providerCheck();
        this.provider.sendAsyncServer(endpoint, data, (err, result) => {
          if (err) {
            return callback(err);
          }

          callback(null, result);
        });
      });

      _defineProperty(this, "sendBatchServer", (data, callback) => {
        this.providerCheck();
        this.provider.sendAsync(data, (err, results) => {
          if (err) {
            return callback(err);
          }

          callback(null, results);
        });
      });

      _defineProperty(this, "setProvider", provider => {
        this.provider = provider;
      });

      _defineProperty(this, "providerCheck", () => {
        if (!this.provider) {
          laksaShared.InvalidProvider();
          return null;
        }
      });

      this.provider = _provider;
      this.JsonRpc = new JsonRpc();
    }

  }

  exports.HttpProvider = HttpProvider;
  exports.JsonRpc = JsonRpc;
  exports.Messenger = Messanger;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
