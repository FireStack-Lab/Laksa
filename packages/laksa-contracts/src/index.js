import {
  Contract, ContractStatus, toBN, Transaction
} from 'laksa-core-contract'

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
   * @function {at}
   * @param  {string} address    {description}
   * @param  {ABI} abi        {description}
   * @param  {string} code       {scilla code string}
   * @param  {Array<object>} initParams {description}
   * @param  {Symbol} state      {description}
   * @return {Contract} {description}
   */
  at(address, abi, code, initParams, state) {
    return new Contract(this, abi, address, code, initParams, state)
  }

  /**
   * @function {new}
   * @param  {string} code       {scilla code string}
   * @param  {Array<object>} initParams {array of init params}
   * @param  {object} options    {options that set for new contract}
   * @return {Contract} {contract that created}
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
      .then(state => {
        if (state.contractStatus === ContractStatus.waitForSign) {
          return state
        }
      })
    // now store it to contracts-storage array
    this.storage.waitForSign.push({ createTime: new Date(), ...result })
    return result
  }

  /**
   * @function {deploy}
   * @param  {Contract} contract {contract object}
   * @param  {Int} gasLimit {gasLimit that set for contract}
   * @param  {Int} gasPrice {gasPrice that set for contract}
   * @param  {Account} signer   {account that for sign}
   * @param  {string} password {password for signer if encrypted}
   * @return {Contract} {contract that deployed}
   */
  async deploy({ contract, gasLimit, gasPrice }, { signer, password }) {
    // we need singer address to get the nonce

    // to create a txn Json
    const txnJson = {
      // version number for deployment
      version: 0,
      // increase the nonce
      // set to 40 bit length zeros
      toAddr: '0000000000000000000000000000000000000000',
      // deploying a new contract, amount will be zero according to zilliqa
      amount: toBN(0),
      // gasPrice will be forced to transform to BN first in the future
      gasPrice: toBN(gasPrice),
      // gasLimit will be forced to transform to BN first in the future
      gasLimit: toBN(gasLimit)
    }

    // generate a new txn json with contract json
    const txnDetail = Object.assign({}, contract.contractJson, txnJson)

    const transaction = new Transaction(txnDetail)

    // check if the signer is encrypted
    const signedContract =
      signer.privateKey !== 'ENCRYPTED'
        ? await signer.signTransaction(transaction)
        : await signer.signTransactionWithPassword(transaction, password)

    // if only the contract  have a signature with signer
    if (signedContract.signature) {
      // then we can deploy it
      const result = await contract.deploy(signedContract)
      // after that we save it to storage
      this.storage.deployed.push({ deployedTime: new Date(), ...result })
      return result
    }
  }
}

export default Contracts
