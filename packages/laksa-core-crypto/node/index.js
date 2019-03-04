(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('bn.js'), require('elliptic'), require('hash.js'), require('@zilliqa-js/proto'), require('hmac-drbg')) :
  typeof define === 'function' && define.amd ? define(['exports', 'bn.js', 'elliptic', 'hash.js', '@zilliqa-js/proto', 'hmac-drbg'], factory) :
  (factory((global.Laksa = {}),global.BN,global.elliptic,global.hashjs,global.proto,global.DRBG));
}(this, (function (exports,BN,elliptic,hashjs,proto,DRBG) { 'use strict';

  BN = BN && BN.hasOwnProperty('default') ? BN['default'] : BN;
  elliptic = elliptic && elliptic.hasOwnProperty('default') ? elliptic['default'] : elliptic;
  hashjs = hashjs && hashjs.hasOwnProperty('default') ? hashjs['default'] : hashjs;
  DRBG = DRBG && DRBG.hasOwnProperty('default') ? DRBG['default'] : DRBG;

  /**
   * randomBytes
   *
   * Uses JS-native CSPRNG to generate a specified number of bytes.
   * NOTE: this method throws if no PRNG is available.
   *
   * @param {number} bytes
   * @returns {string}
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
  }; // import RB from 'randombytes'
  // export const randomBytes = bytes => {
  //   const randBz = RB(bytes)
  //   let randStr = ''
  //   for (let i = 0; i < bytes; i += 1) {
  //     randStr += `00${randBz[i].toString(16)}`.slice(-2)
  //   }
  //   return randStr
  // }

  /**
   * Signature
   *
   * This replaces `elliptic/lib/elliptic/ec/signature`. This is to avoid
   * duplicate code in the final bundle, caused by having to bundle elliptic
   * twice due to its circular dependencies. This can be removed once
   * https://github.com/indutny/elliptic/pull/157 is resolved, or we find the
   * time to fork an optimised version of the library.
   */

  class Signature {
    constructor(options) {
      this.r = typeof options.r === 'string' ? new BN(options.r, 16) : options.r;
      this.s = typeof options.s === 'string' ? new BN(options.s, 16) : options.s;
    }

  }

  /**
   * intToHexArray
   *
   * @param {number} int - the number to be converted to hex
   * @param {number)} size - the desired width of the hex value. will pad.
   *
   * @returns {string[]}
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
   * intToByteArray
   *
   * Converts a number to Uint8Array
   *
   * @param {number} num
   * @param {number} size
   *
   * @returns {Uint8Array}
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
   * hexToByteArray
   *
   * Convers a hex string to a Uint8Array
   *
   * @param {string} hex
   * @returns {Uint8Array}
   */

  const hexToByteArray = hex => {
    const res = new Uint8Array(hex.length / 2);

    for (let i = 0; i < hex.length; i += 2) {
      res[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }

    return res;
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
      }

      res.push(lo);
    }

    return res;
  };
  /**
   * compareBytes
   *
   * A constant time HMAC comparison function.
   *
   * @param {string} a
   * @param {string} b
   * @returns {boolean}
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
   * isHex
   *
   * @param {string} str - string to be tested
   * @returns {boolean}
   */

  const isHex = str => {
    const plain = str.replace('0x', '');
    return /[0-9a-f]*$/i.test(plain);
  };

  const secp256k1 = elliptic.ec('secp256k1');
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
  /**
   * encodeTransaction
   *
   * @param {any} tx
   * @returns {Buffer}
   */

  const encodeTransactionProto = tx => {
    const msg = {
      version: tx.version,
      nonce: tx.nonce || 0,
      toaddr: hexToByteArray(tx.toAddr.toLowerCase()),
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
   * verify if signature is length===128
   * @function checkValidSignature
   * @param  {Signature} sig Signature
   * @return {boolean}
   */

  const checkValidSignature = sig => {
    return sig.r.toString('hex').length + sig.s.toString('hex').length === 128;
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
   * generatePrivateKey
   *
   * @returns {string} - the hex-encoded private key
   */

  const generatePrivateKey = () => {
    return secp256k1$1.genKeyPair({
      entropy: randomBytes(secp256k1$1.curve.n.byteLength()),
      entropyEnc: HEX_ENC,
      pers: 'zilliqajs+secp256k1+SHA256'
    }).getPrivate().toString(16, PRIVKEY_SIZE_BYTES * 2);
  };
  /**
   * Hash (r | M).
   * @param {Buffer} msg
   * @param {BN} r
   *
   * @returns {Buffer}
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
   * sign
   *
   * @param {Buffer} msg
   * @param {Buffer} key
   * @param {Buffer} pubkey
   *
   * @returns {Signature}
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
   * trySign
   *
   * @param {Buffer} msg - the message to sign over
   * @param {BN} k - output of the HMAC-DRBG
   * @param {BN} privateKey - the private key
   * @param {Buffer} pubKey - the public key
   *
   * @returns {Signature | null =>}
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
   * Verify signature.
   *
   * @param {Buffer} msg
   * @param {Buffer} signature
   * @param {Buffer} key
   *
   * @returns {boolean}
   *
   * 1. Check if r,s is in [1, ..., order-1]
   * 2. Compute Q = sG + r*kpub
   * 3. If Q = O (the neutral point), return 0;
   * 4. r' = H(Q, kpub, m)
   * 5. return r' == r
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
  const toSignature = serialised => {
    const r = serialised.slice(0, 64);
    const s = serialised.slice(64);
    return new Signature({
      r,
      s
    });
  };
  /**
   * Instantiate an HMAC-DRBG.
   *
   * @param {Buffer} entropy
   *
   * @returns {DRBG}
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
  }; // /**
  //  * a test sign method using string for browser
  //  * @function signTest
  //  * @param  {type} msg {description}
  //  * @param  {type} k   {description}
  //  * @param  {type} prv {description}
  //  * @param  {type} pub {description}
  //  * @return {type} {description}
  //  */
  // export const signTest = (msg, k, prv, pub) => {
  //   const msgBuffer = Buffer.from(msg, 'hex')
  //   const kBN = new BN(Buffer.from(k, 'hex'))
  //   const privBN = new BN(Buffer.from(prv, 'hex'))
  //   const pubBuffer = Buffer.from(pub, 'hex')
  //   return trySign(msgBuffer, kBN, privBN, pubBuffer)
  // }

  var schnorr = /*#__PURE__*/Object.freeze({
    generatePrivateKey: generatePrivateKey,
    hash: hash,
    sign: sign,
    trySign: trySign,
    verify: verify,
    toSignature: toSignature,
    getDRBG: getDRBG
  });

  const {
    generatePrivateKey: generatePrivateKey$1
  } = schnorr;
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
  exports.intToHexArray = intToHexArray;
  exports.intToByteArray = intToByteArray;
  exports.hexToByteArray = hexToByteArray;
  exports.hexToIntArray = hexToIntArray;
  exports.isEqual = isEqual;
  exports.isHex = isHex;
  exports.Signature = Signature;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
