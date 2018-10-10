(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('laksa-shared')) :
  typeof define === 'function' && define.amd ? define(['exports', 'laksa-shared'], factory) :
  (factory((global.Laksa = {}),global.laksaShared));
}(this, (function (exports,laksaShared) { 'use strict';

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

  function getResultForData(data) {
    return data.error ? data.error : data.message ? data : data.result;
  }

  class Messanger {
    constructor(provider) {
      _defineProperty(this, "send", async data => {
        this.providerCheck();

        try {
          const payload = this.JsonRpc.toPayload(data.method, data.params);
          const result = await this.provider.send(payload);
          return getResultForData(result);
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
      this.JsonRpc = new JsonRpc();
    }

    sendAsync(data, callback) {
      this.providerCheck();
      const payload = this.JsonRpc.toPayload(data.method, data.params);
      this.provider.sendAsync(payload, (err, result) => {
        if (err || result.error) {
          const errors = err || result.error;
          return callback(errors);
        }

        callback(null, getResultForData(result));
      });
    }

    sendBatch(data, callback) {
      this.providerCheck();
      const payload = this.JsonRpc.toBatchPayload(data);
      this.provider.sendAsync(payload, (err, results) => {
        if (err) {
          return callback(err);
        }

        callback(null, results);
      });
    }

    sendAsyncServer(endpoint, data, callback) {
      this.providerCheck();
      this.scillaProvider.sendAsyncServer(endpoint, data, (err, result) => {
        if (err || result.error) {
          const errors = err || result.error;
          return callback(errors);
        }

        callback(null, result);
      });
    }

    sendBatchServer(data, callback) {
      this.providerCheck();
      this.scillaProvider.sendAsync(data, (err, results) => {
        if (err) {
          return callback(err);
        }

        callback(null, results);
      });
    }

    setProvider(provider) {
      this.provider = provider;
    }

    setScillaProvider(provider) {
      this.scillaProvider = provider;
    }

    providerCheck() {
      if (!this.provider) {
        laksaShared.InvalidProvider();
        return null;
      }
    }

  }

  exports.JsonRpc = JsonRpc;
  exports.Messenger = Messanger;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
