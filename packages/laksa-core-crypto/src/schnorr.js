import assert from 'assert'
import elliptic from 'elliptic'
import BN from 'bn.js'
import Signature from 'elliptic/lib/elliptic/ec/signature'
import hashjs from 'hash.js'
import DRBG from 'hmac-drbg'

const { curve } = elliptic.ec('secp256k1')

// Public key is a point (x, y) on the curve.
// Each coordinate requires 32 bytes.
// In its compressed form it suffices to store the x co-ordinate
// and the sign for y.
// Hence a total of 33 bytes.
const PUBKEY_COMPRESSED_SIZE_BYTES = 33

class Schnorr {
  /**
   * Hash (r | M).
   * @param {Buffer} msg
   * @param {BN} r
   * @returns {Buffer}
   */

  hash = (q, pubkey, msg) => {
    const sha256 = hashjs.sha256()
    const totalLength = PUBKEY_COMPRESSED_SIZE_BYTES * 2 + msg.byteLength
    // 33 q + 33 pubkey + variable msgLen
    const Q = q.toArrayLike(Buffer, 'be', 33)
    const B = Buffer.allocUnsafe(totalLength)

    Q.copy(B, 0)
    pubkey.copy(B, 33)
    msg.copy(B, 66)

    return new BN(sha256.update(B).digest('hex'), 16)
  }
  /**
   * Sign message.
   * @private
   * @param {Buffer} msg
   * @param {BN} priv
   * @param {BN} k
   * @param {Buffer} pn
   * @returns {Signature|null}
   */

  trySign = (msg, prv, k, pn, pubKey) => {
    if (prv.isZero()) throw new Error('Bad private key.')

    if (prv.gte(curve.n)) throw new Error('Bad private key.')

    // 1a. check that k is not 0
    if (k.isZero()) return null
    // 1b. check that k is < the order of the group
    if (k.gte(curve.n)) return null

    // 2. Compute commitment Q = kG, where g is the base point
    const Q = curve.g.mul(k)
    // convert the commitment to octets first
    const compressedQ = new BN(Q.encodeCompressed())

    // 3. Compute the challenge r = H(Q || pubKey || msg)
    const r = this.hash(compressedQ, pubKey, msg)
    const h = r.clone()

    if (h.isZero()) return null

    if (h.eq(curve.n)) return null

    // 4. Compute s = k - r * prv
    // 4a. Compute r * prv
    let s = h.imul(prv)
    // 4b. Compute s = k - r * prv mod n
    s = k.isub(s)
    s = s.umod(curve.n)

    if (s.isZero()) return null

    return new Signature({ r, s })
  }

  /**
   * Sign message.
   * @param {Buffer} msg
   * @param {Buffer} key
   * @param {Buffer} pubNonce
   * @returns {Signature}
   */

  sign = (msg, key, pubkey, pubNonce) => {
    const prv = new BN(key)
    const drbg = this.getDRBG(msg, key, pubNonce)
    const len = curve.n.byteLength()

    let pn
    if (pubNonce) pn = curve.decodePoint(pubNonce)

    let sig
    while (!sig) {
      const k = new BN(drbg.generate(len))
      sig = this.trySign(msg, prv, k, pn, pubkey)
    }

    return sig
  }
  /**
   * Verify signature.
   * @param {Buffer} msg
   * @param {Buffer} signature
   * @param {Buffer} key
   * @returns {Buffer}
   */

  verify = (msg, signature, key) => {
    const sig = new Signature(signature)

    if (sig.s.gte(curve.n)) throw new Error('Invalid S value.')

    if (sig.r.gt(curve.n)) throw new Error('Invalid R value.')

    const kpub = curve.decodePoint(key)
    const l = kpub.mul(sig.r)
    const r = curve.g.mul(sig.s)

    const Q = l.add(r)
    const compressedQ = new BN(Q.encodeCompressed())

    const r1 = this.hash(compressedQ, key, msg)

    if (r1.gte(curve.n)) throw new Error('Invalid hash.')

    if (r1.isZero()) throw new Error('Invalid hash.')

    return r1.eq(sig.r)
  }

  /**
   * Schnorr personalization string.
   * @const {Buffer}
   */

  alg = Buffer.from('Schnorr+SHA256  ', 'ascii')

  /**
   * Instantiate an HMAC-DRBG.
   * @param {Buffer} msg
   * @param {Buffer} priv
   * @param {Buffer} data
   * @returns {DRBG}
   */

  getDRBG = (msg, priv, data) => {
    const pers = Buffer.allocUnsafe(48)

    pers.fill(0)

    if (data) {
      assert(data.length === 32)
      data.copy(pers, 0)
    }

    this.alg.copy(pers, 32)

    return new DRBG({
      hash: hashjs.sha256,
      entropy: priv,
      nonce: msg,
      pers
    })
  }

  /**
   * Generate pub+priv nonce pair.
   * @param {Buffer} msg
   * @param {Buffer} priv
   * @param {Buffer} data
   * @returns {Buffer}
   */

  generateNoncePair = (msg, priv, data) => {
    const drbg = this.getDRBG(msg, priv, data)
    const len = curve.n.byteLength()

    let k = new BN(drbg.generate(len))

    while (k.isZero() && k.gte(curve.n)) {
      k = new BN(drbg.generate(len))
    }

    return Buffer.from(curve.g.mul(k).encode('array', true))
  }
}

export default Schnorr
