import BN from 'bn.js'
import { randomBytes } from './random'
import { getPubKeyFromPrivateKey, encodeTransactionProto } from './util'
import { Signature } from './signature'
import * as schnorr from './schnorr'

const NUM_BYTES = 32

/**
 * generatePrivateKey
 *
 * @returns {string} - the hex-encoded private key
 */
export const generatePrivateKey = () => {
  return randomBytes(NUM_BYTES)
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

/**
 * createTransactionJson
 *
 * @param {string} privateKey
 * @param {TxDetails} txnDetails
 * @param {TxDetails}
 *
 * @returns {TxDetails}
 */
export const createTransactionJson = (privateKey, txnDetails) => {
  const pubKey = getPubKeyFromPrivateKey(privateKey)

  const txn = {
    version: txnDetails.version,
    nonce: txnDetails.nonce,
    toAddr: txnDetails.toAddr,
    amount: txnDetails.amount,
    pubKey,
    gasPrice: txnDetails.gasPrice,
    gasLimit: txnDetails.gasLimit,
    code: txnDetails.code || '',
    data: txnDetails.data || ''
  }

  const encodedTx = encodeTransactionProto(txn)

  txn.signature = sign(encodedTx, privateKey, pubKey)

  if (
    schnorr.verify(
      encodedTx,
      new Signature({
        r: new BN(txn.signature.slice(0, 64), 16),
        s: new BN(txn.signature.slice(64), 16)
      }),
      Buffer.from(pubKey, 'hex')
    )
  ) {
    return txn
  } else {
    throw new Error('Signature verify failure')
  }
}

export { schnorr, randomBytes, BN }
export * from './util'
export * from './bytes'
export * from './signature'
