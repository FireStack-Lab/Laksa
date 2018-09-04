'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var axios = _interopDefault(require('axios'));

class HttpProvider {
  constructor(url, timeout, user, password, headers) {
    Object.defineProperty(this, "instance", {
      enumerable: true,
      writable: true,
      value: () => {
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
    });
    Object.defineProperty(this, "send", {
      enumerable: true,
      writable: true,
      value: async payload => {
        const result = await this.instance().post(this.url, JSON.stringify(payload)).then(response => {
          const {
            data,
            status
          } = response;

          if (data.result && status === 200) {
            return data.result;
          }
        }).catch(err => err);
        return result;
      }
    });
    Object.defineProperty(this, "sendServer", {
      enumerable: true,
      writable: true,
      value: async (endpoint, payload) => {
        const result = await this.instance().post(`${this.url}${endpoint}`, JSON.stringify(payload)).then(response => {
          const {
            data,
            status
          } = response;

          if (data.result && status === 200) {
            return data.result;
          }
        }).catch(err => err);
        return result;
      }
    });
    Object.defineProperty(this, "sendAsync", {
      enumerable: true,
      writable: true,
      value: (payload, callback) => {
        // const request = this.instance()
        // console.log(JSON.stringify(payload))
        this.instance().post(this.url, JSON.stringify(payload)).then(response => {
          const {
            data,
            status
          } = response;

          if (data.result && status === 200) {
            callback(null, data.result);
          }
        }).catch(err => callback(err));
      }
    });
    Object.defineProperty(this, "sendAsyncServer", {
      enumerable: true,
      writable: true,
      value: (endpoint, payload, callback) => {
        // const request = this.instance()
        // console.log(JSON.stringify(payload))
        this.instance().post(`${this.url}${endpoint}`, JSON.stringify(payload)).then(response => {
          const {
            data,
            status
          } = response;

          if (data.result && status === 200) {
            callback(null, data.result);
          }
        }).catch(err => callback(err));
      }
    });
    this.url = url || 'http://localhost:4200';
    this.timeout = timeout || 0;
    this.user = user || null;
    this.password = password || null;
    this.headers = headers;
    this.axios = this.instance();
  }

}

class JsonRpc {
  constructor() {
    Object.defineProperty(this, "toPayload", {
      enumerable: true,
      writable: true,
      value: (method, params) => {
        if (!method) console.error('jsonrpc method should be specified!'); // advance message ID

        this.messageId += 1;
        return {
          jsonrpc: '2.0',
          id: this.messageId,
          method,
          params: params || []
        };
      }
    });
    Object.defineProperty(this, "toBatchPayload", {
      enumerable: true,
      writable: true,
      value: messages => {
        return messages.map(message => {
          return this.toPayload(message.method, message.params);
        });
      }
    });
    this.messageId = 0;
  }

}

const InvalidProvider = () => {
  return new Error('Provider not set or invalid');
};

class Messanger {
  constructor(provider) {
    _initialiseProps.call(this);

    this.provider = provider;
    this.JsonRpc = new JsonRpc();
  }

}

var _initialiseProps = function () {
  Object.defineProperty(this, "send", {
    enumerable: true,
    writable: true,
    value: async data => {
      if (!this.provider) {
        console.error(InvalidProvider());
        return null;
      }

      const payload = this.JsonRpc.toPayload(data.method, data.params);
      const result = await this.provider.send(payload);
      return result;
    }
  });
  Object.defineProperty(this, "sendAsync", {
    enumerable: true,
    writable: true,
    value: (data, callback) => {
      if (!this.provider) {
        console.error(InvalidProvider());
        return null;
      }

      const payload = this.JsonRpc.toPayload(data.method, data.params);
      this.provider.sendAsync(payload, (err, result) => {
        if (err) {
          return callback(err);
        }

        callback(null, result);
      });
    }
  });
  Object.defineProperty(this, "sendBatch", {
    enumerable: true,
    writable: true,
    value: (data, callback) => {
      if (!this.provider) {
        console.error(InvalidProvider());
        return null;
      }

      const payload = this.JsonRpc.toBatchPayload(data);
      this.provider.sendAsync(payload, (err, results) => {
        if (err) {
          return callback(err);
        }

        callback(err, results);
      });
    }
  });
  Object.defineProperty(this, "sendServer", {
    enumerable: true,
    writable: true,
    value: async (endpoint, data) => {
      if (!this.provider) {
        console.error(InvalidProvider());
        return null;
      } // const payload = this.JsonRpc.toPayload(data.method, data.params)


      const result = await this.provider.sendServer(endpoint, data);
      return result;
    }
  });
  Object.defineProperty(this, "sendAsyncServer", {
    enumerable: true,
    writable: true,
    value: (endpoint, data, callback) => {
      if (!this.provider) {
        console.error(InvalidProvider());
        return null;
      } // const payload = this.JsonRpc.toPayload(data.method, data.params)


      this.provider.sendAsyncServer(endpoint, data, (err, result) => {
        if (err) {
          return callback(err);
        }

        callback(null, result);
      });
    }
  });
  Object.defineProperty(this, "sendBatchServer", {
    enumerable: true,
    writable: true,
    value: (data, callback) => {
      if (!this.provider) {
        console.error(InvalidProvider());
        return null;
      } // const payload = this.JsonRpc.toBatchPayload(data)


      this.provider.sendAsync(data, (err, results) => {
        if (err) {
          return callback(err);
        }

        callback(err, results);
      });
    }
  });
  Object.defineProperty(this, "setProvider", {
    enumerable: true,
    writable: true,
    value: provider => {
      this.provider = provider;
    }
  });
};

exports.HttpProvider = HttpProvider;
exports.JsonRpc = JsonRpc;
exports.Messanger = Messanger;
