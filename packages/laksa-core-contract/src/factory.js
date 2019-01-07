import { Core, assertObject } from 'laksa-shared'
import { hashjs, intToHexArray } from 'laksa-core-crypto'
import { Contract } from './contract'
import { TestScilla } from './testScilla'
import { ContractStatus } from './util'

class Contracts extends Core {
  constructor(messenger, signer) {
    super()
    this.messenger = messenger
    this.signer = signer
  }

  getAddressForContract(tx) {
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

  new(code, init) {
    const newContract = new Contract(
      { code, init },
      { messenger: this.messenger, signer: this.signer },
      ContractStatus.INITIALISED
    )
    return newContract
  }

  @assertObject({
    ContractAddress: ['isAddress', 'optional'],
    code: ['isString', 'optional'],
    init: ['isArray', 'optional'],
    status: ['isString', 'optional']
  })
  at(contract) {
    return new Contract(
      { ...contract },
      { messenger: this.messenger, signer: this.signer },
      contract.status
    )
  }

  async testContract(code, init) {
    const contract = new TestScilla(
      { code, init },
      { messenger: this.messenger, signer: this.signer },
      ContractStatus.INITIALISED
    )
    const result = await contract
      // decode ABI from code first
      .decodeABI({ code })
      // we set the init params to decoded ABI
      .then(decoded => decoded.setInitParamsValues(decoded.abi.getInitParams(), init))
      // we get the current block number from node, and set it to params
      .then(inited => inited.setBlockNumber())
      // but we have to give it a test
      .then(ready => ready.testCall(2000))
      // now we change the status to wait for sign
      .then(state => {
        return state.status === ContractStatus.TESTED
          ? { abi: state.abi, init: state.init, status: state.status }
          : false
      })
    return result
  }
}

export { Contracts }
