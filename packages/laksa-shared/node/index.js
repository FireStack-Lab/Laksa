/**
 * This source code is being disclosed to you solely for the purpose of your participation in
 * testing Zilliqa and Laksa. You may view, compile and run the code for that purpose and pursuant to
 * the protocols and algorithms that are programmed into, and intended by, the code. You may
 * not do anything else with the code without express permission from Zilliqa Research Pte. Ltd.,
 * including modifying or publishing the code (or any part of it), and developing or forming
 * another public or private blockchain network. This source code is provided ‘as is’ and no
 * warranties are given as to title or non-infringement, merchantability or fitness for purpose
 * and, to the extent permitted by law, all liability for your use of the code is disclaimed.
 * Some programs in this code are governed by the GNU General Public License v3.0 (available at
 * https://www.gnu.org/licenses/gpl-3.0.en.html) (‘GPLv3’). The programs that are governed by
 * GPLv3.0 are those programs that are located in the folders src/depends and tests/depends
 * and which include a reference to GPLv3 in their program files.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('laksa-utils')) :
  typeof define === 'function' && define.amd ? define(['exports', 'laksa-utils'], factory) :
  (factory((global.Laksa = {}),global.laksaUtils));
}(this, (function (exports,laksaUtils) { 'use strict';

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

    async function interceptor(arg, {
      signer,
      password
    }) {
      if (original && arg.bytes) {
        const signed = await signer.sign(arg, password);
        return original.call(this, signed);
      }
    }

    descriptor.value = interceptor;
    return descriptor;
  };

  const validatorArray = {
    isNumber: [laksaUtils.isNumber],
    isString: [laksaUtils.isString],
    isBoolean: [laksaUtils.isBoolean],
    isBase58: [laksaUtils.isBase58],
    isArray: [laksaUtils.isArray],
    isJson: [laksaUtils.isJson],
    isObject: [laksaUtils.isObject],
    isFunction: [laksaUtils.isFunction],
    isHash: [laksaUtils.isHash],
    isUrl: [laksaUtils.isUrl],
    isPubkey: [laksaUtils.isPubkey],
    isPrivateKey: [laksaUtils.isPrivateKey],
    isBN: [laksaUtils.isBN],
    isLong: [laksaUtils.isLong],
    isAddress: [laksaUtils.isAddress]
  };
  const transformerArray = {
    toBN: number => new laksaUtils.BN(number),
    toNumber: string => Number(string),
    toString: string => String(string)
    /**
     * @function {generateValidateObjects}
     * @return {object} {validate object}
     */

  };
  function generateValidateObjects(validatorObject) {
    const requiredArgs = {};
    const optionalArgs = {};

    for (const index in validatorObject) {
      if (index !== undefined) {
        const newObjectKey = index;
        const newObjectValid = validatorObject[index][0];
        const isRequired = validatorObject[index][1];

        if (isRequired === 'required') {
          requiredArgs[newObjectKey] = validatorArray[newObjectValid];
        } else {
          optionalArgs[newObjectKey] = validatorArray[newObjectValid];
        }
      }
    }

    return {
      requiredArgs,
      optionalArgs
    };
  }
  /* eslint-disable no-param-reassign */

  const assertObject = input => (target, key, descriptor) => {
    const {
      requiredArgs,
      optionalArgs
    } = generateValidateObjects(input);
    const original = descriptor.value;

    function interceptor(...args) {
      laksaUtils.validateArgs(args[0], requiredArgs, optionalArgs);
      return original.apply(this, args);
    }

    descriptor.value = interceptor;
    return descriptor;
  };

  class Core {
    constructor(messenger, signer, status) {
      this.messenger = messenger;
      this.signer = signer;
      this.status = status;
    }

    setMessenger(p) {
      this.messenger = p;
    }

    getMessenger() {
      return this.messenger;
    }

    setSigner(s) {
      this.signer = s;
    }

    getSigner() {
      return this.signer;
    }

    setStatus(s) {
      this.status = s;
    }

    getStatus() {
      return this.status;
    }

  }

  exports.ConnectionTimeout = ConnectionTimeout;
  exports.InvalidResponse = InvalidResponse;
  exports.InvalidConnection = InvalidConnection;
  exports.InvalidProvider = InvalidProvider;
  exports.InvalidNumberOfRPCParams = InvalidNumberOfRPCParams;
  exports.format = format;
  exports.sign = sign;
  exports.validatorArray = validatorArray;
  exports.transformerArray = transformerArray;
  exports.generateValidateObjects = generateValidateObjects;
  exports.assertObject = assertObject;
  exports.Core = Core;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
