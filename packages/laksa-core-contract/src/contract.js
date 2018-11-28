import { Transaction } from 'laksa-core-transaction'
import { Long } from 'laksa-utils'
import { toBN } from './validate'
import { ContractStatus } from './util'

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
      amount: toBN(0),
      toAddr: String(0).repeat(40),
      code: this.code,
      data: JSON.stringify(this.init).replace(/\\"/g, '"')
    }
  }

  setStatus(status) {
    this.status = status
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
    { gasLimit = Long.fromNumber(2500), gasPrice = toBN(10) },
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
