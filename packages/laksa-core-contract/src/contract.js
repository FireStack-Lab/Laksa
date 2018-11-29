import { Transaction } from 'laksa-core-transaction'
import { Long, BN } from 'laksa-utils'

import { ContractStatus, setParamValues } from './util'

export class Contract {
  constructor(params, factory, status = ContractStatus.INITIALISED) {
    this.code = params.code || ''
    this.init = params.init || []
    this.ContractAddress = params.ContractAddress || undefined
    this.messenger = factory.messenger
    this.signer = factory.signer
    this.status = status
  }

  get payload() {
    return {
      version: 0,
      amount: new BN(0),
      toAddr: String(0).repeat(40),
      code: this.code,
      data: JSON.stringify(this.init).replace(/\\"/g, '"')
    }
  }

  setStatus(status) {
    this.status = status
  }

  /**
   * @function {setInitParamsValues}
   * @param  {Array<Object>} initParams    {init params get from ABI}
   * @param  {Array<Object>} arrayOfValues {init params set for ABI}
   * @return {Contract} {raw contract object}
   */
  setInitParamsValues(initParams, arrayOfValues) {
    const result = setParamValues(initParams, arrayOfValues)
    this.init = result
    return this
  }

  async prepareTx(tx, { account, password }) {
    try {
      await this.signTxn(tx, { account, password })
      const { transaction, response } = await tx.sendTransaction()
      this.ContractAddress = response.ContractAddress
      this.transaction = transaction.map(obj => {
        return { ...obj, TranID: response.TranID }
      })
      return tx.confirm(response.TranID)
    } catch (error) {
      throw error
    }
  }

  async deploy(
    { gasLimit = Long.fromNumber(2500), gasPrice = new BN(100) },
    { account = this.signer.signer, password }
  ) {
    if (!this.code || !this.init) {
      throw new Error('Cannot deploy without code or ABI.')
    }
    // console.log(this.signer)
    try {
      const tx = await this.prepareTx(
        new Transaction(
          {
            ...this.payload,
            gasPrice,
            gasLimit
          },
          this.messenger
        ),
        { account, password }
      )

      if (!tx.receipt || !tx.receipt.success) {
        this.setStatus(ContractStatus.REJECTED)
        return this
      }

      this.setStatus(ContractStatus.DEPLOYED)
      return this
    } catch (err) {
      throw err
    }
  }

  async signTxn(txn, { account, password }) {
    try {
      const result = await account.signTransaction(txn, password)
      this.setStatus(ContractStatus.SIGNED)
      return result
    } catch (error) {
      throw error
    }
  }
}
