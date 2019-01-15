import {
  isObject, strip0x, BN, Long
} from 'laksa-utils'

export function toTxParams(response) {
  const {
    ID,
    toAddr,
    gasPrice,
    gasLimit,
    amount,
    nonce,
    receipt,
    version,
    senderPubKey,
    ...rest
  } = response

  return {
    ...rest,
    TranID: ID,
    nonce,
    pubKey: strip0x(senderPubKey),
    version: parseInt(version, 10),
    toAddr,
    gasPrice: new BN(gasPrice),
    gasLimit: Long.fromString(gasLimit, 10),
    amount: new BN(amount),
    receipt: {
      ...receipt,
      cumulative_gas: parseInt(receipt.cumulative_gas, 10)
    }
  }
}

export { isObject }
