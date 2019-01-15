'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
require('core-js/modules/es6.regexp.to-string');
require('regenerator-runtime/runtime');
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
require('core-js/modules/es6.promise');
var aes = _interopDefault(require('aes-js'));
var pbkdf2 = require('pbkdf2');
var scrypt = _interopDefault(require('scrypt.js'));
var uuid = _interopDefault(require('uuid'));
var laksaCoreCrypto = require('laksa-core-crypto');

var ALGO_IDENTIFIER = 'aes-128-ctr';
/**
 * getDerivedKey
 *
 * NOTE: only scrypt and pbkdf2 are supported.
 *
 * @param {Buffer} key - the passphrase
 * @param {KDF} kdf - the key derivation function to be used
 * @param {KDFParams} params - params for the kdf
 *
 * @returns {Promise<Buffer>}
 */

var getDerivedKey = function getDerivedKey(key, kdf, params) {
  return new Promise(function (resolve, reject) {
    var n = params.n,
        r = params.r,
        p = params.p,
        dklen = params.dklen;
    var salt = Buffer.from(params.salt);

    if (kdf !== 'pbkdf2' && kdf !== 'scrypt') {
      reject(new Error('Only pbkdf2 and scrypt are supported'));
    }

    var derivedKey = kdf === 'scrypt' ? scrypt(key, salt, n, r, p, dklen) : pbkdf2.pbkdf2Sync(key, salt, n, dklen, 'sha256');
    resolve(derivedKey);
  });
};
/**
 * encryptPrivateKey
 *
 * Encodes and encrypts an account in the format specified by
 * https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition.
 * However, note that, in keeping with the hash function used by Zilliqa's
 * core protocol, the MAC is generated using sha256 instead of keccak.
 *
 * NOTE: only scrypt and pbkdf2 are supported.
 *
 * @param {KDF} kdf - the key derivation function to be used
 * @param {string} privateKey - hex-encoded private key
 * @param {string} passphrase - a passphrase used for encryption
 *
 * @returns {Promise<string>}
 */


var encrypt =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(privateKey, passphrase, options) {
    var salt, iv, kdf, level, n, kdfparams, derivedKey, CTR, cipher, ciphertext;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            salt = laksaCoreCrypto.randomBytes(32);
            iv = Buffer.from(laksaCoreCrypto.randomBytes(16), 'hex');
            kdf = options !== undefined ? options.kdf ? options.kdf : 'scrypt' : 'scrypt';
            level = options !== undefined ? options.level ? options.level : 8192 : 8192;
            n = kdf === 'pbkdf2' ? 262144 : level;
            kdfparams = {
              salt: salt,
              n: n,
              r: 8,
              p: 1,
              dklen: 32
            };
            _context.next = 8;
            return getDerivedKey(Buffer.from(passphrase), kdf, kdfparams);

          case 8:
            derivedKey = _context.sent;
            CTR = aes.ModeOfOperation.ctr;
            cipher = new CTR(derivedKey.slice(0, 16), new aes.Counter(iv));
            ciphertext = Buffer.from(cipher.encrypt(Buffer.from(privateKey, 'hex')));
            return _context.abrupt("return", {
              crypto: {
                cipher: ALGO_IDENTIFIER,
                cipherparams: {
                  iv: iv.toString('hex')
                },
                ciphertext: ciphertext.toString('hex'),
                kdf: kdf,
                kdfparams: kdfparams,
                mac: laksaCoreCrypto.hashjs.hmac(laksaCoreCrypto.hashjs.sha256, derivedKey, 'hex').update(Buffer.concat([derivedKey.slice(16, 32), ciphertext, iv, Buffer.from(ALGO_IDENTIFIER)]), 'hex').digest('hex')
              },
              id: uuid.v4({
                random: laksaCoreCrypto.randomBytes(16)
              }),
              version: 3
            });

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function encrypt(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * decryptPrivateKey
 *
 * Recovers the private key from a keystore file using the given passphrase.
 *
 * @param {string} passphrase
 * @param {KeystoreV3} keystore
 * @returns {Promise<string>}
 */

var decrypt =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee2(keystore, passphrase) {
    var ciphertext, iv, kdfparams, derivedKey, mac, CTR, cipher, decrypted;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            ciphertext = Buffer.from(keystore.crypto.ciphertext, 'hex');
            iv = Buffer.from(keystore.crypto.cipherparams.iv, 'hex');
            kdfparams = keystore.crypto.kdfparams;
            _context2.next = 5;
            return getDerivedKey(Buffer.from(passphrase), keystore.crypto.kdf, kdfparams);

          case 5:
            derivedKey = _context2.sent;
            mac = laksaCoreCrypto.hashjs.hmac(laksaCoreCrypto.hashjs.sha256, derivedKey, 'hex').update(Buffer.concat([derivedKey.slice(16, 32), ciphertext, iv, Buffer.from(ALGO_IDENTIFIER)]), 'hex').digest('hex');

            if (!(mac.toUpperCase() !== keystore.crypto.mac.toUpperCase())) {
              _context2.next = 9;
              break;
            }

            return _context2.abrupt("return", Promise.reject(new Error('Failed to decrypt.')));

          case 9:
            CTR = aes.ModeOfOperation.ctr;
            cipher = new CTR(derivedKey.slice(0, 16), new aes.Counter(iv));
            decrypted = Buffer.from(cipher.decrypt(ciphertext)).toString('hex');
            return _context2.abrupt("return", decrypted);

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function decrypt(_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

exports.uuid = uuid;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
