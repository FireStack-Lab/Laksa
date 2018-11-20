import elliptic from 'elliptic'
import hashjs from 'hash.js'
import { ZilliqaMessage } from '@zilliqa-js/proto'
import { intToHexArray, intToByteArray, hexToByteArray } from './bytes'

// const HEX_PREFIX = '0x';
const secp256k1 = elliptic.ec('secp256k1')

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

/**
 * encodeTransaction
 *
 * @param {any} txn
 * @returns {Buffer}
 */
export const encodeTransaction = tx => {
  const codeHex = Buffer.from(tx.code || '').toString('hex')
  const dataHex = Buffer.from(tx.data || '').toString('hex')

  const encoded =
    intToHexArray(tx.version, 64).join('') +
    intToHexArray(tx.nonce || 0, 64).join('') +
    tx.toAddr +
    tx.pubKey +
    tx.amount.toString('hex', 64) +
    tx.gasPrice.toString('hex', 64) +
    tx.gasLimit.toString('hex', 64) +
    intToHexArray((tx.code && tx.code.length) || 0, 8).join('') + // size of code
    codeHex +
    intToHexArray((tx.data && tx.data.length) || 0, 8).join('') + // size of data
    dataHex

  return Buffer.from(encoded, 'hex')
}

export const encodeTransactionProto = tx => {
  const msg = ZilliqaMessage.ProtoTransactionCoreInfo.create({
    version: ZilliqaMessage.ByteArray.create({
      data: intToByteArray(tx.version, 32)
    }),
    nonce: ZilliqaMessage.ByteArray.create({
      data: intToByteArray(tx.nonce || 0, 32)
    }),
    toaddr: hexToByteArray(tx.toAddr),
    senderpubkey: ZilliqaMessage.ByteArray.create({
      data: hexToByteArray(tx.pubKey || '00')
    }),
    amount: ZilliqaMessage.ByteArray.create({
      data: Uint8Array.from(tx.amount.toArrayLike(Buffer, undefined, 32))
    }),
    gasprice: ZilliqaMessage.ByteArray.create({
      data: Uint8Array.from(tx.gasPrice.toArrayLike(Buffer, undefined, 32))
    }),
    gaslimit: ZilliqaMessage.ByteArray.create({
      data: Uint8Array.from(tx.gasLimit.toArrayLike(Buffer, undefined, 32))
    }),
    code: Uint8Array.from([...(tx.code || '')].map(c => c.charCodeAt(0))),
    data: Uint8Array.from([...(tx.data || '')].map(c => c.charCodeAt(0)))
  })

  return Buffer.from(ZilliqaMessage.ProtoTransactionCoreInfo.encode(msg).finish())
}

export { hashjs }
