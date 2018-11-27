import { Transaction } from 'laksa-core-transaction'
import { sign } from 'laksa-shared'
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

  @sign
  async prepareTx(tx, { signer, password }) {
    try {
      // await tx.signTxn(tx, { signer, password })
      // const { transaction, response } = await tx.sendTransaction()
      // this.ContractAddress = response.ContractAddress
      // this.transaction = transaction.map(obj => {
      //   return { ...obj, TranID: response.TranID }
      // })
      // return tx.confirm(response.TranID)
    } catch (error) {
      throw error
    }
  }

  async deploy({ gasLimit = toBN(2500), gasPrice = toBN(10) }, { signer, password }) {
    if (!this.code || !this.init) {
      throw new Error('Cannot deploy without code or ABI.')
    }
    // console.log(this.signer)
    try {
      const tx = await this.prepareTx(
        new Transaction(
          {
            ...this.payload,
            gasPrice: toBN(gasPrice),
            gasLimit: toBN(gasLimit)
          },
          this.messenger
        ),
        { signer: signer || this.signer, password }
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

  async signTxn(txn, { signer, password }) {
    try {
      const result = await signer.signTransaction(txn, password)
      this.setStatus(ContractStatus.SIGNED)
      return result
    } catch (error) {
      throw error
    }
  }
}
