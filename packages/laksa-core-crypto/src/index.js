import BN from 'bn.js'
import elliptic from 'elliptic'
import { randomBytes } from './random'
import * as schnorr from './schnorr'

const NUM_BYTES = 32

/**
 * generatePrivateKey
 *
 * @returns {string} - the hex-encoded private key
 */
export const generatePrivateKey = () => {
  let privateKey = new BN(randomBytes(NUM_BYTES), 'hex')

  while (privateKey.isZero() || privateKey.gte(elliptic.ec('secp256k1').curve.n)) {
    privateKey = new BN(randomBytes(NUM_BYTES), 'hex')
  }

  return privateKey.toString('hex')
}

/**
 * sign
 *
 * @param {string} hash - hex-encoded hash of the data to be signed
 *
 * @returns {string} the signature
 */
export const sign = (msg, privateKey, pubKey) => {
  const sig = schnorr.sign(msg, Buffer.from(privateKey, 'hex'), Buffer.from(pubKey, 'hex'))

  let r = sig.r.toString('hex')
  let s = sig.s.toString('hex')
  while (r.length < 64) {
    r = `0${r}`
  }
  while (s.length < 64) {
    s = `0${s}`
  }

  return r + s
}
export { schnorr, randomBytes, BN }
export * from './util'
export * from './bytes'
export * from './signature'
