import { intToHexArray } from 'laksa-utils'

export const encodeTransaction = (tx) => {
  const codeHex = Buffer.from(tx.code || '').toString('hex')
  const dataHex = Buffer.from(tx.data || '').toString('hex')
  const pubKeyHex = Buffer.from(tx.pubKey || '').toString()

  const encoded = intToHexArray(tx.version, 64).join('')
    + intToHexArray(tx.nonce || 0, 64).join('')
    + tx.to
    + pubKeyHex
    + tx.amount.toString('hex', 64)
    + intToHexArray(tx.gasPrice, 64).join('')
    + intToHexArray(tx.gasLimit, 64).join('')
    + intToHexArray((tx.code && tx.code.length) || 0, 8).join('') // size of code
    + codeHex
    + intToHexArray((tx.data && tx.data.length) || 0, 8).join('') // size of data
    + dataHex

  return Buffer.from(encoded, 'hex')
}
