"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTransactionJson = exports.encodeTransaction = exports.verifyPrivateKey = exports.getAddressFromPublicKey = exports.compressPublicKey = exports.getPubKeyFromPrivateKey = exports.getAddressFromPrivateKey = exports.generatePrivateKey = void 0;

var _randombytes = _interopRequireDefault(require("randombytes"));

var _elliptic = _interopRequireDefault(require("elliptic"));

var _hash = _interopRequireDefault(require("hash.js"));

var _schnorr = _interopRequireDefault(require("./schnorr"));

var NUM_BYTES = 32; // const HEX_PREFIX = '0x';

var secp256k1 = _elliptic.default.ec('secp256k1');

var schnorr = new _schnorr.default();
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
 * generatePrivateKey
 *
 * @returns {string} - the hex-encoded private key
 */


var generatePrivateKey = function generatePrivateKey() {
  var priv = '';
  var rand = (0, _randombytes.default)(NUM_BYTES);

  for (var i = 0; i < rand.byteLength; i += 1) {
    // add 00 in case we get an empty byte.
    var byte = rand[i];
    var hexstr = '00'.concat(byte.toString(16)).slice(-2);
    priv += hexstr;
  }

  return priv;
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


exports.generatePrivateKey = generatePrivateKey;

var getAddressFromPrivateKey = function getAddressFromPrivateKey(privateKey) {
  var keyPair = secp256k1.keyFromPrivate(privateKey, 'hex');
  var pub = keyPair.getPublic(true, 'hex');
  return _hash.default.sha256().update(pub, 'hex').digest('hex').slice(24);
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


exports.getAddressFromPrivateKey = getAddressFromPrivateKey;

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


exports.getPubKeyFromPrivateKey = getPubKeyFromPrivateKey;

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


exports.compressPublicKey = compressPublicKey;

var getAddressFromPublicKey = function getAddressFromPublicKey(pubKey) {
  return _hash.default.sha256().update(pubKey, 'hex').digest('hex').slice(24);
};
/**
 * verifyPrivateKey
 *
 * @param {string|Buffer} privateKey
 * @returns {boolean}
 */


exports.getAddressFromPublicKey = getAddressFromPublicKey;

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


exports.verifyPrivateKey = verifyPrivateKey;

var encodeTransaction = function encodeTransaction(txn) {
  var codeHex = Buffer.from(txn.code).toString('hex');
  var dataHex = Buffer.from(txn.data).toString('hex');
  var encoded = intToByteArray(txn.version, 64).join('') + intToByteArray(txn.nonce, 64).join('') + txn.to + txn.pubKey // + txn.amount.toString('hex', 64)
  // update later
  + intToByteArray(txn.amount, 64).join('') + intToByteArray(txn.gasPrice, 64).join('') + intToByteArray(txn.gasLimit, 64).join('') + intToByteArray(txn.code.length, 8).join('') // size of code
  + codeHex + intToByteArray(txn.data.length, 8).join('') // size of data
  + dataHex;
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


exports.encodeTransaction = encodeTransaction;

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
  var encodedTx = encodeTransaction(txn); // sign using schnorr lib

  var sig = schnorr.sign(encodedTx, Buffer.from(privateKey, 'hex'), Buffer.from(pubKey, 'hex'));
  var r = sig.r.toString('hex');
  var s = sig.s.toString('hex');

  while (r.length < 64) {
    r = "0".concat(r);
  }

  while (s.length < 64) {
    s = "0".concat(s);
  }

  txn.signature = r + s;
  return txn;
};

exports.createTransactionJson = createTransactionJson;