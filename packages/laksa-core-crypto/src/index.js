import BN from 'bn.js'
import elliptic from 'elliptic'
import { randomBytes } from './random'
import * as schnorr from './schnorr'

export const { generatePrivateKey } = schnorr
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
export {
  schnorr, randomBytes, BN, elliptic
}

export * from './util'
export * from './bytes'
export * from './signature'
