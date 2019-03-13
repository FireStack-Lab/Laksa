import { Core, assertObject } from 'laksa-shared'
import { hashjs, intToHexArray } from 'laksa-core-crypto'
import { Contract } from './contract'
import { TestScilla } from './testScilla'
import { ContractStatus } from './util'

/**
 * @class Contracts
 * @param  {Messenger}  messenger - Messenger instance
 * @param  {Wallet} signer - Wallet instance
 * @return {Contracts} Contract factory
 */
class Contracts extends Core {
  constructor(messenger, signer) {
    super()
    /**
     * @var {Messeger} messenger
     * @memberof Contracts.prototype
     * @description Messenger instance
     */
    this.messenger = messenger
    /**
     * @var {Wallet} signer
     * @memberof Contracts.prototype
     * @description Wallet instance
     */
    this.signer = signer
  }

  /**
   * @function getAddressForContract
   * @memberof Contracts
   * @description get Contract address from Transaction
   * @param  {Transaction} tx - Transaction instance
   * @return {String} Contract address
   */
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

  /**
   * @function new
   * @memberof Contracts
   * @description Create a Contract
   * @param  {String} code - Code string
   * @param  {Array<Object>} init - init params
   * @return {Contract} Contract instance
   */
  new(code, init) {
    const newContract = new Contract(
      { code, init },
      { messenger: this.messenger, signer: this.signer },
      ContractStatus.INITIALISED
    )
    return newContract
  }

  /**
   * @function at
   * @memberof Contracts
   * @description get a Contract from factory and give it Messenger and Wallet as members
   * @param  {Contract} contract - Contract instance
   * @return {Contract} Contract instance
   */
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

  /**
   * @function testContract
   * @memberof Contracts
   * @description test Contract code and init params, usable before deploying
   * @param  {String} code - Code string
   * @param  {Array<Object>} init - init params
   * @return {Boolean} test result boolean
   */
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
