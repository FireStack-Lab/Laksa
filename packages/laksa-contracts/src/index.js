import { Contract, ContractStatus, toBN } from 'laksa-core-contract'

class Contracts {
  constructor(messenger, signer) {
    this.messenger = messenger
    this.signer = signer
  }

  storage = {
    waitForSign: [],
    deployed: []
  }

  /**
   * [at description]
   * @param  {[type]} address [description]
   * @param  {[type]} abi     [description]
   * @param  {[type]} code    [description]
   * @param  {[type]} init    [description]
   * @param  {[type]} state   [description]
   * @return {[type]}         [description]
   */
  at(address, abi, code, initParams, state) {
    return new Contract(this, abi, address, code, initParams, state)
  }

  /**
   * [new description]
   * @param  {[String]}  code       [description]
   * @param  {[Array<object>]}  initParams [description]
   * @return {Promise}            [description]
   */
  async new(code, initParams, options) {
    const contract = new Contract(this)
    const result = await contract
      // decode ABI from code first
      .decodeABI({ code })
      // we set the init params to decoded ABI
      .then(decoded => decoded.setInitParamsValues(decoded.abi.getInitParams(), initParams))
      // we get the current block number from node, and set it to params
      .then(inited => inited.setBlockNumber(options ? options.blockNumber : undefined))
      // we have a contract json now
      .then(setted => setted.generateNewContractJson())
      // but we have to give it a test
      .then(ready => ready.testCall(options ? options.gasLimit : 2000))
      // now we change the status to wait for sign
      .then((state) => {
        if (state.contractStatus === ContractStatus.waitForSign) {
          return state
        }
      })
    // now store it to contracts-storage array
    this.storage.waitForSign.push({ createTime: new Date(), ...result })
    return result
  }

  /**
   * [deploy description]
   * @param  {[BN|Number]}  gasLimit [description]
   * @param  {[BN|Number]}  gasPrice [description]
   * @param  {[Contract]}  contract [description]
   * @param  {[Account]}  signer   [description]
   * @param  {[String]}  password [description]
   * @return {Promise}          [description]
   */
  async deploy({ gasLimit, gasPrice }, contract, signer, password) {
    // we need singer address to get the nonce
    const { nonce } = await this.messenger.send({
      method: 'GetBalance',
      params: [signer.address]
    })

    // to create a txn Json we
    const txnJson = {
      // version number for deployment
      version: 0,
      // increase the nonce
      nonce: nonce + 1,
      // set to 40 bit length zeros
      to: '0000000000000000000000000000000000000000',
      // deploying a new contract, amount will be zero according to zilliqa
      amount: toBN(0),
      // gasPrice will be forced to transform to BN first in the future
      gasPrice: toBN(gasPrice).toNumber(),
      // gasLimit will be forced to transform to BN first in the future
      gasLimit: toBN(gasLimit).toNumber()
    }

    // generate a new txn json with contract json
    const txnDetail = Object.assign({}, contract.contractJson, txnJson)

    // check if the signer is encrypted
    const signedContract = typeof signer.privateKey !== 'symbol'
      ? signer.signTransaction(txnDetail)
      : signer.signTransactionWithPassword(password)

    // if only the contract status is waitForSign, and we have a signature with signer
    if (contract.contractStatus === ContractStatus.waitForSign && signedContract.signature) {
      // then we can deploy it
      const result = await contract.deploy(signedContract)
      // after that we save it to storage
      this.storage.deployed.push({ deployedTime: new Date(), ...result })
      return result
    }
  }
}

export default Contracts
