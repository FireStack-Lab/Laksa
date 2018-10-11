'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es6.regexp.to-string');
require('core-js/modules/es6.typed.uint8-array');
var randomBytes = require('randomBytes');
require('core-js/modules/es6.array.fill');
var assert = _interopDefault(require('bsert'));
var elliptic = _interopDefault(require('elliptic'));
var BN = _interopDefault(require('bn.js'));
var hashjs = _interopDefault(require('hash.js'));
var DRBG = _interopDefault(require('hmac-drbg'));
var Signature = _interopDefault(require('elliptic/lib/elliptic/ec/signature'));
require('core-js/modules/es6.regexp.match');
require('core-js/modules/es6.regexp.replace');

var randomBytes$1 = function randomBytes$$1(bytes) {
  var randBz;

  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    randBz = window.crypto.getRandomValues(new Uint8Array(bytes));
  } else if (typeof require !== 'undefined') {
    // randBz = require('crypto').randomBytes(bytes)
    randBz = randomBytes.randomBytes(bytes);
  } else {
    throw new Error('Unable to generate safe random numbers.');
  }

  var randStr = '';

  for (var i = 0; i < bytes; i += 1) {
    randStr += "00".concat(randBz[i].toString(16)).slice(-2);
  }

  return randStr;
};

var _elliptic$ec = elliptic.ec('secp256k1'),
    curve = _elliptic$ec.curve; // Public key is a point (x, y) on the curve.
// Each coordinate requires 32 bytes.
// In its compressed form it suffices to store the x co-ordinate
// and the sign for y.
// Hence a total of 33 bytes.


var PUBKEY_COMPRESSED_SIZE_BYTES = 33;
/**
 * Hash (r | M).
 * @param {Buffer} msg
 * @param {BN} r
 *
 * @returns {Buffer}
 */

var hash = function hash(q, pubkey, msg) {
  var sha256 = hashjs.sha256();
  var totalLength = PUBKEY_COMPRESSED_SIZE_BYTES * 2 + msg.byteLength; // 33 q + 33 pubkey + variable msgLen

  var Q = q.toArrayLike(Buffer, 'be', 33);
  var B = Buffer.allocUnsafe(totalLength);
  Q.copy(B, 0);
  pubkey.copy(B, 33);
  msg.copy(B, 66);
  return new BN(sha256.update(B).digest('hex'), 16);
};
/**
 * sign
 *
 * @param {Buffer} msg
 * @param {Buffer} key
 * @param {Buffer} pubkey
 * @param {Buffer} pubNonce?
 *
 * @returns {Signature}
 */

var sign = function sign(msg, key, pubkey) {
  var prv = new BN(key);
  var drbg = getDRBG(msg, key);
  var len = curve.n.byteLength();
  var sig;

  while (!sig) {
    var k = new BN(drbg.generate(len));
    sig = trySign(msg, prv, k, pubkey);
  }

  return sig;
};
/**
 * trySign
 *
 * @param {Buffer} msg
 * @param {BN} prv - private key
 * @param {BN} k - DRBG-generated random number
 * @param {Buffer} pn - optional
 * @param {Buffer)} pubKey - public key
 *
 * @returns {Signature | null =>}
 */

var trySign = function trySign(msg, prv, k, pubKey) {
  if (prv.isZero()) throw new Error('Bad private key.');
  if (prv.gte(curve.n)) throw new Error('Bad private key.'); // 1a. check that k is not 0

  if (k.isZero()) return null; // 1b. check that k is < the order of the group

  if (k.gte(curve.n)) return null; // 2. Compute commitment Q = kG, where g is the base point

  var Q = curve.g.mul(k); // convert the commitment to octets first

  var compressedQ = new BN(Q.encodeCompressed()); // 3. Compute the challenge r = H(Q || pubKey || msg)

  var r = hash(compressedQ, pubKey, msg);
  var h = r.clone();
  if (h.isZero()) return null;
  if (h.eq(curve.n)) return null; // 4. Compute s = k - r * prv
  // 4a. Compute r * prv

  var s = h.imul(prv); // 4b. Compute s = k - r * prv mod n

  s = k.isub(s);
  s = s.umod(curve.n);
  if (s.isZero()) return null;
  return new Signature({
    r: r,
    s: s
  });
};
/**
 * Schnorr personalization string.
 * @const {Buffer}
 */

var alg = Buffer.from('Schnorr+SHA256  ', 'ascii');
/**
 * Instantiate an HMAC-DRBG.
 *
 * @param {Buffer} msg
 * @param {Buffer} priv - used as entropy input
 * @param {Buffer} data - used as nonce
 *
 * @returns {DRBG}
 */

var getDRBG = function getDRBG(msg, priv, data) {
  var pers = Buffer.allocUnsafe(48);
  pers.fill(0);

  if (data) {
    assert(data.length === 32);
    data.copy(pers, 0);
  }

  alg.copy(pers, 32);
  return new DRBG({
    hash: hashjs.sha256,
    entropy: priv,
    nonce: msg,
    pers: pers
  });
};

var NUM_BYTES = 32; // const HEX_PREFIX = '0x';

var secp256k1 = elliptic.ec('secp256k1');
/**
 * convert number to array representing the padded hex form
 * @param  {[string]} val        [description]
 * @param  {[number]} paddedSize [description]
 * @return {[string]}            [description]
 */

var intToByteArray = function intToByteArray(val, paddedSize) {
  var arr = [];
  var hexVal = val.toString(16);
  var hexRep = [];
  var i;

  for (i = 0; i < hexVal.length; i += 1) {
    hexRep[i] = hexVal[i].toString();
  }

  for (i = 0; i < paddedSize - hexVal.length; i += 1) {
    arr.push('0');
  }

  for (i = 0; i < hexVal.length; i += 1) {
    arr.push(hexRep[i]);
  }

  return arr;
};
/**
 * isHex
 *
 * @param {string} str - string to be tested
 * @returns {boolean}
 */

var isHex = function isHex(str) {
  var plain = str.replace('0x', '');
  return /[0-9a-f]*$/i.test(plain);
};
/**
 * hexToIntArray
 *
 * @param {string} hex
 * @returns {number[]}
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
    } else {
      res.push(lo);
    }
  }

  return res;
};
/**
 * generatePrivateKey
 *
 * @returns {string} - the hex-encoded private key
 */

var generatePrivateKey = function generatePrivateKey() {
  return randomBytes$1(NUM_BYTES);
};
/**
 * getAddressFromPrivateKey
 *
 * takes a hex-encoded string (private key) and returns its corresponding
 * 20-byte hex-encoded address.
 *
 * @param {string} Key
 * @returns {string}
 */

var getAddressFromPrivateKey = function getAddressFromPrivateKey(privateKey) {
  var keyPair = secp256k1.keyFromPrivate(privateKey, 'hex');
  var pub = keyPair.getPublic(true, 'hex');
  return hashjs.sha256().update(pub, 'hex').digest('hex').slice(24);
};
/**
 * getPubKeyFromPrivateKey
 *
 * takes a hex-encoded string (private key) and returns its corresponding
 * hex-encoded 33-byte public key.
 *
 * @param {string} privateKey
 * @returns {string}
 */

var getPubKeyFromPrivateKey = function getPubKeyFromPrivateKey(privateKey) {
  var keyPair = secp256k1.keyFromPrivate(privateKey, 'hex');
  return keyPair.getPublic(true, 'hex');
};
/**
 * compressPublicKey
 *
 * @param {string} publicKey - 65-byte public key, a point (x, y)
 *
 * @returns {string}
 */

var compressPublicKey = function compressPublicKey(publicKey) {
  return secp256k1.keyFromPublic(publicKey, 'hex').getPublic(true, 'hex');
};
/**
 * getAddressFromPublicKey
 *
 * takes hex-encoded string and returns the corresponding address
 *
 * @param {string} pubKey
 * @returns {string}
 */

var getAddressFromPublicKey = function getAddressFromPublicKey(pubKey) {
  return hashjs.sha256().update(pubKey, 'hex').digest('hex').slice(24);
};
/**
 * verifyPrivateKey
 *
 * @param {string|Buffer} privateKey
 * @returns {boolean}
 */

var verifyPrivateKey = function verifyPrivateKey(privateKey) {
  var keyPair = secp256k1.keyFromPrivate(privateKey, 'hex');

  var _keyPair$validate = keyPair.validate(),
      result = _keyPair$validate.result;

  return result;
};
/**
 * encodeTransaction
 *
 * @param {any} txn
 * @returns {Buffer}
 */

var encodeTransaction = function encodeTransaction(txn) {
  var codeHex = Buffer.from(txn.code).toString('hex');
  var dataHex = Buffer.from(txn.data).toString('hex');
  var encoded = intToByteArray(txn.version, 64).join('') + intToByteArray(txn.nonce, 64).join('') + txn.to + txn.pubKey + txn.amount.toString('hex', 64) + intToByteArray(txn.gasPrice, 64).join('') + intToByteArray(txn.gasLimit, 64).join('') + intToByteArray(txn.code.length, 8).join('') + // size of code
  codeHex + intToByteArray(txn.data.length, 8).join('') + // size of data
  dataHex;
  return Buffer.from(encoded, 'hex');
};
/**
 * createTransactionJson
 *
 * @param {string} privateKey
 * @param {TxDetails} txnDetails
 * @param {TxDetails}
 *
 * @returns {TxDetails}
 */

var createTransactionJson = function createTransactionJson(privateKey, txnDetails) {
  var pubKey = getPubKeyFromPrivateKey(privateKey);
  var txn = {
    version: txnDetails.version,
    nonce: txnDetails.nonce,
    to: txnDetails.to,
    amount: txnDetails.amount,
    pubKey: pubKey,
    gasPrice: txnDetails.gasPrice,
    gasLimit: txnDetails.gasLimit,
    code: txnDetails.code || '',
    data: txnDetails.data || ''
  };
  var encodedTx = encodeTransaction(txn);
  txn.signature = sign$1(encodedTx, Buffer.from(privateKey, 'hex'), Buffer.from(pubKey, 'hex'));
  return txn;
};
/**
 * sign
 *
 * @param {string} hash - hex-encoded hash of the data to be signed
 *
 * @returns {string} the signature
 */

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
var toChecksumAddress = function toChecksumAddress(address) {
  var newAddress = address.toLowerCase().replace('0x', '');
  var hash$$1 = hashjs.sha256().update(newAddress, 'hex').digest('hex');
  var ret = '0x';

  for (var i = 0; i < newAddress.length; i += 1) {
    if (parseInt(hash$$1[i], 16) >= 8) {
      ret += newAddress[i].toUpperCase();
    } else {
      ret += newAddress[i];
    }
  }

  return ret;
};
/**
 * isValidChecksumAddress
 *
 * takes hex-encoded string and returns boolean if address is checksumed
 *
 * @param {string} address
 * @returns {boolean}
 */

var isValidChecksumAddress = function isValidChecksumAddress(address) {
  var replacedAddress = address.replace('0x', '');
  return !!replacedAddress.match(/^[0-9a-fA-F]{40}$/) && toChecksumAddress(address) === address;
};

exports.hashjs = hashjs;
exports.intToByteArray = intToByteArray;
exports.hexToIntArray = hexToIntArray;
exports.generatePrivateKey = generatePrivateKey;
exports.getAddressFromPrivateKey = getAddressFromPrivateKey;
exports.getPubKeyFromPrivateKey = getPubKeyFromPrivateKey;
exports.compressPublicKey = compressPublicKey;
exports.getAddressFromPublicKey = getAddressFromPublicKey;
exports.verifyPrivateKey = verifyPrivateKey;
exports.encodeTransaction = encodeTransaction;
exports.createTransactionJson = createTransactionJson;
exports.sign = sign$1;
exports.toChecksumAddress = toChecksumAddress;
exports.isValidChecksumAddress = isValidChecksumAddress;
exports.randomBytes = randomBytes$1;
