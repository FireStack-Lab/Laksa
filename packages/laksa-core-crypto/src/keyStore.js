import { encryptPrivateKey, decryptPrivateKey } from '@zilliqa-js/crypto'

export const encrypt = async (kdf, privateKey, passphrase) => {
  const encryptedString = await encryptPrivateKey(kdf, privateKey, passphrase)
  const encryptedObject = JSON.parse(encryptedString)
  delete encryptedObject.address
  return encryptedObject
}

export const decrypt = async (passphrase, keystore) => {
  const decrypted = await decryptPrivateKey(passphrase, keystore)
  return decrypted
}
