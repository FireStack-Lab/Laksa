'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ConnectionTimeout = function ConnectionTimeout(ms) {
  return new Error("CONNECTION TIMEOUT: timeout of ".concat(ms, " ms achived"));
};

var InvalidNumberOfRPCParams = function InvalidNumberOfRPCParams() {
  return new Error('Invalid number of input parameters to RPC method');
};

var InvalidConnection = function InvalidConnection(host) {
  return new Error("CONNECTION ERROR: Couldn't connect to node ".concat(host, "."));
};

var InvalidProvider = function InvalidProvider() {
  return new Error('Provider not set or invalid');
};

var InvalidResponse = function InvalidResponse(result) {
  var message = !!result && !!result.error && !!result.error.message ? result.error.message : "Invalid JSON RPC response: ".concat(JSON.stringify(result));
  return new Error(message);
};

exports.ConnectionTimeout = ConnectionTimeout;
exports.InvalidResponse = InvalidResponse;
exports.InvalidConnection = InvalidConnection;
exports.InvalidProvider = InvalidProvider;
exports.InvalidNumberOfRPCParams = InvalidNumberOfRPCParams;
