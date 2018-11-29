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
 * gernerate account object
 * @function generateAccountObject
 * @param  {string} privateKey {description}
 * @return {Account} {Account object}
 */

function generateAccountObject(privateKey) {
  if (!isPrivateKey(privateKey)) {
    throw new Error('private key is not correct')
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
 * @return {Account} {account object}
 */
export const createAccount = () => {
  return generateAccountObject(generatePrivateKey())
}

/**
 * @function importAccount
 * @param  {PrivateKey} privateKey {privatekey string}
 * @return {Account} {account object}
 */
export const importAccount = privateKey => {
  return generateAccountObject(privateKey)
}

/**
 * @function encryptAccount
 * @param  {Account} accountObject {account object}
 * @param  {string} password      {password string}
 * @param  {object} options       {encryption options}
 * @return {Account} {encrypted account object}
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
 * @param  {Account} accountObject {encrypted account object}
 * @param  {string} password      {password string}
 * @return {Account} {decrypted account object}
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
 * @param  {PrivateKey} privateKey        {privatekey}
 * @param  {Transaction} transactionObject {transaction object}
 * @return {Transaction} {signed transaction}
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
