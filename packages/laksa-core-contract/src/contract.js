import {
  isByStrX, isUint, isInt, isString, isBN, toBN
} from 'laksa-utils'
import { createTransactionJson } from 'laksa-core-crypto'
import ABI from './abi'

const Matchers = {
  ByStrX: /^ByStr[0-9]+$/,
  String: /^String$/,
  Uint: /^Uint(32|64|128|256)$/,
  Int: /^Int(32|64|128|256)$/,
  BNum: /^BNum$/
}
const validators = [
  {
    type: 'ByStrX',
    match: type => Matchers.ByStrX.test(type),
    validatorFn: value => isByStrX.test(value)
  },
  {
    type: 'UInt',
    match: type => Matchers.Uint.test(type),
    validatorFn: value => isUint.test(value)
  },
  {
    type: 'Int',
    match: type => Matchers.Int.test(type),
    validatorFn: value => isInt.test(value)
  },
  {
    type: 'BNum',
    match: type => Matchers.BNum.test(type),
    validatorFn: value => isBN.test(toBN(value))
  },
  {
    type: 'String',
    match: type => Matchers.String.test(type),
    validatorFn: value => isString.test(value)
  }
]

const validate = (type, value) => {
  return validators.some(val => val.match(type) && val.validatorFn(value))
}

const setParamValues = (rawParams, newValues) => {
  const newParams = []
  rawParams.forEach((v, i) => {
    if (!validate(v.type, newValues[i])) {
      throw new TypeError(`Type validator failed,with <${v.vname}:${v.type}>`)
    }
    const newObj = Object.assign({}, v, { value: newValues[i], vname: v.name ? v.name : v.vname })
    if (newObj.name) {
      delete newObj.name
    }
    newParams.push(newObj)
  })
  return newParams
}

class Contract {
  constructor(abi, code, nodeProvider, scillaProvider) {
    this.abi = abi || {}
    this.code = code || ''
    this.nodeProvider = nodeProvider || undefined
    this.scillaProvider = scillaProvider || undefined
  }

  rawTxObject = {
    version: 0,
    nonce: 1,
    to: '0000000000000000000000000000000000000000',
    amount: toBN(0),
    gasPrice: 1,
    gasLimit: 50,
    code: '',
    data: ''
  }

  initParams = []

  blockchain = []

  // event
  on = () => {}

  // action deploay
  deploy = ({
    blockNumber, privateKey, amount, gasPrice, gasLimit, nonce
  }) => {
    this.setBlockchain(blockNumber)
    this.setCreationBlock(blockNumber)
    const newDeployment = {
      ...this.rawTxObject,
      nonce,
      amount: amount !== undefined ? toBN(amount) : toBN(0),
      gasPrice: gasPrice !== undefined ? toBN(gasPrice).toNumber() : 1,
      gasLimit: gasLimit !== undefined ? toBN(gasLimit).toNumber() : 50,
      code: JSON.stringify(this.code),
      data: JSON.stringify(this.initParams.concat(this.blockchain))
    }
    // console.log(newDeployment)
    const txn = createTransactionJson(privateKey, newDeployment)
    return txn
  }

  // action call
  call = () => {}

  // provider Setter
  setNodeProvider(provider) {
    this.nodeProvider = provider
  }

  // scilla provider Setter
  setScillaProvider(provider) {
    this.scillaProvider = provider
  }

  setABI(abi) {
    this.abi = abi !== undefined ? new ABI(abi) : {}
  }

  setCode(code) {
    this.code = JSON.stringify(code) || ''
  }

  setInitParamsValues(initParams, arrayOfValues) {
    const result = setParamValues(initParams, arrayOfValues)
    this.initParams = result
    return result
  }

  setCreationBlock(blockNumber) {
    const result = setParamValues(
      [{ vname: '_creation_block', type: 'BNum' }],
      [toBN(blockNumber).toString()]
    )
    this.initParams.push(result[0])
    return result[0]
  }

  setBlockchain(blockNumber) {
    const result = setParamValues(
      [{ vname: 'BLOCKNUMBER', type: 'BNum' }],
      [toBN(blockNumber).toString()]
    )
    this.blockchain.push(result[0])
    return result[0]
  }
}

export default Contract
