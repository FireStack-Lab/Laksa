import {
  generatePrivateKey,
  getAddressFromPrivateKey,
  getPubKeyFromPrivateKey,
  isPrivateKey,
  isPubkey,
  isAddress,
  isObject,
  validateArgs
} from 'laksa-utils'

import { encrypt, decrypt } from './entropy'

export const ENCRYPTED = Symbol('ENCRYPTED')

function generateAccountObject(privateKey) {
  if (!isPrivateKey(privateKey)) throw new Error('private key is not correct')
  const address = getAddressFromPrivateKey(privateKey)
  const publicKey = getPubKeyFromPrivateKey(privateKey)
  let accountObject = {}
  // set accountObject
  if (isPubkey(publicKey) && isPrivateKey(privateKey) && isAddress(address)) {
    accountObject = {
      privateKey,
      address,
      publicKey
    }
    // push account object to accountArray
    return accountObject
  }
  throw new Error('account generate failure')
}

/**
 * create an raw accountObject
 * @return {[type]} [description]
 */

export const createAccount = () => {
  const privateKey = generatePrivateKey()
  try {
    return generateAccountObject(privateKey)
  } catch (e) {
    return e
  }
}

export const importAccount = (privateKey) => {
  try {
    return generateAccountObject(privateKey)
  } catch (e) {
    return e
  }
}

export const encryptAccount = (accountObject, password) => {
  validateArgs(accountObject, {
    address: [isAddress],
    privateKey: [isPrivateKey],
    publicKey: [isPubkey]
  })
  try {
    return {
      ...accountObject,
      privateKey: ENCRYPTED,
      ...encrypt(accountObject.privateKey, password)
    }
  } catch (e) {
    return e
  }
}

export const decryptAccount = (accountObject, password) => {
  validateArgs(accountObject, {
    address: [isAddress],
    crypto: [isObject],
    publicKey: [isPubkey]
  })
  try {
    const newObject = Object.assign({}, accountObject)
    delete newObject.crypto
    return {
      ...newObject,
      privateKey: decrypt(accountObject, password)
    }
  } catch (e) {
    return e
  }
}
