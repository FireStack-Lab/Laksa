import { validate } from './validate'

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
 * @param  {Array<object>} rawParams {init params get from ABI}
 * @param  {Array<object>} newValues {init params set for ABI}
 * @return {Array<object>} {new array of params objects}
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
