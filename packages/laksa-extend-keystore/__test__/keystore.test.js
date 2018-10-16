import { generatePrivateKey } from '../../laksa-core-crypto/src'
import { encrypt, decrypt } from '../src'

describe('test validator', () => {
  const privateKey = generatePrivateKey()
  it('test encrypt', async () => {
    const encrypted = await encrypt(privateKey, '123445', { kdf: 'scrypt', level: 1024 })
    expect(encrypted.crypto).toEqual(
      expect.objectContaining({
        mac: expect.any(String)
      })
    )
    const encryptedPbkdf2 = await encrypt(privateKey, '123445', { kdf: 'pbkdf2' })
    expect(encryptedPbkdf2.crypto).toEqual(
      expect.objectContaining({
        mac: expect.any(String)
      })
    )
    const encryptedDefault = await encrypt(privateKey, '123445')
    expect(encryptedDefault.crypto).toEqual(
      expect.objectContaining({
        mac: expect.any(String)
      })
    )
    try {
      await encrypt(privateKey, '123445', { kdf: 'unknown' })
    } catch (error) {
      expect(error.message).toEqual('Only pbkdf2 and scrypt are supported')
    }
  })
  it('test decrypt', async () => {
    const encrypted = await encrypt(privateKey, '12345', { kdf: 'scrypt', level: 1024 })

    const decryptedDefault = await decrypt(encrypted, '12345')
    expect(decryptedDefault).toEqual(privateKey)

    try {
      await decrypt(encrypted, '123456')
    } catch (error) {
      expect(error.message).toEqual('Failed to decrypt.')
    }
  })
})
