(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('cross-fetch')) :
  typeof define === 'function' && define.amd ? define(['exports', 'cross-fetch'], factory) :
  (factory((global.Laksa = {}),global.fetch));
}(this, (function (exports,fetch) { 'use strict';

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

  const MiddlewareType = {
    REQ: Symbol('REQ'),
    RES: Symbol('RES')
  };
  class BaseProvider {
    constructor(reqMiddleware = new Map(), resMiddleware = new Map()) {
      _defineProperty(this, "middleware", {
        request: {
          use: (fn, match = '*') => this.pushMiddleware(fn, MiddlewareType.REQ, match)
        },
        response: {
          use: (fn, match = '*') => this.pushMiddleware(fn, MiddlewareType.RES, match)
        }
      });

      this.reqMiddleware = reqMiddleware;
      this.resMiddleware = resMiddleware;
    }

    pushMiddleware(fn, type, match) {
      if (type !== MiddlewareType.REQ && type !== MiddlewareType.RES) {
        throw new Error('Please specify the type of middleware being added');
      }

      if (type === MiddlewareType.REQ) {
        const current = this.reqMiddleware.get(match) || [];
        this.reqMiddleware.set(match, [...current, fn]);
      } else {
        const current = this.resMiddleware.get(match) || [];
        this.resMiddleware.set(match, [...current, fn]);
      }
    }

    getMiddleware(method) {
      const reqFns = [];
      const resFns = [];

      for (const [key, transformers] of this.reqMiddleware.entries()) {
        if (typeof key === 'string' && key !== '*' && key === method) {
          reqFns.push(...transformers);
        }

        if (key instanceof RegExp && key.test(method)) {
          reqFns.push(...transformers);
        }

        if (key === '*') {
          reqFns.push(...transformers);
        }
      }

      for (const [key, transformers] of this.resMiddleware.entries()) {
        if (typeof key === 'string' && key !== '*' && key === method) {
          resFns.push(...transformers);
        }

        if (key instanceof RegExp && key.test(method)) {
          resFns.push(...transformers);
        }

        if (key === '*') {
          resFns.push(...transformers);
        }
      }

      return [reqFns, resFns];
    }

  }

  const DEFAULT_TIMEOUT = 120000;
  const DEFAULT_HEADERS = {
    'Content-Type': 'application/json'
  };

  function _fetch(fetchPromise, timeout) {
    let abortFn = null;
    const abortPromise = new Promise((resolve, reject) => {
      abortFn = () => reject(new Error(`request Timeout in ${timeout} ms`));
    });
    const abortablePromise = Promise.race([fetchPromise, abortPromise]);
    setTimeout(() => {
      abortFn();
    }, timeout);
    return abortablePromise;
  }

  const performRPC = async (request, handler) => {
    try {
      const response = await _fetch(fetch(request.url, {
        method: request.options && request.options.method ? request.options.method : 'POST',
        cache: 'no-cache',
        mode: 'cors',
        redirect: 'follow',
        referrer: 'no-referrer',
        body: JSON.stringify(request.payload),
        headers: _objectSpread({}, DEFAULT_HEADERS, request.options && request.options.headers ? request.options.headers : {})
      }), request.options && request.options.timeout ? request.options.timeout : DEFAULT_TIMEOUT);
      return response.json().then(body => {
        return _objectSpread({}, body, {
          req: request
        });
      }).then(handler);
    } catch (err) {
      throw err;
    }
  };

  const composeMiddleware = (...fns) => {
    if (fns.length === 0) {
      return arg => arg;
    }

    if (fns.length === 1) {
      return fns[0];
    }

    return fns.reduce((a, b) => arg => a(b(arg)));
  };

  exports.BaseProvider = BaseProvider;
  exports.performRPC = performRPC;
  exports.composeMiddleware = composeMiddleware;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
