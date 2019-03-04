import elliptic from 'elliptic'
import hashjs from 'hash.js'
import BN from 'bn.js'
import { ZilliqaMessage } from '@zilliqa-js/proto'
import { intToHexArray, hexToByteArray } from './bytes'

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
  const v = new BN(hash, 'hex', 'be')
  let ret = '0x'

  for (let i = 0; i < newAddress.length; i += 1) {
    if ('0123456789'.indexOf(newAddress[i]) !== -1) {
      ret += newAddress[i]
    } else {
      ret += v.and(new BN(2).pow(new BN(255 - 6 * i))).gte(new BN(1))
        ? newAddress[i].toUpperCase()
        : newAddress[i].toLowerCase()
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
 * @param {any} tx
 * @returns {Buffer}
 */

export const encodeTransactionProto = tx => {
  const msg = {
    version: tx.version,
    nonce: tx.nonce || 0,
    toaddr: hexToByteArray(tx.toAddr.toLowerCase()),
    senderpubkey: ZilliqaMessage.ByteArray.create({
      data: hexToByteArray(tx.pubKey || '00')
    }),
    amount: ZilliqaMessage.ByteArray.create({
      data: Uint8Array.from(tx.amount.toArrayLike(Buffer, undefined, 16))
    }),
    gasprice: ZilliqaMessage.ByteArray.create({
      data: Uint8Array.from(tx.gasPrice.toArrayLike(Buffer, undefined, 16))
    }),
    gaslimit: tx.gasLimit,
    code:
      tx.code && tx.code.length ? Uint8Array.from([...tx.code].map(c => c.charCodeAt(0))) : null,
    data: tx.data && tx.data.length ? Uint8Array.from([...tx.data].map(c => c.charCodeAt(0))) : null
  }

  const serialised = ZilliqaMessage.ProtoTransactionCoreInfo.create(msg)

  return Buffer.from(ZilliqaMessage.ProtoTransactionCoreInfo.encode(serialised).finish())
}

export const getAddressForContract = ({ currentNonce, address }) => {
  // always subtract 1 from the tx nonce, as contract addresses are computed
  // based on the nonce in the global state.
  const nonce = currentNonce ? currentNonce - 1 : 0

  return hashjs
    .sha256()
    .update(address, 'hex')
    .update(intToHexArray(nonce, 64).join(''), 'hex')
    .digest('hex')
    .slice(24)
}

/**
 * verify if signature is length===128
 * @function checkValidSignature
 * @param  {Signature} sig Signature
 * @return {boolean}
 */
export const checkValidSignature = sig => {
  return sig.r.toString('hex').length + sig.s.toString('hex').length === 128
}

export { hashjs }
