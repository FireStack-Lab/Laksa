(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.Laksa = {})));
}(this, (function (exports) { 'use strict';

  const ConnectionTimeout = ms => {
    return new Error(`CONNECTION TIMEOUT: timeout of ${ms} ms achived`);
  };

  const InvalidNumberOfRPCParams = () => {
    return new Error('Invalid number of input parameters to RPC method');
  };

  const InvalidConnection = host => {
    return new Error(`CONNECTION ERROR: Couldn't connect to node ${host}.`);
  };

  const InvalidProvider = () => {
    return new Error('Provider not set or invalid');
  };

  const InvalidResponse = result => {
    const message = !!result && !!result.error && !!result.error.message ? result.error.message : `Invalid JSON RPC response: ${JSON.stringify(result)}`;
    return new Error(message);
  };

  exports.ConnectionTimeout = ConnectionTimeout;
  exports.InvalidResponse = InvalidResponse;
  exports.InvalidConnection = InvalidConnection;
  exports.InvalidProvider = InvalidProvider;
  exports.InvalidNumberOfRPCParams = InvalidNumberOfRPCParams;

  Object.defineProperty(exports, '__esModule', { value: true });

})));