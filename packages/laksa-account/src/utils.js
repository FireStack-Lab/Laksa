import {
  isPrivateKey, isPubkey, isAddress, isObject, isString, validateArgs
} from 'laksa-utils'
import {
  generatePrivateKey,
  getAddressFromPrivateKey,
  getPubKeyFromPrivateKey,
  createTransactionJson
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
 * create an raw accountObject
 * @return {[type]} [description]
 */

export const createAccount = () => {
  return generateAccountObject(generatePrivateKey())
}

export const importAccount = privateKey => {
  return generateAccountObject(privateKey)
}

export const encryptAccount = async (accountObject, password, options = { level: 1024 }) => {
  validateArgs(accountObject, {
    address: [isAddress],
    privateKey: [isPrivateKey],
    publicKey: [isPubkey]
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

export const decryptAccount = async (accountObject, password) => {
  validateArgs(accountObject, {
    address: [isAddress],
    crypto: [isObject],
    publicKey: [isPubkey]
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

export const signTransaction = (privateKey, transactionObject) => {
  return createTransactionJson(privateKey, transactionObject)
}
