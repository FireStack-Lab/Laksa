"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InvalidNumberOfRPCParams = exports.InvalidProvider = exports.InvalidConnection = exports.InvalidResponse = exports.ConnectionTimeout = void 0;

var ConnectionTimeout = function ConnectionTimeout(ms) {
  return new Error("CONNECTION TIMEOUT: timeout of ".concat(ms, " ms achived"));
};

exports.ConnectionTimeout = ConnectionTimeout;

var InvalidNumberOfRPCParams = function InvalidNumberOfRPCParams() {
  return new Error('Invalid number of input parameters to RPC method');
};

exports.InvalidNumberOfRPCParams = InvalidNumberOfRPCParams;

var InvalidConnection = function InvalidConnection(host) {
  return new Error("CONNECTION ERROR: Couldn't connect to node ".concat(host, "."));
};

exports.InvalidConnection = InvalidConnection;

var InvalidProvider = function InvalidProvider() {
  return new Error('Provider not set or invalid');
};

exports.InvalidProvider = InvalidProvider;

var InvalidResponse = function InvalidResponse(result) {
  var message = !!result && !!result.error && !!result.error.message ? result.error.message : "Invalid JSON RPC response: ".concat(JSON.stringify(result));
  return new Error(message);
};

exports.InvalidResponse = InvalidResponse;