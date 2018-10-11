import aes from 'aes-js'
import { pbkdf2sync } from 'pbkdf2'
import scrypt from 'scrypt.js'
import uuid from 'uuid'
import { randomBytes, hashjs } from 'laksa-core-crypto'

/**
 * getDerivedKey
 *
 * NOTE: only scrypt and pbkdf2 are supported.
 *
 * @param {Buffer} key - the passphrase
 * @param {KDF} kdf - the key derivation function to be used
 * @param {KDFParams} params - params for the kdf
 *
 * @returns {Promise<Buffer>}
 */
const getDerivedKey = (key, kdf, params) => {
  return new Promise((resolve, reject) => {
    const {
      n, r, p, dklen
    } = params
    const salt = Buffer.from(params.salt)

    if (kdf !== 'pbkdf2' && kdf !== 'scrypt') {
      reject(new Error('Only pbkdf2 and scrypt are supported'))
    }

    const derivedKey =
      kdf === 'scrypt'
        ? scrypt(key, salt, n, r, p, dklen)
        : pbkdf2sync(key, salt, n, dklen, 'sha256')

    resolve(derivedKey)
  })
}

/**
 * encryptPrivateKey
 *
 * Encodes and encrypts an account in the format specified by
 * https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition.
 * However, note that, in keeping with the hash function used by Zilliqa's
 * core protocol, the MAC is generated using sha256 instead of keccak.
 *
 * NOTE: only scrypt and pbkdf2 are supported.
 *
 * @param {KDF} kdf - the key derivation function to be used
 * @param {string} privateKey - hex-encoded private key
 * @param {string} passphrase - a passphrase used for encryption
 *
 * @returns {Promise<string>}
 */
export const encrypt = async (privateKey, passphrase, options = {}) => {
  const salt = randomBytes(32)
  const iv = Buffer.from(randomBytes(16), 'hex')
  const kdf = options.kdf || 'scrypt'
  const level = options.level || 8192
  const kdfparams = {
    salt,
    n: kdf === 'pbkdf2' ? 262144 : level,
    r: 8,
    p: 1,
    dklen: 32
  }

  const derivedKey = await getDerivedKey(Buffer.from(passphrase), kdf, kdfparams)
  const CTR = aes.ModeOfOperation.ctr
  const cipher = new CTR(derivedKey.slice(0, 16), new aes.Counter(iv))
  const ciphertext = Buffer.from(cipher.encrypt(Buffer.from(privateKey, 'hex')))

  return {
    crypto: {
      cipher: 'aes-128-ctr',
      cipherparams: {
        iv: iv.toString('hex')
      },
      ciphertext: ciphertext.toString('hex'),
      kdf,
      kdfparams,
      mac: hashjs
        .sha256()
        .update(Buffer.concat([derivedKey.slice(16, 32), ciphertext]), 'hex')
        .digest('hex')
    },
    id: uuid.v4({ random: randomBytes(16) }),
    version: 3
  }
}

/**
 * decryptPrivateKey
 *
 * Recovers the private key from a keystore file using the given passphrase.
 *
 * @param {string} passphrase
 * @param {KeystoreV3} keystore
 * @returns {Promise<string>}
 */
export const decrypt = async (keystore, passphrase) => {
  const ciphertext = Buffer.from(keystore.crypto.ciphertext, 'hex')
  const iv = Buffer.from(keystore.crypto.cipherparams.iv, 'hex')
  const { kdfparams } = keystore.crypto

  const derivedKey = await getDerivedKey(Buffer.from(passphrase), keystore.crypto.kdf, kdfparams)

  const mac = hashjs
    .sha256()
    .update(Buffer.concat([derivedKey.slice(16, 32), ciphertext]), 'hex')
    .digest('hex')

  if (mac.toUpperCase() !== keystore.crypto.mac.toUpperCase()) {
    return Promise.reject(new Error('Failed to decrypt.'))
  }

  const CTR = aes.ModeOfOperation.ctr

  const cipher = new CTR(derivedKey.slice(0, 16), new aes.Counter(iv))

  const decrypted = Buffer.from(cipher.decrypt(ciphertext)).toString('hex')
  return decrypted
}
