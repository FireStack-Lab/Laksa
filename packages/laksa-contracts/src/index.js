import { Contract, toBN } from 'laksa-core-contract'

class Contracts {
  constructor(messenger) {
    this.messenger = messenger
  }

  contracts = {
    waitForSign: [],
    deployed: []
  }

  async new(code, initParams) {
    const contract = new Contract(this.messenger)
    const result = await contract
      .decodeABI({ code })
      .then(decoded => decoded.setInitParamsValues(decoded.abi.getInitParams(), initParams))
      .then(inited => inited.setBlockNumber())
      .then(setted => setted.generateNewContractJson())
      .then(ready => ready.testCall({ gasLimit: 2000 }))
      .then((state) => {
        if (state.contractStatus === 'waitForSign') {
          return state
        }
      })
    this.contracts.waitForSign.push({ createTime: new Date(), ...result })
    return result
  }

  async deploy({ gasLimit, gasPrice }, contract, signer, password) {
    const { nonce } = await this.messenger.send({
      method: 'GetBalance',
      params: [signer.address]
    })
    const txnJson = {
      version: 0,
      nonce: nonce + 1,
      to: '0000000000000000000000000000000000000000',
      amount: toBN(0),
      gasPrice: toBN(gasPrice).toNumber(),
      gasLimit: toBN(gasLimit).toNumber()
    }
    const txnDetail = Object.assign({}, contract.contractJson, txnJson)
    const signedContract = typeof signer.privateKey !== 'symbol'
      ? signer.signTransaction(txnDetail)
      : signer.signTransactionWithPassword(password)

    if (contract.contractStatus === 'waitForSign' && signedContract.signature) {
      const result = await contract.deploy(signedContract)
      this.contracts.deployed.push({ deployedTime: new Date(), ...result })
      return result
    }
  }
}

export default Contracts
