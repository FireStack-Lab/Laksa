(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('randomBytes'), require('bsert'), require('elliptic'), require('bn.js'), require('hash.js'), require('hmac-drbg'), require('elliptic/lib/elliptic/ec/signature')) :
  typeof define === 'function' && define.amd ? define(['exports', 'randomBytes', 'bsert', 'elliptic', 'bn.js', 'hash.js', 'hmac-drbg', 'elliptic/lib/elliptic/ec/signature'], factory) :
  (factory((global.Laksa = {}),global.randomBytes,global.assert,global.elliptic,global.BN,global.hashjs,global.DRBG,global.Signature));
}(this, (function (exports,randomBytes,assert,elliptic,BN,hashjs,DRBG,Signature) { 'use strict';

  assert = assert && assert.hasOwnProperty('default') ? assert['default'] : assert;
  elliptic = elliptic && elliptic.hasOwnProperty('default') ? elliptic['default'] : elliptic;
  BN = BN && BN.hasOwnProperty('default') ? BN['default'] : BN;
  hashjs = hashjs && hashjs.hasOwnProperty('default') ? hashjs['default'] : hashjs;
  DRBG = DRBG && DRBG.hasOwnProperty('default') ? DRBG['default'] : DRBG;
  Signature = Signature && Signature.hasOwnProperty('default') ? Signature['default'] : Signature;

  /**
   * randomBytes
   *
   * Uses JS-native CSPRNG to generate a specified number of bytes.
   * NOTE: this method throws if no PRNG is available.
   *
   * @param {number} bytes
   * @returns {string}
   */
  const randomBytes$1 = bytes => {
    let randBz;

    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      randBz = window.crypto.getRandomValues(new Uint8Array(bytes));
    } else if (typeof require !== 'undefined') {
      // randBz = require('crypto').randomBytes(bytes)
      randBz = randomBytes.randomBytes(bytes);
    } else {
      throw new Error('Unable to generate safe random numbers.');
    }

    let randStr = '';

    for (let i = 0; i < bytes; i += 1) {
      randStr += `00${randBz[i].toString(16)}`.slice(-2);
    }

    return randStr;
  };

  const {
    curve
  } = elliptic.ec('secp256k1'); // Public key is a point (x, y) on the curve.
  // Each coordinate requires 32 bytes.
  // In its compressed form it suffices to store the x co-ordinate
  // and the sign for y.
  // Hence a total of 33 bytes.

  const PUBKEY_COMPRESSED_SIZE_BYTES = 33;
  /**
   * Hash (r | M).
   * @param {Buffer} msg
   * @param {BN} r
   *
   * @returns {Buffer}
   */

  const hash = (q, pubkey, msg) => {
    const sha256 = hashjs.sha256();
    const totalLength = PUBKEY_COMPRESSED_SIZE_BYTES * 2 + msg.byteLength; // 33 q + 33 pubkey + variable msgLen

    const Q = q.toArrayLike(Buffer, 'be', 33);
    const B = Buffer.allocUnsafe(totalLength);
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

  const sign = (msg, key, pubkey) => {
    const prv = new BN(key);
    const drbg = getDRBG(msg, key);
    const len = curve.n.byteLength();
    let sig;

    while (!sig) {
      const k = new BN(drbg.generate(len));
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

  const trySign = (msg, prv, k, pubKey) => {
    if (prv.isZero()) throw new Error('Bad private key.');
    if (prv.gte(curve.n)) throw new Error('Bad private key.'); // 1a. check that k is not 0

    if (k.isZero()) return null; // 1b. check that k is < the order of the group

    if (k.gte(curve.n)) return null; // 2. Compute commitment Q = kG, where g is the base point

    const Q = curve.g.mul(k); // convert the commitment to octets first

    const compressedQ = new BN(Q.encodeCompressed()); // 3. Compute the challenge r = H(Q || pubKey || msg)

    const r = hash(compressedQ, pubKey, msg);
    const h = r.clone();
    if (h.isZero()) return null;
    if (h.eq(curve.n)) return null; // 4. Compute s = k - r * prv
    // 4a. Compute r * prv

    let s = h.imul(prv); // 4b. Compute s = k - r * prv mod n

    s = k.isub(s);
    s = s.umod(curve.n);
    if (s.isZero()) return null;
    return new Signature({
      r,
      s
    });
  };
  /**
   * Schnorr personalization string.
   * @const {Buffer}
   */

  const alg = Buffer.from('Schnorr+SHA256  ', 'ascii');
  /**
   * Instantiate an HMAC-DRBG.
   *
   * @param {Buffer} msg
   * @param {Buffer} priv - used as entropy input
   * @param {Buffer} data - used as nonce
   *
   * @returns {DRBG}
   */

  const getDRBG = (msg, priv, data) => {
    const pers = Buffer.allocUnsafe(48);
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
      pers
    });
  };

  const NUM_BYTES = 32; // const HEX_PREFIX = '0x';

  const secp256k1 = elliptic.ec('secp256k1');
  /**
   * convert number to array representing the padded hex form
   * @param  {[string]} val        [description]
   * @param  {[number]} paddedSize [description]
   * @return {[string]}            [description]
   */

  const intToByteArray = (val, paddedSize) => {
    const arr = [];
    const hexVal = val.toString(16);
    const hexRep = [];
    let i;

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

  const isHex = str => {
    const plain = str.replace('0x', '');
    return /[0-9a-f]*$/i.test(plain);
  };
  /**
   * hexToIntArray
   *
   * @param {string} hex
   * @returns {number[]}
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

  const generatePrivateKey = () => {
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

  const getAddressFromPrivateKey = privateKey => {
    const keyPair = secp256k1.keyFromPrivate(privateKey, 'hex');
    const pub = keyPair.getPublic(true, 'hex');
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

  const getPubKeyFromPrivateKey = privateKey => {
    const keyPair = secp256k1.keyFromPrivate(privateKey, 'hex');
    return keyPair.getPublic(true, 'hex');
  };
  /**
   * compressPublicKey
   *
   * @param {string} publicKey - 65-byte public key, a point (x, y)
   *
   * @returns {string}
   */

  const compressPublicKey = publicKey => {
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

  const getAddressFromPublicKey = pubKey => {
    return hashjs.sha256().update(pubKey, 'hex').digest('hex').slice(24);
  };
  /**
   * verifyPrivateKey
   *
   * @param {string|Buffer} privateKey
   * @returns {boolean}
   */

  const verifyPrivateKey = privateKey => {
    const keyPair = secp256k1.keyFromPrivate(privateKey, 'hex');
    const {
      result
    } = keyPair.validate();
    return result;
  };
  /**
   * encodeTransaction
   *
   * @param {any} txn
   * @returns {Buffer}
   */

  const encodeTransaction = txn => {
    const codeHex = Buffer.from(txn.code).toString('hex');
    const dataHex = Buffer.from(txn.data).toString('hex');
    const encoded = intToByteArray(txn.version, 64).join('') + intToByteArray(txn.nonce, 64).join('') + txn.to + txn.pubKey + txn.amount.toString('hex', 64) + intToByteArray(txn.gasPrice, 64).join('') + intToByteArray(txn.gasLimit, 64).join('') + intToByteArray(txn.code.length, 8).join('') // size of code
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

  const createTransactionJson = (privateKey, txnDetails) => {
    const pubKey = getPubKeyFromPrivateKey(privateKey);
    const txn = {
      version: txnDetails.version,
      nonce: txnDetails.nonce,
      to: txnDetails.to,
      amount: txnDetails.amount,
      pubKey,
      gasPrice: txnDetails.gasPrice,
      gasLimit: txnDetails.gasLimit,
      code: txnDetails.code || '',
      data: txnDetails.data || ''
    };
    const encodedTx = encodeTransaction(txn);
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
  const toChecksumAddress = address => {
    const newAddress = address.toLowerCase().replace('0x', '');
    const hash$$1 = hashjs.sha256().update(newAddress, 'hex').digest('hex');
    let ret = '0x';

    for (let i = 0; i < newAddress.length; i += 1) {
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

  const isValidChecksumAddress = address => {
    const replacedAddress = address.replace('0x', '');
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

  Object.defineProperty(exports, '__esModule', { value: true });

})));
