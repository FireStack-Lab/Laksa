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

  /* eslint-disable no-param-reassign */
  const format = (input, output) => (target, key, descriptor) => {
    const method = descriptor.value;

    descriptor.value = (...inArgs) => {
      const rawOutput = method(input(...inArgs));
      return output(rawOutput);
    };
  };

  /* eslint-disable no-param-reassign */

  /**
   * sign
   *
   * This decorates a method by attempting to sign the first argument of the
   * intercepted method.
   *
   * @param {T} target
   * @param {K} key
   * @param {PropertyDescriptor} descriptor
   * @returns {PropertyDescriptor | undefined}
   */
  const sign = (target, key, descriptor) => {
    const original = descriptor.value;

    async function interceptor(arg) {
      if (original && arg.bytes) {
        const signed = await this.signer.sign(arg);
        return original.call(this, signed);
      }
    }

    descriptor.value = interceptor;
    return descriptor;
  };

  exports.ConnectionTimeout = ConnectionTimeout;
  exports.InvalidResponse = InvalidResponse;
  exports.InvalidConnection = InvalidConnection;
  exports.InvalidProvider = InvalidProvider;
  exports.InvalidNumberOfRPCParams = InvalidNumberOfRPCParams;
  exports.format = format;
  exports.sign = sign;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
