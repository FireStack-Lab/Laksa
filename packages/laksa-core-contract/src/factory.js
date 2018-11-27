import { Core } from 'laksa-shared'
import { Contract } from './c'
import { TestScilla } from './testScilla'
import { ContractStatus } from './util'

class Contracts extends Core {
  constructor(messenger, signer) {
    super()
    this.messenger = messenger
    this.signer = signer
  }

  new(code, init, { messenger, signer }) {
    const newContract = new Contract(
      { code, init },
      { messenger: messenger || this.messenger, signer: signer || this.signer }
    )
    return newContract
  }

  async testContract(code, init) {
    const contract = new TestScilla(
      { code, init },
      { messenger: this.messenger, signer: this.signer }
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
