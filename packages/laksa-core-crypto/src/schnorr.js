import elliptic from 'elliptic'
import BN from 'bn.js'
import hashjs from 'hash.js'
import DRBG from 'hmac-drbg'

import { randomBytes } from './random'
import { Signature } from './signature'
import { checkValidSignature } from './util'

const secp256k1 = elliptic.ec('secp256k1')
const { curve } = secp256k1
const PRIVKEY_SIZE_BYTES = 32
// Public key is a point (x, y) on the curve.
// Each coordinate requires 32 bytes.
// In its compressed form it suffices to store the x co-ordinate
// and the sign for y.
// Hence a total of 33 bytes.
const PUBKEY_COMPRESSED_SIZE_BYTES = 33
// Personalization string used for HMAC-DRBG instantiation.
const ALG = Buffer.from('Schnorr+SHA256  ', 'ascii')
// The length in bytes of the string above.
const ALG_LEN = 16
// The length in bytes of entropy inputs to HMAC-DRBG
const ENT_LEN = 32

const HEX_ENC = 'hex'

/**
 * @function generatePrivateKey
 * @description generate a private key
 * @return {String} the hex-encoded private key
 */
export const generatePrivateKey = () => {
  return secp256k1
    .genKeyPair({
      entropy: randomBytes(secp256k1.curve.n.byteLength()),
      entropyEnc: HEX_ENC,
      pers: 'zilliqajs+secp256k1+SHA256'
    })
    .getPrivate()
    .toString(16, PRIVKEY_SIZE_BYTES * 2)
}

/**
 * @function hash
 * @description hash message Hash (r | M).
 * @param {Buffer} q
 * @param {Buffer} msg
 * @param {BN} r
 * @return {Buffer}
 */

export const hash = (q, pubkey, msg) => {
  const sha256 = hashjs.sha256()
  const pubSize = PUBKEY_COMPRESSED_SIZE_BYTES * 2
  const totalLength = pubSize + msg.byteLength // 33 q + 33 pubkey + variable msgLen
  const Q = q.toArrayLike(Buffer, 'be', 33)
  const B = Buffer.allocUnsafe(totalLength)

  Q.copy(B, 0)
  pubkey.copy(B, 33)
  msg.copy(B, 66)

  return new BN(sha256.update(B).digest('hex'), 16)
}

/**
 * @function sign
 * @description sign method
 * @param {Buffer} msg
 * @param {Buffer} key
 * @param {Buffer} pubkey
 * @return {Signature}
 */
export const sign = (msg, privKey, pubKey) => {
  const prv = new BN(privKey)
  const drbg = getDRBG(msg)
  const len = curve.n.byteLength()

  let sig
  while (!sig) {
    const k = new BN(drbg.generate(len))
    const trySig = trySign(msg, k, prv, pubKey)
    sig = checkValidSignature(trySig) ? trySig : null
  }

  return sig
}

/**
 * @function trySign
 * @description try sign message with random k
 * @param {Buffer} msg - the message to sign over
 * @param {BN} k - output of the HMAC-DRBG
 * @param {BN} privateKey - the private key
 * @param {Buffer} pubKey - the public key
 * @return {Signature | null}
 */
export const trySign = (msg, k, privKey, pubKey) => {
  if (privKey.isZero()) {
    throw new Error('Bad private key.')
  }

  if (privKey.gte(curve.n)) {
    throw new Error('Bad private key.')
  }

  // 1a. check that k is not 0
  if (k.isZero()) {
    return null
  }
  // 1b. check that k is < the order of the group
  if (k.gte(curve.n)) {
    return null
  }

  // 2. Compute commitment Q = kG, where g is the base point
  const Q = curve.g.mul(k)
  // convert the commitment to octets first
  const compressedQ = new BN(Q.encodeCompressed())

  // 3. Compute the challenge r = H(Q || pubKey || msg)
  // mod reduce the r value by the order of secp256k1, n
  const r = hash(compressedQ, pubKey, msg).umod(curve.n)
  const h = r.clone()

  if (h.isZero()) {
    return null
  }

  // 4. Compute s = k - r * prv
  // 4a. Compute r * prv
  let s = h.imul(privKey).umod(curve.n)
  // 4b. Compute s = k - r * prv mod n
  s = k.isub(s).umod(curve.n)

  if (s.isZero()) {
    return null
  }

  return new Signature({ r, s })
}

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
export const verify = (msg, signature, key) => {
  const sig = new Signature(signature)

  if (sig.s.isZero() || sig.r.isZero()) {
    throw new Error('Invalid signature')
  }

  if (sig.s.isNeg() || sig.r.isNeg()) {
    throw new Error('Invalid signature')
  }

  if (sig.s.gte(curve.n) || sig.r.gte(curve.n)) {
    throw new Error('Invalid signature')
  }

  const kpub = curve.decodePoint(key)
  if (!curve.validate(kpub)) {
    throw new Error('Invalid public key')
  }

  const l = kpub.mul(sig.r)
  const r = curve.g.mul(sig.s)

  const Q = l.add(r)

  if (Q.isInfinity()) {
    throw new Error('Invalid intermediate point.')
  }

  const compressedQ = new BN(Q.encodeCompressed())

  const r1 = hash(compressedQ, key, msg).umod(curve.n)

  if (r1.isZero()) {
    throw new Error('Invalid hash.')
  }

  return r1.eq(sig.r)
}

/**
 * @function toSignature
 * @param  {String} serialised serialised Signature string, length == 128
 * @return {Signature} Signature instance
 */
export const toSignature = serialised => {
  const r = serialised.slice(0, 64)
  const s = serialised.slice(64)

  return new Signature({ r, s })
}

/**
 * @function getDRBG
 * @description generate an HMAC-DRBG.
 * @param {Buffer} entropy
 * @return {DRBG}
 */
export const getDRBG = msg => {
  const entropy = randomBytes(ENT_LEN)
  const pers = Buffer.allocUnsafe(ALG_LEN + ENT_LEN)

  Buffer.from(randomBytes(ENT_LEN)).copy(pers, 0)
  ALG.copy(pers, ENT_LEN)

  return new DRBG({
    hash: hashjs.sha256,
    entropy,
    nonce: msg,
    pers
  })
}

/**
 * @function signTest
 * @description a test sign method using string for browser
 * @param  {String} msg - message string
 * @param  {String} k   - random k string
 * @param  {String} prv - private key string
 * @param  {String} pub - public key string
 * @return {Signature | null} Signature result
 */
export const signTest = (msg, k, prv, pub) => {
  const msgBuffer = Buffer.from(msg, 'hex')
  const kBN = new BN(Buffer.from(k, 'hex'))
  const privBN = new BN(Buffer.from(prv, 'hex'))
  const pubBuffer = Buffer.from(pub, 'hex')
  return trySign(msgBuffer, kBN, privBN, pubBuffer)
}
