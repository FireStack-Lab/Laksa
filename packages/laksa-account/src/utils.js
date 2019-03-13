import {
  isPrivateKey, isObject, isString, validateArgs, BN
} from 'laksa-utils'
import {
  generatePrivateKey,
  getAddressFromPrivateKey,
  getPubKeyFromPrivateKey,
  encodeTransactionProto,
  sign,
  schnorr,
  Signature
} from 'laksa-core-crypto'

import { encrypt, decrypt } from 'laksa-extend-keystore'
import { ENCRYPTED } from './symbols'

/**
 * @function generateAccountObject
 * @description generate Account object
 * @param  {String} privateKey - privateKey String
 * @return {Object} Account object
 */

function generateAccountObject(privateKey) {
  if (!isPrivateKey(privateKey)) {
    throw new Error(`private key is not correct:${privateKey}`)
  }
  const address = getAddressFromPrivateKey(privateKey)
  const publicKey = getPubKeyFromPrivateKey(privateKey)
  return {
    privateKey,
    address,
    publicKey
  }
}

/**
 * @function createAccount
 * @description create an account
 * @return {Object} account object
 */
export const createAccount = () => {
  const privateKey = generatePrivateKey()
  return generateAccountObject(privateKey)
}

/**
 * @function importAccount
 * @description import privatekey and generate an account object
 * @param  {String} privateKey - privatekey string
 * @return {Object} account object
 */
export const importAccount = privateKey => {
  return generateAccountObject(privateKey)
}

/**
 * @function encryptAccount
 * @description encrypt Account
 * @param  {Account} accountObject - account instance
 * @param  {String} password      - password string
 * @param  {Object} options       - encryption options
 * @return {Object} encrypted account object
 */
export const encryptAccount = async (accountObject, password, options = { level: 1024 }) => {
  validateArgs(accountObject, {
    privateKey: [isPrivateKey]
  })
  if (!isString(password)) {
    throw new Error('password is not found')
  }
  const encrypted = await encrypt(accountObject.privateKey, password, options)
  const encryptedObj = {
    ...accountObject,
    privateKey: ENCRYPTED,
    ...encrypted
  }
  return encryptedObj
}

/**
 * @function decryptAccount
 * @description decrypt an account object
 * @param  {Account} accountObject - encrypted account object
 * @param  {String} password      -password string
 * @return {Object} decrypted account object
 */
export const decryptAccount = async (accountObject, password) => {
  validateArgs(accountObject, {
    crypto: [isObject]
  })
  if (!isString(password)) {
    throw new Error('password is not found')
  }
  const newObject = Object.assign({}, accountObject)
  delete newObject.crypto
  const decrypted = await decrypt(accountObject, password)
  const decryptedObj = {
    ...newObject,
    privateKey: decrypted
  }
  return decryptedObj
}

/**
 * @function signTransaction
 * @description sign a transaction providing privatekey and transaction object
 * @param  {String} privateKey        - privatekey String
 * @param  {Transaction} txnDetails  - transaction object
 * @return {Transaction} signed transaction
 */
export const signTransaction = (privateKey, txnDetails) => {
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
