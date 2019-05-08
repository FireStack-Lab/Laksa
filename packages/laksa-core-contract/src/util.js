import { hashjs, intToHexArray } from 'laksa-core-crypto'
import { validate } from './validate'

/**
 * @var {Object} ContractStatus
 * @description  immutable contract status
 */
export const ContractStatus = Object.freeze({
  INITIALISED: 'initialised',
  TESTED: 'tested',
  ERROR: 'error',
  SIGNED: 'signed',
  SENT: 'sent',
  REJECTED: 'rejected',
  DEPLOYED: 'deployed'
})

/**
 * @function setParamValues
 * @description set param values
 * @param  {Array<Object>} rawParams - init params get from ABI
 * @param  {Array<Object>} newValues - init params set for ABI
 * @return {Array<objObjectect>} new array of params objects
 */
export const setParamValues = (rawParams, newValues) => {
  const newParams = []
  rawParams.forEach((v, i) => {
    if (!validate(v.type, newValues[i].value)) {
      throw new TypeError(`Type validator failed,with <${v.vname}:${v.type}>`)
    }
    // FIXME:it may change cause local scilla runner return the `name` not `vname`
    // But when call or make transaction, remote node only accpet `vname`
    const newObj = Object.assign({}, v, {
      value: newValues[i].value,
      vname: v.name ? v.name : v.vname
    })
    if (newObj.name) {
      delete newObj.name
    }
    newParams.push(newObj)
  })
  return newParams
}

export function getAddressForContract(tx) {
  // always subtract 1 from the tx nonce, as contract addresses are computed
  // based on the nonce in the global state.
  const nonce = tx.txParams.nonce ? tx.txParams.nonce - 1 : 0

  return hashjs
    .sha256()
    .update(tx.senderAddress, 'hex')
    .update(intToHexArray(nonce, 64).join(''), 'hex')
    .digest('hex')
    .slice(24)
}
