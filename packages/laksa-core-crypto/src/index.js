import elliptic from 'elliptic'
import hashjs from 'hash.js'
import { randomBytes } from './random'
import * as schnorr from './schnorr'

const NUM_BYTES = 32
// const HEX_PREFIX = '0x';
const secp256k1 = elliptic.ec('secp256k1')

/**
 * convert number to array representing the padded hex form
 * @param  {[string]} val        [description]
 * @param  {[number]} paddedSize [description]
 * @return {[string]}            [description]
 */
export const intToByteArray = (val, paddedSize) => {
  const arr = []

  const hexVal = val.toString(16)
  const hexRep = []

  let i
  for (i = 0; i < hexVal.length; i += 1) {
    hexRep[i] = hexVal[i].toString()
  }

  for (i = 0; i < paddedSize - hexVal.length; i += 1) {
    arr.push('0')
  }

  for (i = 0; i < hexVal.length; i += 1) {
    arr.push(hexRep[i])
  }

  return arr
}
/**
 * isHex
 *
 * @param {string} str - string to be tested
 * @returns {boolean}
 */
const isHex = str => {
  const plain = str.replace('0x', '')
  return /[0-9a-f]*$/i.test(plain)
}

/**
 * hexToIntArray
 *
 * @param {string} hex
 * @returns {number[]}
 */
export const hexToIntArray = hex => {
  if (!hex || !isHex(hex)) {
    return []
  }

  const res = []

  for (let i = 0; i < hex.length; i += 1) {
    const c = hex.charCodeAt(i)
    const hi = c >> 8
    const lo = c & 0xff
    if (hi) {
      res.push(hi, lo)
    } else {
      res.push(lo)
    }
  }

  return res
}
/**
 * generatePrivateKey
 *
 * @returns {string} - the hex-encoded private key
 */
export const generatePrivateKey = () => {
  return randomBytes(NUM_BYTES)
}

/**
 * getAddressFromPrivateKey
 *
 * takes a hex-encoded string (private key) and returns its corresponding
 * 20-byte hex-encoded address.
 *
 * @param {string} Key
 * @returns {string}
 */
export const getAddressFromPrivateKey = privateKey => {
  const keyPair = secp256k1.keyFromPrivate(privateKey, 'hex')
  const pub = keyPair.getPublic(true, 'hex')

  return hashjs
    .sha256()
    .update(pub, 'hex')
    .digest('hex')
    .slice(24)
}

/**
 * getPubKeyFromPrivateKey
 *
 * takes a hex-encoded string (private key) and returns its corresponding
 * hex-encoded 33-byte public key.
 *
 * @param {string} privateKey
 * @returns {string}
 */
export const getPubKeyFromPrivateKey = privateKey => {
  const keyPair = secp256k1.keyFromPrivate(privateKey, 'hex')
  return keyPair.getPublic(true, 'hex')
}

/**
 * compressPublicKey
 *
 * @param {string} publicKey - 65-byte public key, a point (x, y)
 *
 * @returns {string}
 */
export const compressPublicKey = publicKey => {
  return secp256k1.keyFromPublic(publicKey, 'hex').getPublic(true, 'hex')
}

/**
 * getAddressFromPublicKey
 *
 * takes hex-encoded string and returns the corresponding address
 *
 * @param {string} pubKey
 * @returns {string}
 */
export const getAddressFromPublicKey = pubKey => {
  return hashjs
    .sha256()
    .update(pubKey, 'hex')
    .digest('hex')
    .slice(24)
}

/**
 * verifyPrivateKey
 *
 * @param {string|Buffer} privateKey
 * @returns {boolean}
 */
export const verifyPrivateKey = privateKey => {
  const keyPair = secp256k1.keyFromPrivate(privateKey, 'hex')
  const { result } = keyPair.validate()
  return result
}

/**
 * encodeTransaction
 *
 * @param {any} txn
 * @returns {Buffer}
 */
export const encodeTransaction = txn => {
  const codeHex = Buffer.from(txn.code).toString('hex')
  const dataHex = Buffer.from(txn.data).toString('hex')

  const encoded =
    intToByteArray(txn.version, 64).join('') +
    intToByteArray(txn.nonce, 64).join('') +
    txn.to +
    txn.pubKey +
    txn.amount.toString('hex', 64) +
    intToByteArray(txn.gasPrice, 64).join('') +
    intToByteArray(txn.gasLimit, 64).join('') +
    intToByteArray(txn.code.length, 8).join('') + // size of code
    codeHex +
    intToByteArray(txn.data.length, 8).join('') + // size of data
    dataHex

  return Buffer.from(encoded, 'hex')
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
    to: txnDetails.to,
    amount: txnDetails.amount,
    pubKey,
    gasPrice: txnDetails.gasPrice,
    gasLimit: txnDetails.gasLimit,
    code: txnDetails.code || '',
    data: txnDetails.data || ''
  }

  const encodedTx = encodeTransaction(txn)

  txn.signature = sign(encodedTx, Buffer.from(privateKey, 'hex'), Buffer.from(pubKey, 'hex'))
  return txn
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

export const toChecksumAddress = address => {
  const newAddress = address.toLowerCase().replace('0x', '')
  const hash = hashjs
    .sha256()
    .update(newAddress, 'hex')
    .digest('hex')
  let ret = '0x'
  for (let i = 0; i < newAddress.length; i += 1) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += newAddress[i].toUpperCase()
    } else {
      ret += newAddress[i]
    }
  }
  return ret
}

/**
 * isValidChecksumAddress
 *
 * takes hex-encoded string and returns boolean if address is checksumed
 *
 * @param {string} address
 * @returns {boolean}
 */
export const isValidChecksumAddress = address => {
  const replacedAddress = address.replace('0x', '')
  return !!replacedAddress.match(/^[0-9a-fA-F]{40}$/) && toChecksumAddress(address) === address
}

export { randomBytes, hashjs, schnorr }
