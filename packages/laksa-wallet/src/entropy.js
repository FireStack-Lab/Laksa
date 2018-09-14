import { randomBytes, isPrivateKey, isString } from 'laksa-utils'
import uuid from 'uuid'
import CryptoJS from 'crypto-js'

export const encrypt = (privateKey, password) => {
  if (!isPrivateKey) throw new Error('Invalid PrivateKey')
  if (!isString(password)) throw new Error('no password found')
  const iv = randomBytes(16)
  const salt = randomBytes(32)
  const kdfparams = {
    dklen: 32,
    salt: salt.toString('hex'),
    c: 262144,
    prf: 'hmac-sha256'
  }

  const derivedKey = CryptoJS.PBKDF2(password, CryptoJS.enc.Utf8.parse(kdfparams.salt), {
    keySize: 256 / 32,
    iterations: kdfparams.c
  })
  // password should be replaced to derivedKey
  const ciphertext = CryptoJS.AES.encrypt(privateKey, derivedKey.toString().slice(0, 16), {
    iv: CryptoJS.enc.Hex.parse(iv.toString('hex')),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })

  const macBuffer = Buffer.concat([
    Buffer.from(derivedKey.toString().slice(16, 32), 'hex'),
    Buffer.from(ciphertext.toString(), 'hex')
  ])

  const mac = CryptoJS.SHA3(macBuffer.toString())

  return {
    version: 3,
    id: uuid.v4({ random: randomBytes(16) }),
    crypto: {
      ciphertext: ciphertext.toString(),
      cipherparams: {
        iv: iv.toString('hex')
      },
      cipher: 'aes-128-ctr',
      kdf: 'pbkdf2',
      kdfparams,
      mac: mac.toString()
    }
  }
}

export const decrypt = (keyStore, password) => {
  if (!isString(password)) throw new Error('no password found')
  const data = keyStore.crypto.ciphertext

  const derivedKey = CryptoJS.PBKDF2(
    password,
    CryptoJS.enc.Utf8.parse(keyStore.crypto.kdfparams.salt),
    {
      keySize: 256 / 32,
      iterations: keyStore.crypto.kdfparams.c
    }
  )

  const macBuffer = Buffer.concat([
    Buffer.from(derivedKey.toString().slice(16, 32), 'hex'),
    Buffer.from(keyStore.crypto.ciphertext.toString(), 'hex')
  ])

  const macString = CryptoJS.SHA3(macBuffer.toString()).toString()
  if (macString !== keyStore.crypto.mac) {
    throw Error('password may be wrong')
  }

  const decrypted = CryptoJS.AES.decrypt(data, derivedKey.toString().slice(0, 16), {
    iv: CryptoJS.enc.Hex.parse(keyStore.crypto.cipherparams.iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })

  return decrypted.toString(CryptoJS.enc.Utf8)
}
