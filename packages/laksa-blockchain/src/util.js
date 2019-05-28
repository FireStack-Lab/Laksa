import { getAddress, AddressType } from 'laksa-core-crypto'
import {
  isObject, strip0x, BN, Long
} from 'laksa-utils'

/**
 * @function toTxParams
 * @description Map RPC response to TxParams
 * @param  {Object} response - Response received from RPC method
 * @return {Object} to Transaction params object
 */
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
    nonce: parseInt(nonce, 10),
    pubKey: strip0x(senderPubKey),
    version: parseInt(version, 10),
    toAddr: getAddress(toAddr, undefined, AddressType.checkSum),
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
