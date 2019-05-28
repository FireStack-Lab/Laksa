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

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es6.regexp.to-string');
require('core-js/modules/es6.typed.uint8-array');
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var BN = _interopDefault(require('bn.js'));
require('core-js/modules/es6.regexp.replace');
var laksaUtils = require('laksa-utils');
require('core-js/modules/es6.string.starts-with');
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
require('core-js/modules/es6.object.freeze');
var _toConsumableArray = _interopDefault(require('@babel/runtime/helpers/toConsumableArray'));
require('core-js/modules/es6.regexp.match');
var elliptic = _interopDefault(require('elliptic'));
var hashjs = _interopDefault(require('hash.js'));
var proto = require('@zilliqa-js/proto');
var DRBG = _interopDefault(require('hmac-drbg'));

/**
 * @function randomBytes
 * @description Uses JS-native CSPRNG to generate a specified number of bytes.
 * NOTE: this method throws if no PRNG is available.
 * @param {Number} bytes bytes number to generate
 * @returns {String} ramdom hex string
 */
var randomBytes = function randomBytes(bytes) {
  var randBz;

  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    randBz = window.crypto.getRandomValues(new Uint8Array(bytes));
  } else if (typeof require !== 'undefined') {
    randBz = require('crypto').randomBytes(bytes);
  } else {
    throw new Error('Unable to generate safe random numbers.');
  }

  var randStr = '';

  for (var i = 0; i < bytes; i += 1) {
    randStr += "00".concat(randBz[i].toString(16)).slice(-2);
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

var Signature = function Signature(options) {
  _classCallCheck(this, Signature);

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
};

/**
 * @function intToHexArray
 * @description transform a int to hex array
 * @param {Number} int - the number to be converted to hex
 * @param {Number} size - the desired width of the hex value. will pad.
 * @return {Array<String>} the hex array result
 */
var intToHexArray = function intToHexArray(int, size) {
  var hex = [];
  var hexRep = [];
  var hexVal = int.toString(16); // TODO: this really needs to be refactored.

  for (var i = 0; i < hexVal.length; i += 1) {
    hexRep[i] = hexVal[i].toString();
  }

  for (var _i = 0; _i < size - hexVal.length; _i += 1) {
    hex.push('0');
  }

  for (var _i2 = 0; _i2 < hexVal.length; _i2 += 1) {
    hex.push(hexRep[_i2]);
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

var intToByteArray = function intToByteArray(num, size) {
  var x = num;
  var res = [];

  while (x > 0) {
    res.push(x & 255);
    x >>= 8;
  }

  var pad = size - res.length;

  for (var i = 0; i < pad; i += 1) {
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

var hexToByteArray = function hexToByteArray(hex) {
  var res = new Uint8Array(hex.length / 2);

  for (var i = 0; i < hex.length; i += 2) {
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

var hexToIntArray = function hexToIntArray(hex) {
  if (!hex || !isHex(hex)) {
    return [];
  }

  var res = [];

  for (var i = 0; i < hex.length; i += 1) {
    var c = hex.charCodeAt(i);
    var hi = c >> 8;
    var lo = c & 0xff;

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

var isEqual = function isEqual(a, b) {
  var bzA = hexToIntArray(a);
  var bzB = hexToIntArray(b);

  if (bzA.length !== bzB.length) {
    return false;
  }

  var result = 0;

  for (var i = 0; i < bzA.length; i += 1) {
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

var isHex = function isHex(str) {
  var plain = str.replace('0x', '');
  return /[0-9a-f]*$/i.test(plain);
};

/* eslint-disable no-param-reassign */

var CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
var GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];

var polymod = function polymod(values) {
  var chk = 1; // tslint:disable-next-line

  for (var p = 0; p < values.length; p += 1) {
    var top = chk >> 25;
    chk = (chk & 0x1ffffff) << 5 ^ values[p];

    for (var i = 0; i < 5; i += 1) {
      if (top >> i & 1) {
        chk ^= GENERATOR[i];
      }
    }
  }

  return chk;
};

var hrpExpand = function hrpExpand(hrp) {
  var ret = [];
  var p;

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
  var values = Buffer.concat([Buffer.from(hrpExpand(hrp)), data, Buffer.from([0, 0, 0, 0, 0, 0])]); // var values = hrpExpand(hrp).concat(data).concat([0, 0, 0, 0, 0, 0]);

  var mod = polymod(values) ^ 1;
  var ret = [];

  for (var p = 0; p < 6; p += 1) {
    ret.push(mod >> 5 * (5 - p) & 31);
  }

  return Buffer.from(ret);
}

var encode = function encode(hrp, data) {
  var combined = Buffer.concat([data, createChecksum(hrp, data)]);
  var ret = "".concat(hrp, "1"); // tslint:disable-next-line

  for (var p = 0; p < combined.length; p += 1) {
    ret += CHARSET.charAt(combined[p]);
  }

  return ret;
};
var decode = function decode(bechString) {
  var p;
  var hasLower = false;
  var hasUpper = false;

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
  var pos = bechString.lastIndexOf('1');

  if (pos < 1 || pos + 7 > bechString.length || bechString.length > 90) {
    return null;
  }

  var hrp = bechString.substring(0, pos);
  var data = [];

  for (p = pos + 1; p < bechString.length; p += 1) {
    var d = CHARSET.indexOf(bechString.charAt(p));

    if (d === -1) {
      return null;
    }

    data.push(d);
  }

  if (!verifyChecksum(hrp, Buffer.from(data))) {
    return null;
  }

  return {
    hrp: hrp,
    data: Buffer.from(data.slice(0, data.length - 6))
  };
}; // HRP is the human-readable part of zilliqa bech32 addresses

var HRP = 'zil';
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

var convertBits = function convertBits(data, fromWidth, toWidth) {
  var pad = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var acc = 0;
  var bits = 0;
  var ret = [];
  var maxv = (1 << toWidth) - 1; // tslint:disable-next-line

  for (var p = 0; p < data.length; p += 1) {
    var value = data[p];

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

var toBech32Address = function toBech32Address(address) {
  if (!laksaUtils.isAddress(address)) {
    throw new Error('Invalid address format.');
  }

  var addrBz = convertBits(Buffer.from(address.replace('0x', ''), 'hex'), 8, 5);

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

var fromBech32Address = function fromBech32Address(address) {
  var res = decode(address);

  if (res === null) {
    throw new Error('Invalid bech32 address');
  }

  var hrp = res.hrp,
      data = res.data;

  if (hrp !== HRP) {
    throw new Error("Expected hrp to be ".concat(HRP, " but got ").concat(hrp));
  }

  var buf = convertBits(data, 5, 8, false);

  if (buf === null) {
    throw new Error('Could not convert buffer to bytes');
  }

  return toChecksumAddress(buf.toString('hex'));
};

var AddressType = Object.freeze({
  bytes20: 'bytes20',
  bytes20Hex: 'bytes20Hex',
  checkSum: 'checkSum',
  base58: 'base58',
  bech32: 'bech32'
});

var ZilAddress =
/*#__PURE__*/
function () {
  function ZilAddress(raw) {
    _classCallCheck(this, ZilAddress);

    _defineProperty(this, "addressType", void 0);

    _defineProperty(this, "bytes20", void 0);

    _defineProperty(this, "checkSum", void 0);

    _defineProperty(this, "bech32", void 0);

    _defineProperty(this, "base58", void 0);

    this.raw = raw;
    this.getAddressType();
  }

  _createClass(ZilAddress, [{
    key: "getAddressType",
    value: function getAddressType() {
      var addrBool = laksaUtils.isAddress(this.raw);
      var base58Bool = laksaUtils.isBase58(this.raw);
      var bech32Bool = laksaUtils.isBech32(this.raw);
      var checksumBool = isValidChecksumAddress(this.raw);

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
        var decoded = fromBech32Address(this.raw).toLowerCase();
        this.bytes20 = decoded.startsWith('0x') ? decoded.substring(2) : decoded;
        this.normalize();
      } else if (base58Bool === true && laksaUtils.isAddress(decodeBase58(this.raw))) {
        this.addressType = AddressType.base58;

        var _decoded = decodeBase58(this.raw).toLowerCase();

        this.bytes20 = _decoded.startsWith('0x') ? _decoded.substring(2) : _decoded;
        this.normalize();
      } else {
        throw new Error('unknown address');
      }
    }
  }, {
    key: "normalize",
    value: function normalize() {
      this.bytes20Hex = "0x".concat(this.bytes20);
      this.checkSum = toChecksumAddress(this.bytes20);
      this.base58 = encodeBase58(this.checkSum);
      this.bech32 = toBech32Address(this.checkSum);
    }
  }]);

  return ZilAddress;
}();

var secp256k1 = elliptic.ec('secp256k1');
/**
 * @function getAddressFromPrivateKey
 *
 * @description takes a hex-encoded string (private key) and return its corresponding
 * 20-byte hex-encoded address.
 * @param {String} Key
 * @return {String}
 */

var getAddressFromPrivateKey = function getAddressFromPrivateKey(privateKey) {
  var keyPair = secp256k1.keyFromPrivate(privateKey, 'hex');
  var pub = keyPair.getPublic(true, 'hex');
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

var getPubKeyFromPrivateKey = function getPubKeyFromPrivateKey(privateKey) {
  var keyPair = secp256k1.keyFromPrivate(privateKey, 'hex');
  return keyPair.getPublic(true, 'hex');
};
/**
 * @function compressPublicKey
 * @description comporess public key
 * @param {String} publicKey - 65-byte public key, a point (x, y)
 * @return {String}
 */

var compressPublicKey = function compressPublicKey(publicKey) {
  return secp256k1.keyFromPublic(publicKey, 'hex').getPublic(true, 'hex');
};
/**
 * @function getAddressFromPublicKey
 *
 * @description takes hex-encoded string and return the corresponding address
 * @param {String} pubKey
 * @return {String}
 */

var getAddressFromPublicKey = function getAddressFromPublicKey(pubKey) {
  return hashjs.sha256().update(pubKey, 'hex').digest('hex').slice(24);
};
/**
 * @function verifyPrivateKey
 * @description verify private key
 * @param {String|Buffer} privateKey
 * @return {Boolean}
 */

var verifyPrivateKey = function verifyPrivateKey(privateKey) {
  var keyPair = secp256k1.keyFromPrivate(privateKey, 'hex');

  var _keyPair$validate = keyPair.validate(),
      result = _keyPair$validate.result;

  return result;
};
/**
 * @function toChecksumAddress
 * @description convert address to checksum
 * @param  {String} address - address string
 * @return {String} checksumed address
 */

var toChecksumAddress = function toChecksumAddress(address) {
  var newAddress = address.toLowerCase().replace('0x', '');
  var hash = hashjs.sha256().update(newAddress, 'hex').digest('hex');
  var v = new BN(hash, 'hex', 'be');
  var ret = '0x';

  for (var i = 0; i < newAddress.length; i += 1) {
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

var isValidChecksumAddress = function isValidChecksumAddress(address) {
  var replacedAddress = address.replace('0x', '');
  return !!replacedAddress.match(/^[0-9a-fA-F]{40}$/) && toChecksumAddress(address) === address;
};
/**
 * @function encodeTransaction
 * @description encode transaction to protobuff standard
 * @param {Transaction|any} tx  - transaction object or Transaction instance
 * @return {Buffer}
 */

var encodeTransactionProto = function encodeTransactionProto(tx) {
  var msg = {
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
    code: tx.code && tx.code.length ? Uint8Array.from(_toConsumableArray(tx.code).map(function (c) {
      return c.charCodeAt(0);
    })) : null,
    data: tx.data && tx.data.length ? Uint8Array.from(_toConsumableArray(tx.data).map(function (c) {
      return c.charCodeAt(0);
    })) : null
  };
  var serialised = proto.ZilliqaMessage.ProtoTransactionCoreInfo.create(msg);
  return Buffer.from(proto.ZilliqaMessage.ProtoTransactionCoreInfo.encode(serialised).finish());
};
/**
 * @function getAddressForContract
 * @param  {Object} param
 * @param  {Number} param.currentNonce - current nonce number
 * @param  {String} param.address      - deployer's address
 * @return {String} Contract address
 */

var getAddressForContract = function getAddressForContract(_ref) {
  var currentNonce = _ref.currentNonce,
      address = _ref.address;
  // always subtract 1 from the tx nonce, as contract addresses are computed
  // based on the nonce in the global state.
  var nonce = currentNonce ? currentNonce - 1 : 0;
  return hashjs.sha256().update(address, 'hex').update(intToHexArray(nonce, 64).join(''), 'hex').digest('hex').slice(24);
};
/**
 * @function checkValidSignature
 * @description verify if signature is length===128
 * @param  {Signature} sig - Signature
 * @return {Boolean}
 */

var checkValidSignature = function checkValidSignature(sig) {
  return sig.r.toString('hex').length + sig.s.toString('hex').length === 128;
};
var encodeBase58 = function encodeBase58(hex) {
  var clean = hex.toLowerCase().replace('0x', '');
  var tbl = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  var base = new BN(58);
  var zero = new BN(0);
  var x = new BN(clean, 16);
  var res = '';

  while (x.gt(zero)) {
    var rem = x.mod(base).toNumber(); // safe, always < 58
    // big endian

    res = tbl[rem] + res; // quotient, remainders thrown away in integer division

    x = x.div(base);
  } // convert to big endian in case the input hex is little endian


  var hexBE = x.toString('hex', clean.length);

  for (var i = 0; i < hexBE.length; i += 2) {
    if (hex[i] === '0' && hex[i + 1] === '0') {
      res = tbl[0] + res;
    } else {
      break;
    }
  }

  return res;
};
var decodeBase58 = function decodeBase58(raw) {
  var tbl = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  var base = new BN(58);
  var zero = new BN(0);
  var isBreak = false;
  var n = new BN(0);
  var leader = '';

  for (var i = 0; i < raw.length; i += 1) {
    var char = raw.charAt(i);
    var weight = new BN(tbl.indexOf(char));
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

  var res = leader + n.toString('hex');

  if (res.length % 2 !== 0) {
    res = "0".concat(res);
  }

  return res;
};
var getAddress = function getAddress(address, fromType, toType) {
  if (!laksaUtils.isString(address)) {
    throw new Error("".concat(address, " is not string"));
  }

  var zilAddr = new ZilAddress(address);
  var validateType = fromType === undefined || fromType.length === 0 ? [] : fromType;
  var total = 0;
  total = validateType.length > 0 ? validateType.map(function (type) {
    var value = zilAddr.addressType === type ? 1 : 0;
    return value;
  }).reduce(function (pre, cur) {
    return pre + cur;
  }) : 0;

  if (total === 0 && validateType.length > 0) {
    throw new Error('Address format is invalid');
  }

  switch (toType) {
    case AddressType.bytes20:
      {
        if (!zilAddr.bytes20) {
          throw new Error("can not convert to ".concat(toType));
        } else {
          return zilAddr.bytes20;
        }
      }

    case AddressType.bytes20Hex:
      {
        if (!zilAddr.bytes20Hex) {
          throw new Error("can not convert to ".concat(toType));
        } else {
          return zilAddr.bytes20Hex;
        }
      }

    case AddressType.base58:
      {
        if (!zilAddr.base58) {
          throw new Error("can not convert to ".concat(toType));
        } else {
          return zilAddr.base58;
        }
      }

    case AddressType.bech32:
      {
        if (!zilAddr.bech32) {
          throw new Error("can not convert to ".concat(toType));
        } else {
          return zilAddr.bech32;
        }
      }

    case AddressType.checkSum:
      {
        if (!zilAddr.checkSum) {
          throw new Error("can not convert to ".concat(toType));
        } else {
          return zilAddr.checkSum;
        }
      }

    default:
      return zilAddr.raw;
  }
};

var secp256k1$1 = elliptic.ec('secp256k1');
var curve = secp256k1$1.curve;
var PRIVKEY_SIZE_BYTES = 32; // Public key is a point (x, y) on the curve.
// Each coordinate requires 32 bytes.
// In its compressed form it suffices to store the x co-ordinate
// and the sign for y.
// Hence a total of 33 bytes.

var PUBKEY_COMPRESSED_SIZE_BYTES = 33; // Personalization string used for HMAC-DRBG instantiation.

var ALG = Buffer.from('Schnorr+SHA256  ', 'ascii'); // The length in bytes of the string above.

var ALG_LEN = 16; // The length in bytes of entropy inputs to HMAC-DRBG

var ENT_LEN = 32;
var HEX_ENC = 'hex';
/**
 * @function generatePrivateKey
 * @description generate a private key
 * @return {String} the hex-encoded private key
 */

var generatePrivateKey = function generatePrivateKey() {
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

var hash = function hash(q, pubkey, msg) {
  var sha256 = hashjs.sha256();
  var pubSize = PUBKEY_COMPRESSED_SIZE_BYTES * 2;
  var totalLength = pubSize + msg.byteLength; // 33 q + 33 pubkey + variable msgLen

  var Q = q.toArrayLike(Buffer, 'be', 33);
  var B = Buffer.allocUnsafe(totalLength);
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

var sign = function sign(msg, privKey, pubKey) {
  var prv = new BN(privKey);
  var drbg = getDRBG(msg);
  var len = curve.n.byteLength();
  var sig;

  while (!sig) {
    var k = new BN(drbg.generate(len));
    var trySig = trySign(msg, k, prv, pubKey);
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

var trySign = function trySign(msg, k, privKey, pubKey) {
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


  var Q = curve.g.mul(k); // convert the commitment to octets first

  var compressedQ = new BN(Q.encodeCompressed()); // 3. Compute the challenge r = H(Q || pubKey || msg)
  // mod reduce the r value by the order of secp256k1, n

  var r = hash(compressedQ, pubKey, msg).umod(curve.n);
  var h = r.clone();

  if (h.isZero()) {
    return null;
  } // 4. Compute s = k - r * prv
  // 4a. Compute r * prv


  var s = h.imul(privKey).umod(curve.n); // 4b. Compute s = k - r * prv mod n

  s = k.isub(s).umod(curve.n);

  if (s.isZero()) {
    return null;
  }

  return new Signature({
    r: r,
    s: s
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

var verify = function verify(msg, signature, key) {
  var sig = new Signature(signature);

  if (sig.s.isZero() || sig.r.isZero()) {
    throw new Error('Invalid signature');
  }

  if (sig.s.isNeg() || sig.r.isNeg()) {
    throw new Error('Invalid signature');
  }

  if (sig.s.gte(curve.n) || sig.r.gte(curve.n)) {
    throw new Error('Invalid signature');
  }

  var kpub = curve.decodePoint(key);

  if (!curve.validate(kpub)) {
    throw new Error('Invalid public key');
  }

  var l = kpub.mul(sig.r);
  var r = curve.g.mul(sig.s);
  var Q = l.add(r);

  if (Q.isInfinity()) {
    throw new Error('Invalid intermediate point.');
  }

  var compressedQ = new BN(Q.encodeCompressed());
  var r1 = hash(compressedQ, key, msg).umod(curve.n);

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

var toSignature = function toSignature(serialised) {
  var r = serialised.slice(0, 64);
  var s = serialised.slice(64);
  return new Signature({
    r: r,
    s: s
  });
};
/**
 * @function getDRBG
 * @description generate an HMAC-DRBG.
 * @param {Buffer} entropy
 * @return {DRBG}
 */

var getDRBG = function getDRBG(msg) {
  var entropy = randomBytes(ENT_LEN);
  var pers = Buffer.allocUnsafe(ALG_LEN + ENT_LEN);
  Buffer.from(randomBytes(ENT_LEN)).copy(pers, 0);
  ALG.copy(pers, ENT_LEN);
  return new DRBG({
    hash: hashjs.sha256,
    entropy: entropy,
    nonce: msg,
    pers: pers
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

var signTest = function signTest(msg, k, prv, pub) {
  var msgBuffer = Buffer.from(msg, 'hex');
  var kBN = new BN(Buffer.from(k, 'hex'));
  var privBN = new BN(Buffer.from(prv, 'hex'));
  var pubBuffer = Buffer.from(pub, 'hex');
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

var generatePrivateKey$1 = generatePrivateKey;
var sign$1 = function sign$$1(msg, privateKey, pubKey) {
  var sig = sign(msg, Buffer.from(privateKey, 'hex'), Buffer.from(pubKey, 'hex'));
  var r = sig.r.toString('hex');
  var s = sig.s.toString('hex');

  while (r.length < 64) {
    r = "0".concat(r);
  }

  while (s.length < 64) {
    s = "0".concat(s);
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
