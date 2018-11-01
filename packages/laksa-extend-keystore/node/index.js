(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('aes-js'), require('pbkdf2'), require('scrypt.js'), require('uuid'), require('laksa-core-crypto')) :
  typeof define === 'function' && define.amd ? define(['exports', 'aes-js', 'pbkdf2', 'scrypt.js', 'uuid', 'laksa-core-crypto'], factory) :
  (factory((global.Laksa = {}),global.aes,global.pbkdf2,global.scrypt,global.uuid,global.laksaCoreCrypto));
}(this, (function (exports,aes,pbkdf2,scrypt,uuid,laksaCoreCrypto) { 'use strict';

  aes = aes && aes.hasOwnProperty('default') ? aes['default'] : aes;
  scrypt = scrypt && scrypt.hasOwnProperty('default') ? scrypt['default'] : scrypt;
  uuid = uuid && uuid.hasOwnProperty('default') ? uuid['default'] : uuid;

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

  const getDerivedKey = (key, kdf, params) => {
    return new Promise((resolve, reject) => {
      const {
        n,
        r,
        p,
        dklen
      } = params;
      const salt = Buffer.from(params.salt);

      if (kdf !== 'pbkdf2' && kdf !== 'scrypt') {
        reject(new Error('Only pbkdf2 and scrypt are supported'));
      }

      const derivedKey = kdf === 'scrypt' ? scrypt(key, salt, n, r, p, dklen) : pbkdf2.pbkdf2Sync(key, salt, n, dklen, 'sha256');
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


  const encrypt = async (privateKey, passphrase, options) => {
    const salt = laksaCoreCrypto.randomBytes(32);
    const iv = Buffer.from(laksaCoreCrypto.randomBytes(16), 'hex');
    const kdf = options !== undefined ? options.kdf ? options.kdf : 'scrypt' : 'scrypt';
    const level = options !== undefined ? options.level ? options.level : 8192 : 8192;
    const n = kdf === 'pbkdf2' ? 262144 : level;
    const kdfparams = {
      salt,
      n,
      r: 8,
      p: 1,
      dklen: 32
    };
    const derivedKey = await getDerivedKey(Buffer.from(passphrase), kdf, kdfparams);
    const CTR = aes.ModeOfOperation.ctr;
    const cipher = new CTR(derivedKey.slice(0, 16), new aes.Counter(iv));
    const ciphertext = Buffer.from(cipher.encrypt(Buffer.from(privateKey, 'hex')));
    return {
      crypto: {
        cipher: 'aes-128-ctr',
        cipherparams: {
          iv: iv.toString('hex')
        },
        ciphertext: ciphertext.toString('hex'),
        kdf,
        kdfparams,
        mac: laksaCoreCrypto.hashjs.sha256().update(Buffer.concat([derivedKey.slice(16, 32), ciphertext]), 'hex').digest('hex')
      },
      id: uuid.v4({
        random: laksaCoreCrypto.randomBytes(16)
      }),
      version: 3
    };
  };
  /**
   * decryptPrivateKey
   *
   * Recovers the private key from a keystore file using the given passphrase.
   *
   * @param {string} passphrase
   * @param {KeystoreV3} keystore
   * @returns {Promise<string>}
   */

  const decrypt = async (keystore, passphrase) => {
    const ciphertext = Buffer.from(keystore.crypto.ciphertext, 'hex');
    const iv = Buffer.from(keystore.crypto.cipherparams.iv, 'hex');
    const {
      kdfparams
    } = keystore.crypto;
    const derivedKey = await getDerivedKey(Buffer.from(passphrase), keystore.crypto.kdf, kdfparams);
    const mac = laksaCoreCrypto.hashjs.sha256().update(Buffer.concat([derivedKey.slice(16, 32), ciphertext]), 'hex').digest('hex');

    if (mac.toUpperCase() !== keystore.crypto.mac.toUpperCase()) {
      return Promise.reject(new Error('Failed to decrypt.'));
    }

    const CTR = aes.ModeOfOperation.ctr;
    const cipher = new CTR(derivedKey.slice(0, 16), new aes.Counter(iv));
    const decrypted = Buffer.from(cipher.decrypt(ciphertext)).toString('hex');
    return decrypted;
  };

  exports.encrypt = encrypt;
  exports.decrypt = decrypt;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
