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
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('bn.js'), require('laksa-utils'), require('elliptic'), require('hash.js'), require('@zilliqa-js/proto'), require('hmac-drbg')) :
  typeof define === 'function' && define.amd ? define(['exports', 'bn.js', 'laksa-utils', 'elliptic', 'hash.js', '@zilliqa-js/proto', 'hmac-drbg'], factory) :
  (factory((global.Laksa = {}),global.BN,global.laksaUtils,global.elliptic,global.hashjs,global.proto,global.DRBG));
}(this, (function (exports,BN,laksaUtils,elliptic,hashjs,proto,DRBG) { 'use strict';

  BN = BN && BN.hasOwnProperty('default') ? BN['default'] : BN;
  elliptic = elliptic && elliptic.hasOwnProperty('default') ? elliptic['default'] : elliptic;
  hashjs = hashjs && hashjs.hasOwnProperty('default') ? hashjs['default'] : hashjs;
  DRBG = DRBG && DRBG.hasOwnProperty('default') ? DRBG['default'] : DRBG;

  /**
   * @function randomBytes
   * @description Uses JS-native CSPRNG to generate a specified number of bytes.
   * NOTE: this method throws if no PRNG is available.
   * @param {Number} bytes bytes number to generate
   * @returns {String} ramdom hex string
   */
  const randomBytes = bytes => {
    let randBz;

    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      randBz = window.crypto.getRandomValues(new Uint8Array(bytes));
    } else if (typeof require !== 'undefined') {
      randBz = require('crypto').randomBytes(bytes);
    } else {
      throw new Error('Unable to generate safe random numbers.');
    }

    let randStr = '';

    for (let i = 0; i < bytes; i += 1) {
      randStr += `00${randBz[i].toString(16)}`.slice(-2);
    }

    return randStr;
  };

  /**
   * @class Signature
   *
   * @description This replaces `elliptic/lib/elliptic/ec/signature`. This is to avoid
   * duplicate code in the final bundle, caused by having to bundle elliptic
   * twice due to its circular dependencies. This can be removed once
   * https://github.com/indutny/elliptic/pull/157 is resolved, or we find the
   * time to fork an optimised version of the library.
   */

  class Signature {
    constructor(options) {
      /**
       * @var {BN} r
       * @memberof Signature.prototype
       */
      this.r = typeof options.r === 'string' ? new BN(options.r, 16) : options.r;
      /**
       * @var {BN} s
       * @memberof Signature.prototype
       */

      this.s = typeof options.s === 'string' ? new BN(options.s, 16) : options.s;
    }

  }

  /**
   * @function intToHexArray
   * @description transform a int to hex array
   * @param {Number} int - the number to be converted to hex
   * @param {Number} size - the desired width of the hex value. will pad.
   * @return {Array<String>} the hex array result
   */
  const intToHexArray = (int, size) => {
    const hex = [];
    const hexRep = [];
    const hexVal = int.toString(16); // TODO: this really needs to be refactored.

    for (let i = 0; i < hexVal.length; i += 1) {
      hexRep[i] = hexVal[i].toString();
    }

    for (let i = 0; i < size - hexVal.length; i += 1) {
      hex.push('0');
    }

    for (let i = 0; i < hexVal.length; i += 1) {
      hex.push(hexRep[i]);
    }

    return hex;
  };
  /**
   * @function intToByteArray
   * @description Converts a number to Uint8Array
   * @param {Number} num - input number
   * @param {Number} size - size of bytes array
   * @returns {Uint8Array} Byte Array result
   */

  const intToByteArray = (num, size) => {
    let x = num;
    const res = [];

    while (x > 0) {
      res.push(x & 255);
      x >>= 8;
    }

    const pad = size - res.length;

    for (let i = 0; i < pad; i += 1) {
      res.unshift(0);
    }

    return Uint8Array.from(res);
  };
  /**
   * @function hexToByteArray
   * @description Convers a hex string to a Uint8Array
   * @param {string} hex - hex string to convert
   * @return {Uint8Array} the ByteArray result
   */

  const hexToByteArray = hex => {
    const res = new Uint8Array(hex.length / 2);

    for (let i = 0; i < hex.length; i += 2) {
      res[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }

    return res;
  };
  /**
   * @function hexToIntArray
   * @description convert a hex string to int array
   * @param {string} hex - hex string to convert
   * @return {Array<Number>} the int array
   */

  const hexToIntArray = hex => {
    if (!hex || !isHex(hex)) {
      return [];
    }

    const res = [];

    for (let i = 0; i < hex.length; i += 1) {
      const c = hex.charCodeAt(i);
      const hi = c >> 8;
      const lo = c & 0xff;

      if (hi) {
        res.push(hi, lo);
      }

      res.push(lo);
    }

    return res;
  };
  /**
   * @function compareBytes
   * @description A constant time HMAC comparison function.
   * @param {String} a - hex string
   * @param {String} b - hex string
   * @return {Boolean} test result
   */

  const isEqual = (a, b) => {
    const bzA = hexToIntArray(a);
    const bzB = hexToIntArray(b);

    if (bzA.length !== bzB.length) {
      return false;
    }

    let result = 0;

    for (let i = 0; i < bzA.length; i += 1) {
      result |= bzA[i] ^ bzB[i];
    }

    return result === 0;
  };
  /**
   * @function isHex
   * @description test string if it is hex string
   * @param {String} str - string to be tested
   * @return {Boolean} test result
   */

  const isHex = str => {
    const plain = str.replace('0x', '');
    return /[0-9a-f]*$/i.test(plain);
  };

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

  /* eslint-disable no-param-reassign */

  const CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
  const GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];

  const polymod = values => {
    let chk = 1; // tslint:disable-next-line

    for (let p = 0; p < values.length; p += 1) {
      const top = chk >> 25;
      chk = (chk & 0x1ffffff) << 5 ^ values[p];

      for (let i = 0; i < 5; i += 1) {
        if (top >> i & 1) {
          chk ^= GENERATOR[i];
        }
      }
    }

    return chk;
  };

  const hrpExpand = hrp => {
    const ret = [];
    let p;

    for (p = 0; p < hrp.length; p += 1) {
      ret.push(hrp.charCodeAt(p) >> 5);
    }

    ret.push(0);

    for (p = 0; p < hrp.length; p += 1) {
      ret.push(hrp.charCodeAt(p) & 31);
    }

    return Buffer.from(ret);
  };

  function verifyChecksum(hrp, data) {
    return polymod(Buffer.concat([hrpExpand(hrp), data])) === 1;
  }

  function createChecksum(hrp, data) {
    const values = Buffer.concat([Buffer.from(hrpExpand(hrp)), data, Buffer.from([0, 0, 0, 0, 0, 0])]); // var values = hrpExpand(hrp).concat(data).concat([0, 0, 0, 0, 0, 0]);

    const mod = polymod(values) ^ 1;
    const ret = [];

    for (let p = 0; p < 6; p += 1) {
      ret.push(mod >> 5 * (5 - p) & 31);
    }

    return Buffer.from(ret);
  }

  const encode = (hrp, data) => {
    const combined = Buffer.concat([data, createChecksum(hrp, data)]);
    let ret = `${hrp}1`; // tslint:disable-next-line

    for (let p = 0; p < combined.length; p += 1) {
      ret += CHARSET.charAt(combined[p]);
    }

    return ret;
  };
  const decode = bechString => {
    let p;
    let hasLower = false;
    let hasUpper = false;

    for (p = 0; p < bechString.length; p += 1) {
      if (bechString.charCodeAt(p) < 33 || bechString.charCodeAt(p) > 126) {
        return null;
      }

      if (bechString.charCodeAt(p) >= 97 && bechString.charCodeAt(p) <= 122) {
        hasLower = true;
      }

      if (bechString.charCodeAt(p) >= 65 && bechString.charCodeAt(p) <= 90) {
        hasUpper = true;
      }
    }

    if (hasLower && hasUpper) {
      return null;
    }

    bechString = bechString.toLowerCase();
    const pos = bechString.lastIndexOf('1');

    if (pos < 1 || pos + 7 > bechString.length || bechString.length > 90) {
      return null;
    }

    const hrp = bechString.substring(0, pos);
    const data = [];

    for (p = pos + 1; p < bechString.length; p += 1) {
      const d = CHARSET.indexOf(bechString.charAt(p));

      if (d === -1) {
        return null;
      }

      data.push(d);
    }

    if (!verifyChecksum(hrp, Buffer.from(data))) {
      return null;
    }

    return {
      hrp,
      data: Buffer.from(data.slice(0, data.length - 6))
    };
  }; // HRP is the human-readable part of zilliqa bech32 addresses

  const HRP = 'zil';
  /**
   * convertBits
   *
   * groups buffers of a certain width to buffers of the desired width.
   *
   * For example, converts byte buffers to buffers of maximum 5 bit numbers,
   * padding those numbers as necessary. Necessary for encoding Ethereum-style
   * addresses as bech32 ones.
   *
   * @param {Buffer} data
   * @param {number} fromWidth
   * @param {number} toWidth
   * @param {boolean} pad
   * @returns {Buffer|null}
   */

  const convertBits = (data, fromWidth, toWidth, pad = true) => {
    let acc = 0;
    let bits = 0;
    const ret = [];
    const maxv = (1 << toWidth) - 1; // tslint:disable-next-line

    for (let p = 0; p < data.length; p += 1) {
      const value = data[p];

      if (value < 0 || value >> fromWidth !== 0) {
        return null;
      }

      acc = acc << fromWidth | value;
      bits += fromWidth;

      while (bits >= toWidth) {
        bits -= toWidth;
        ret.push(acc >> bits & maxv);
      }
    }

    if (pad) {
      if (bits > 0) {
        ret.push(acc << toWidth - bits & maxv);
      }
    } else if (bits >= fromWidth || acc << toWidth - bits & maxv) {
      return null;
    }

    return Buffer.from(ret);
  };
  /**
   * toBech32Address
   *
   * Encodes a canonical 20-byte Ethereum-style address as a bech32 zilliqa
   * address.
   *
   * The expected format is zil1<address><checksum> where address and checksum
   * are the result of bech32 encoding a Buffer containing the address bytes.
   *
   * @param {string} 20 byte canonical address
   * @returns {string} 38 char bech32 encoded zilliqa address
   */

  const toBech32Address = address => {
    if (!laksaUtils.isAddress(address)) {
      throw new Error('Invalid address format.');
    }

    const addrBz = convertBits(Buffer.from(address.replace('0x', ''), 'hex'), 8, 5);

    if (addrBz === null) {
      throw new Error('Could not convert byte Buffer to 5-bit Buffer');
    }

    return encode(HRP, addrBz);
  };
  /**
   * fromBech32Address
   *
   * @param {string} address - a valid Zilliqa bech32 address
   * @returns {string} a canonical 20-byte Ethereum-style address
   */

  const fromBech32Address = address => {
    const res = decode(address);

    if (res === null) {
      throw new Error('Invalid bech32 address');
    }

    const {
      hrp,
      data
    } = res;

    if (hrp !== HRP) {
      throw new Error(`Expected hrp to be ${HRP} but got ${hrp}`);
    }

    const buf = convertBits(data, 5, 8, false);

    if (buf === null) {
      throw new Error('Could not convert buffer to bytes');
    }

    return toChecksumAddress(buf.toString('hex'));
  };

  const AddressType = Object.freeze({
    bytes20: 'bytes20',
    bytes20Hex: 'bytes20Hex',
    checkSum: 'checkSum',
    base58: 'base58',
    bech32: 'bech32'
  });

  class ZilAddress {
    constructor(raw) {
      _defineProperty(this, "addressType", void 0);

      _defineProperty(this, "bytes20", void 0);

      _defineProperty(this, "checkSum", void 0);

      _defineProperty(this, "bech32", void 0);

      _defineProperty(this, "base58", void 0);

      this.raw = raw;
      this.getAddressType();
    }

    getAddressType() {
      const addrBool = laksaUtils.isAddress(this.raw);
      const base58Bool = laksaUtils.isBase58(this.raw);
      const bech32Bool = laksaUtils.isBech32(this.raw);
      const checksumBool = isValidChecksumAddress(this.raw);

      if (addrBool === true && checksumBool === false) {
        this.addressType = AddressType.bytes20;
        this.bytes20 = this.raw.startsWith('0x') ? this.raw.substring(2) : this.raw;
        this.normalize();
      } else if (addrBool === true && checksumBool === true) {
        this.addressType = AddressType.checkSum;
        this.bytes20 = this.raw.toLowerCase().substring(2);
        this.normalize();
      } else if (bech32Bool === true && laksaUtils.isAddress(fromBech32Address(this.raw))) {
        this.addressType = AddressType.bech32;
        const decoded = fromBech32Address(this.raw).toLowerCase();
        this.bytes20 = decoded.startsWith('0x') ? decoded.substring(2) : decoded;
        this.normalize();
      } else if (base58Bool === true && laksaUtils.isAddress(decodeBase58(this.raw))) {
        this.addressType = AddressType.base58;
        const decoded = decodeBase58(this.raw).toLowerCase();
        this.bytes20 = decoded.startsWith('0x') ? decoded.substring(2) : decoded;
        this.normalize();
      } else {
        throw new Error('unknown address');
      }
    }

    normalize() {
      this.bytes20Hex = `0x${this.bytes20}`;
      this.checkSum = toChecksumAddress(this.bytes20);
      this.base58 = encodeBase58(this.checkSum);
      this.bech32 = toBech32Address(this.checkSum);
    }

  }

  const secp256k1 = elliptic.ec('secp256k1');
  /**
   * @function getAddressFromPrivateKey
   *
   * @description takes a hex-encoded string (private key) and return its corresponding
   * 20-byte hex-encoded address.
   * @param {String} Key
   * @return {String}
   */

  const getAddressFromPrivateKey = privateKey => {
    const keyPair = secp256k1.keyFromPrivate(privateKey, 'hex');
    const pub = keyPair.getPublic(true, 'hex');
    return hashjs.sha256().update(pub, 'hex').digest('hex').slice(24);
  };
  /**
   * @function getPubKeyFromPrivateKey
   * @description takes a hex-encoded string (private key) and return its corresponding
   * hex-encoded 33-byte public key.
   *
   * @param {String} privateKey
   * @return {String}
   */

  const getPubKeyFromPrivateKey = privateKey => {
    const keyPair = secp256k1.keyFromPrivate(privateKey, 'hex');
    return keyPair.getPublic(true, 'hex');
  };
  /**
   * @function compressPublicKey
   * @description comporess public key
   * @param {String} publicKey - 65-byte public key, a point (x, y)
   * @return {String}
   */

  const compressPublicKey = publicKey => {
    return secp256k1.keyFromPublic(publicKey, 'hex').getPublic(true, 'hex');
  };
  /**
   * @function getAddressFromPublicKey
   *
   * @description takes hex-encoded string and return the corresponding address
   * @param {String} pubKey
   * @return {String}
   */

  const getAddressFromPublicKey = pubKey => {
    return hashjs.sha256().update(pubKey, 'hex').digest('hex').slice(24);
  };
  /**
   * @function verifyPrivateKey
   * @description verify private key
   * @param {String|Buffer} privateKey
   * @return {Boolean}
   */

  const verifyPrivateKey = privateKey => {
    const keyPair = secp256k1.keyFromPrivate(privateKey, 'hex');
    const {
      result
    } = keyPair.validate();
    return result;
  };
  /**
   * @function toChecksumAddress
   * @description convert address to checksum
   * @param  {String} address - address string
   * @return {String} checksumed address
   */

  const toChecksumAddress = address => {
    const newAddress = address.toLowerCase().replace('0x', '');
    const hash = hashjs.sha256().update(newAddress, 'hex').digest('hex');
    const v = new BN(hash, 'hex', 'be');
    let ret = '0x';

    for (let i = 0; i < newAddress.length; i += 1) {
      if ('0123456789'.indexOf(newAddress[i]) !== -1) {
        ret += newAddress[i];
      } else {
        ret += v.and(new BN(2).pow(new BN(255 - 6 * i))).gte(new BN(1)) ? newAddress[i].toUpperCase() : newAddress[i].toLowerCase();
      }
    }

    return ret;
  };
  /**
   * @function isValidChecksumAddress
   *
   * @description takes hex-encoded string and return boolean if address is checksumed
   * @param {String} address
   * @return {Boolean}
   */

  const isValidChecksumAddress = address => {
    const replacedAddress = address.replace('0x', '');
    return !!replacedAddress.match(/^[0-9a-fA-F]{40}$/) && toChecksumAddress(address) === address;
  };
  /**
   * @function encodeTransaction
   * @description encode transaction to protobuff standard
   * @param {Transaction|any} tx  - transaction object or Transaction instance
   * @return {Buffer}
   */

  const encodeTransactionProto = tx => {
    const msg = {
      version: tx.version,
      nonce: tx.nonce || 0,
      toaddr: hexToByteArray(tx.toAddr.replace('0x', '').toLowerCase()),
      senderpubkey: proto.ZilliqaMessage.ByteArray.create({
        data: hexToByteArray(tx.pubKey || '00')
      }),
      amount: proto.ZilliqaMessage.ByteArray.create({
        data: Uint8Array.from(tx.amount.toArrayLike(Buffer, undefined, 16))
      }),
      gasprice: proto.ZilliqaMessage.ByteArray.create({
        data: Uint8Array.from(tx.gasPrice.toArrayLike(Buffer, undefined, 16))
      }),
      gaslimit: tx.gasLimit,
      code: tx.code && tx.code.length ? Uint8Array.from([...tx.code].map(c => c.charCodeAt(0))) : null,
      data: tx.data && tx.data.length ? Uint8Array.from([...tx.data].map(c => c.charCodeAt(0))) : null
    };
    const serialised = proto.ZilliqaMessage.ProtoTransactionCoreInfo.create(msg);
    return Buffer.from(proto.ZilliqaMessage.ProtoTransactionCoreInfo.encode(serialised).finish());
  };
  /**
   * @function getAddressForContract
   * @param  {Object} param
   * @param  {Number} param.currentNonce - current nonce number
   * @param  {String} param.address      - deployer's address
   * @return {String} Contract address
   */

  const getAddressForContract = ({
    currentNonce,
    address
  }) => {
    // always subtract 1 from the tx nonce, as contract addresses are computed
    // based on the nonce in the global state.
    const nonce = currentNonce ? currentNonce - 1 : 0;
    return hashjs.sha256().update(address, 'hex').update(intToHexArray(nonce, 64).join(''), 'hex').digest('hex').slice(24);
  };
  /**
   * @function checkValidSignature
   * @description verify if signature is length===128
   * @param  {Signature} sig - Signature
   * @return {Boolean}
   */

  const checkValidSignature = sig => {
    return sig.r.toString('hex').length + sig.s.toString('hex').length === 128;
  };
  const encodeBase58 = hex => {
    const clean = hex.toLowerCase().replace('0x', '');
    const tbl = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const base = new BN(58);
    const zero = new BN(0);
    let x = new BN(clean, 16);
    let res = '';

    while (x.gt(zero)) {
      const rem = x.mod(base).toNumber(); // safe, always < 58
      // big endian

      res = tbl[rem] + res; // quotient, remainders thrown away in integer division

      x = x.div(base);
    } // convert to big endian in case the input hex is little endian


    const hexBE = x.toString('hex', clean.length);

    for (let i = 0; i < hexBE.length; i += 2) {
      if (hex[i] === '0' && hex[i + 1] === '0') {
        res = tbl[0] + res;
      } else {
        break;
      }
    }

    return res;
  };
  const decodeBase58 = raw => {
    const tbl = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const base = new BN(58);
    const zero = new BN(0);
    let isBreak = false;
    let n = new BN(0);
    let leader = '';

    for (let i = 0; i < raw.length; i += 1) {
      const char = raw.charAt(i);
      const weight = new BN(tbl.indexOf(char));
      n = n.mul(base).add(weight); // check if padding required

      if (!isBreak) {
        if (i - 1 > 0 && raw[i - 1] !== '1') {
          isBreak = true; // eslint-disable-next-line no-continue

          continue;
        }

        if (char === '1') {
          leader += '00';
        }
      }
    }

    if (n.eq(zero)) {
      return leader;
    }

    let res = leader + n.toString('hex');

    if (res.length % 2 !== 0) {
      res = `0${res}`;
    }

    return res;
  };
  const getAddress = (address, fromType, toType) => {
    if (!laksaUtils.isString(address)) {
      throw new Error(`${address} is not string`);
    }

    const zilAddr = new ZilAddress(address);
    const validateType = fromType === undefined || fromType.length === 0 ? [] : fromType;
    let total = 0;
    total = validateType.length > 0 ? validateType.map(type => {
      const value = zilAddr.addressType === type ? 1 : 0;
      return value;
    }).reduce((pre, cur) => {
      return pre + cur;
    }) : 0;

    if (total === 0 && validateType.length > 0) {
      throw new Error('Address format is invalid');
    }

    switch (toType) {
      case AddressType.bytes20:
        {
          if (!zilAddr.bytes20) {
            throw new Error(`can not convert to ${toType}`);
          } else {
            return zilAddr.bytes20;
          }
        }

      case AddressType.bytes20Hex:
        {
          if (!zilAddr.bytes20Hex) {
            throw new Error(`can not convert to ${toType}`);
          } else {
            return zilAddr.bytes20Hex;
          }
        }

      case AddressType.base58:
        {
          if (!zilAddr.base58) {
            throw new Error(`can not convert to ${toType}`);
          } else {
            return zilAddr.base58;
          }
        }

      case AddressType.bech32:
        {
          if (!zilAddr.bech32) {
            throw new Error(`can not convert to ${toType}`);
          } else {
            return zilAddr.bech32;
          }
        }

      case AddressType.checkSum:
        {
          if (!zilAddr.checkSum) {
            throw new Error(`can not convert to ${toType}`);
          } else {
            return zilAddr.checkSum;
          }
        }

      default:
        return zilAddr.raw;
    }
  };

  const secp256k1$1 = elliptic.ec('secp256k1');
  const {
    curve
  } = secp256k1$1;
  const PRIVKEY_SIZE_BYTES = 32; // Public key is a point (x, y) on the curve.
  // Each coordinate requires 32 bytes.
  // In its compressed form it suffices to store the x co-ordinate
  // and the sign for y.
  // Hence a total of 33 bytes.

  const PUBKEY_COMPRESSED_SIZE_BYTES = 33; // Personalization string used for HMAC-DRBG instantiation.

  const ALG = Buffer.from('Schnorr+SHA256  ', 'ascii'); // The length in bytes of the string above.

  const ALG_LEN = 16; // The length in bytes of entropy inputs to HMAC-DRBG

  const ENT_LEN = 32;
  const HEX_ENC = 'hex';
  /**
   * @function generatePrivateKey
   * @description generate a private key
   * @return {String} the hex-encoded private key
   */

  const generatePrivateKey = () => {
    return secp256k1$1.genKeyPair({
      entropy: randomBytes(secp256k1$1.curve.n.byteLength()),
      entropyEnc: HEX_ENC,
      pers: 'zilliqajs+secp256k1+SHA256'
    }).getPrivate().toString(16, PRIVKEY_SIZE_BYTES * 2);
  };
  /**
   * @function hash
   * @description hash message Hash (r | M).
   * @param {Buffer} q
   * @param {Buffer} msg
   * @param {BN} r
   * @return {Buffer}
   */

  const hash = (q, pubkey, msg) => {
    const sha256 = hashjs.sha256();
    const pubSize = PUBKEY_COMPRESSED_SIZE_BYTES * 2;
    const totalLength = pubSize + msg.byteLength; // 33 q + 33 pubkey + variable msgLen

    const Q = q.toArrayLike(Buffer, 'be', 33);
    const B = Buffer.allocUnsafe(totalLength);
    Q.copy(B, 0);
    pubkey.copy(B, 33);
    msg.copy(B, 66);
    return new BN(sha256.update(B).digest('hex'), 16);
  };
  /**
   * @function sign
   * @description sign method
   * @param {Buffer} msg
   * @param {Buffer} key
   * @param {Buffer} pubkey
   * @return {Signature}
   */

  const sign = (msg, privKey, pubKey) => {
    const prv = new BN(privKey);
    const drbg = getDRBG(msg);
    const len = curve.n.byteLength();
    let sig;

    while (!sig) {
      const k = new BN(drbg.generate(len));
      const trySig = trySign(msg, k, prv, pubKey);
      sig = checkValidSignature(trySig) ? trySig : null;
    }

    return sig;
  };
  /**
   * @function trySign
   * @description try sign message with random k
   * @param {Buffer} msg - the message to sign over
   * @param {BN} k - output of the HMAC-DRBG
   * @param {BN} privateKey - the private key
   * @param {Buffer} pubKey - the public key
   * @return {Signature | null}
   */

  const trySign = (msg, k, privKey, pubKey) => {
    if (privKey.isZero()) {
      throw new Error('Bad private key.');
    }

    if (privKey.gte(curve.n)) {
      throw new Error('Bad private key.');
    } // 1a. check that k is not 0


    if (k.isZero()) {
      return null;
    } // 1b. check that k is < the order of the group


    if (k.gte(curve.n)) {
      return null;
    } // 2. Compute commitment Q = kG, where g is the base point


    const Q = curve.g.mul(k); // convert the commitment to octets first

    const compressedQ = new BN(Q.encodeCompressed()); // 3. Compute the challenge r = H(Q || pubKey || msg)
    // mod reduce the r value by the order of secp256k1, n

    const r = hash(compressedQ, pubKey, msg).umod(curve.n);
    const h = r.clone();

    if (h.isZero()) {
      return null;
    } // 4. Compute s = k - r * prv
    // 4a. Compute r * prv


    let s = h.imul(privKey).umod(curve.n); // 4b. Compute s = k - r * prv mod n

    s = k.isub(s).umod(curve.n);

    if (s.isZero()) {
      return null;
    }

    return new Signature({
      r,
      s
    });
  };
  /**
   * @function verify
   * @description Verify signature.
   * 1. Check if r,s is in [1, ..., order-1]
   * 2. Compute Q = sG + r*kpub
   * 3. If Q = O (the neutral point), return 0;
   * 4. r' = H(Q, kpub, m)
   * 5. return r' == r
   * @param {Buffer} msg
   * @param {Buffer} signature
   * @param {Buffer} key
   * @return {Boolean}
   *
   */

  const verify = (msg, signature, key) => {
    const sig = new Signature(signature);

    if (sig.s.isZero() || sig.r.isZero()) {
      throw new Error('Invalid signature');
    }

    if (sig.s.isNeg() || sig.r.isNeg()) {
      throw new Error('Invalid signature');
    }

    if (sig.s.gte(curve.n) || sig.r.gte(curve.n)) {
      throw new Error('Invalid signature');
    }

    const kpub = curve.decodePoint(key);

    if (!curve.validate(kpub)) {
      throw new Error('Invalid public key');
    }

    const l = kpub.mul(sig.r);
    const r = curve.g.mul(sig.s);
    const Q = l.add(r);

    if (Q.isInfinity()) {
      throw new Error('Invalid intermediate point.');
    }

    const compressedQ = new BN(Q.encodeCompressed());
    const r1 = hash(compressedQ, key, msg).umod(curve.n);

    if (r1.isZero()) {
      throw new Error('Invalid hash.');
    }

    return r1.eq(sig.r);
  };
  /**
   * @function toSignature
   * @param  {String} serialised serialised Signature string, length == 128
   * @return {Signature} Signature instance
   */

  const toSignature = serialised => {
    const r = serialised.slice(0, 64);
    const s = serialised.slice(64);
    return new Signature({
      r,
      s
    });
  };
  /**
   * @function getDRBG
   * @description generate an HMAC-DRBG.
   * @param {Buffer} entropy
   * @return {DRBG}
   */

  const getDRBG = msg => {
    const entropy = randomBytes(ENT_LEN);
    const pers = Buffer.allocUnsafe(ALG_LEN + ENT_LEN);
    Buffer.from(randomBytes(ENT_LEN)).copy(pers, 0);
    ALG.copy(pers, ENT_LEN);
    return new DRBG({
      hash: hashjs.sha256,
      entropy,
      nonce: msg,
      pers
    });
  };
  /**
   * @function signTest
   * @description a test sign method using string for browser
   * @param  {String} msg - message string
   * @param  {String} k   - random k string
   * @param  {String} prv - private key string
   * @param  {String} pub - public key string
   * @return {Signature | null} Signature result
   */

  const signTest = (msg, k, prv, pub) => {
    const msgBuffer = Buffer.from(msg, 'hex');
    const kBN = new BN(Buffer.from(k, 'hex'));
    const privBN = new BN(Buffer.from(prv, 'hex'));
    const pubBuffer = Buffer.from(pub, 'hex');
    return trySign(msgBuffer, kBN, privBN, pubBuffer);
  };

  var schnorr = /*#__PURE__*/Object.freeze({
    generatePrivateKey: generatePrivateKey,
    hash: hash,
    sign: sign,
    trySign: trySign,
    verify: verify,
    toSignature: toSignature,
    getDRBG: getDRBG,
    signTest: signTest
  });

  const {
    generatePrivateKey: generatePrivateKey$1
  } = schnorr;
  /**
   * @function sign
   * @description sign method using prviteKey and pubKey
   * @param {Buffer} msg message buffer
   * @param {String} privateKey private key string
   * @param {String} pubKey public key string
   * @returns {string} the signature
   */

  const sign$1 = (msg, privateKey, pubKey) => {
    const sig = sign(msg, Buffer.from(privateKey, 'hex'), Buffer.from(pubKey, 'hex'));
    let r = sig.r.toString('hex');
    let s = sig.s.toString('hex');

    while (r.length < 64) {
      r = `0${r}`;
    }

    while (s.length < 64) {
      s = `0${s}`;
    }

    return r + s;
  };

  exports.BN = BN;
  exports.elliptic = elliptic;
  exports.hashjs = hashjs;
  exports.generatePrivateKey = generatePrivateKey$1;
  exports.sign = sign$1;
  exports.schnorr = schnorr;
  exports.randomBytes = randomBytes;
  exports.getAddressFromPrivateKey = getAddressFromPrivateKey;
  exports.getPubKeyFromPrivateKey = getPubKeyFromPrivateKey;
  exports.compressPublicKey = compressPublicKey;
  exports.getAddressFromPublicKey = getAddressFromPublicKey;
  exports.verifyPrivateKey = verifyPrivateKey;
  exports.toChecksumAddress = toChecksumAddress;
  exports.isValidChecksumAddress = isValidChecksumAddress;
  exports.encodeTransactionProto = encodeTransactionProto;
  exports.getAddressForContract = getAddressForContract;
  exports.checkValidSignature = checkValidSignature;
  exports.encodeBase58 = encodeBase58;
  exports.decodeBase58 = decodeBase58;
  exports.getAddress = getAddress;
  exports.intToHexArray = intToHexArray;
  exports.intToByteArray = intToByteArray;
  exports.hexToByteArray = hexToByteArray;
  exports.hexToIntArray = hexToIntArray;
  exports.isEqual = isEqual;
  exports.isHex = isHex;
  exports.Signature = Signature;
  exports.ZilAddress = ZilAddress;
  exports.AddressType = AddressType;
  exports.encode = encode;
  exports.decode = decode;
  exports.convertBits = convertBits;
  exports.toBech32Address = toBech32Address;
  exports.fromBech32Address = fromBech32Address;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
