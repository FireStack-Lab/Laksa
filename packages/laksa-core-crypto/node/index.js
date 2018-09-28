(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('assert'), require('elliptic'), require('bn.js'), require('elliptic/lib/elliptic/ec/signature'), require('hash.js'), require('hmac-drbg'), require('randombytes')) :
  typeof define === 'function' && define.amd ? define(['exports', 'assert', 'elliptic', 'bn.js', 'elliptic/lib/elliptic/ec/signature', 'hash.js', 'hmac-drbg', 'randombytes'], factory) :
  (factory((global.Laksa = {}),global.assert,global.elliptic,global.BN,global.Signature,global.hashjs,global.DRBG,global.randomBytes));
}(this, (function (exports,assert,elliptic,BN,Signature,hashjs,DRBG,randomBytes) { 'use strict';

  assert = assert && assert.hasOwnProperty('default') ? assert['default'] : assert;
  elliptic = elliptic && elliptic.hasOwnProperty('default') ? elliptic['default'] : elliptic;
  BN = BN && BN.hasOwnProperty('default') ? BN['default'] : BN;
  Signature = Signature && Signature.hasOwnProperty('default') ? Signature['default'] : Signature;
  hashjs = hashjs && hashjs.hasOwnProperty('default') ? hashjs['default'] : hashjs;
  DRBG = DRBG && DRBG.hasOwnProperty('default') ? DRBG['default'] : DRBG;
  randomBytes = randomBytes && randomBytes.hasOwnProperty('default') ? randomBytes['default'] : randomBytes;

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

  const {
    curve
  } = elliptic.ec('secp256k1'); // Public key is a point (x, y) on the curve.
  // Each coordinate requires 32 bytes.
  // In its compressed form it suffices to store the x co-ordinate
  // and the sign for y.
  // Hence a total of 33 bytes.

  const PUBKEY_COMPRESSED_SIZE_BYTES = 33;

  class Schnorr {
    constructor() {
      _defineProperty(this, "hash", (q, pubkey, msg) => {
        const sha256 = hashjs.sha256();
        const totalLength = PUBKEY_COMPRESSED_SIZE_BYTES * 2 + msg.byteLength; // 33 q + 33 pubkey + variable msgLen

        const Q = q.toArrayLike(Buffer, 'be', 33);
        const B = Buffer.allocUnsafe(totalLength);
        Q.copy(B, 0);
        pubkey.copy(B, 33);
        msg.copy(B, 66);
        return new BN(sha256.update(B).digest('hex'), 16);
      });

      _defineProperty(this, "trySign", (msg, prv, k, pn, pubKey) => {
        if (prv.isZero()) throw new Error('Bad private key.');
        if (prv.gte(curve.n)) throw new Error('Bad private key.'); // 1a. check that k is not 0

        if (k.isZero()) return null; // 1b. check that k is < the order of the group

        if (k.gte(curve.n)) return null; // 2. Compute commitment Q = kG, where g is the base point

        const Q = curve.g.mul(k); // convert the commitment to octets first

        const compressedQ = new BN(Q.encodeCompressed()); // 3. Compute the challenge r = H(Q || pubKey || msg)

        const r = this.hash(compressedQ, pubKey, msg);
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
      });

      _defineProperty(this, "sign", (msg, key, pubkey, pubNonce) => {
        const prv = new BN(key);
        const drbg = this.getDRBG(msg, key, pubNonce);
        const len = curve.n.byteLength();
        let pn;
        if (pubNonce) pn = curve.decodePoint(pubNonce);
        let sig;

        while (!sig) {
          const k = new BN(drbg.generate(len));
          sig = this.trySign(msg, prv, k, pn, pubkey);
        }

        return sig;
      });

      _defineProperty(this, "verify", (msg, signature, key) => {
        const sig = new Signature(signature);
        if (sig.s.gte(curve.n)) throw new Error('Invalid S value.');
        if (sig.r.gt(curve.n)) throw new Error('Invalid R value.');
        const kpub = curve.decodePoint(key);
        const l = kpub.mul(sig.r);
        const r = curve.g.mul(sig.s);
        const Q = l.add(r);
        const compressedQ = new BN(Q.encodeCompressed());
        const r1 = this.hash(compressedQ, key, msg);
        if (r1.gte(curve.n)) throw new Error('Invalid hash.');
        if (r1.isZero()) throw new Error('Invalid hash.');
        return r1.eq(sig.r);
      });

      _defineProperty(this, "alg", Buffer.from('Schnorr+SHA256  ', 'ascii'));

      _defineProperty(this, "getDRBG", (msg, priv, data) => {
        const pers = Buffer.allocUnsafe(48);
        pers.fill(0);

        if (data) {
          assert(data.length === 32);
          data.copy(pers, 0);
        }

        this.alg.copy(pers, 32);
        return new DRBG({
          hash: hashjs.sha256,
          entropy: priv,
          nonce: msg,
          pers
        });
      });

      _defineProperty(this, "generateNoncePair", (msg, priv, data) => {
        const drbg = this.getDRBG(msg, priv, data);
        const len = curve.n.byteLength();
        let k = new BN(drbg.generate(len));

        while (k.isZero() && k.gte(curve.n)) {
          k = new BN(drbg.generate(len));
        }

        return Buffer.from(curve.g.mul(k).encode('array', true));
      });
    }

  }

  const NUM_BYTES = 32; // const HEX_PREFIX = '0x';

  const secp256k1 = elliptic.ec('secp256k1');
  const schnorr = new Schnorr();
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
   * generatePrivateKey
   *
   * @returns {string} - the hex-encoded private key
   */


  const generatePrivateKey = () => {
    let priv = '';
    const rand = randomBytes(NUM_BYTES);

    for (let i = 0; i < rand.byteLength; i += 1) {
      // add 00 in case we get an empty byte.
      const byte = rand[i];
      const hexstr = '00'.concat(byte.toString(16)).slice(-2);
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
    const encodedTx = encodeTransaction(txn); // sign using schnorr lib

    const sig = schnorr.sign(encodedTx, Buffer.from(privateKey, 'hex'), Buffer.from(pubKey, 'hex'));
    let r = sig.r.toString('hex');
    let s = sig.s.toString('hex');

    while (r.length < 64) {
      r = `0${r}`;
    }

    while (s.length < 64) {
      s = `0${s}`;
    }

    txn.signature = r + s;
    return txn;
  };
  const toChecksumAddress = address => {
    const newAddress = address.toLowerCase().replace('0x', '');
    const hash = hashjs.sha256().update(newAddress, 'hex').digest('hex');
    let ret = '0x';

    for (let i = 0; i < newAddress.length; i += 1) {
      if (parseInt(hash[i], 16) >= 8) {
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
    return !!replacedAddress.match(/^[0-9a-fA-F]{64}$/) && toChecksumAddress(address) === address;
  };

  exports.randomBytes = randomBytes;
  exports.generatePrivateKey = generatePrivateKey;
  exports.getAddressFromPrivateKey = getAddressFromPrivateKey;
  exports.getPubKeyFromPrivateKey = getPubKeyFromPrivateKey;
  exports.compressPublicKey = compressPublicKey;
  exports.getAddressFromPublicKey = getAddressFromPublicKey;
  exports.verifyPrivateKey = verifyPrivateKey;
  exports.encodeTransaction = encodeTransaction;
  exports.createTransactionJson = createTransactionJson;
  exports.toChecksumAddress = toChecksumAddress;
  exports.isValidChecksumAddress = isValidChecksumAddress;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
