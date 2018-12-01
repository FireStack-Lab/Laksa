import { Core, assertObject } from 'laksa-shared'
import { Transaction } from 'laksa-core-transaction'
import { RPCMethod } from './rpc'
import { Method } from './method'
import { Property } from './property'
import methodObjects from './methodObjects'
import propertyObjects from './propertyObjects'
import { toTxParams } from './util'
/**
 * @function mapObjectToMethods
 * @param  {Zil} main  {assign to Zil class}
 * @return {boolean} {status}
 */
const mapObjectToMethods = main => {
  methodObjects.forEach(data => {
    const zilMethod = new Method(data)
    zilMethod.setMessenger(main.messenger)
    zilMethod.assignToObject(main)
  })
}
/**
 * @function mapPropertyToObjects
 * @param  {Zil} main {assign to Zil class}
 * @return {boolean} {status}
 */
const mapPropertyToObjects = main => {
  propertyObjects.forEach(data => {
    const zilProperty = new Property(data)
    zilProperty.setMessenger(main.messenger)
    zilProperty.assignToObject(main)
  })
}

export class BlockChain extends Core {
  constructor(messenger, signer) {
    super()
    this.messenger = messenger
    this.signer = signer
    mapObjectToMethods(this)
    mapPropertyToObjects(this)
  }

  /**
   * @function {extendMethod}
   * @param  {object} object {method object}
   * @return {boolean} {status}
   */
  extendMethod = object => {
    if (typeof object !== 'object') {
      throw new Error('Method has to be an object')
    }
    const zilMethod = new Method(object)
    zilMethod.setMessenger(this.messenger)
    zilMethod.assignToObject(this)
  }

  /**
   * @function {extendProperty}
   * @param  {object} object {method object}
   * @return {boolean} {status}
   */
  extendProperty = object => {
    if (typeof object !== 'object') {
      throw new Error('Property has to be an object')
    }
    const zilProperty = new Property(object)
    zilProperty.setMessenger(this.messenger)
    zilProperty.assignToObject(this)
  }

  @assertObject({
    toAddr: ['isAddress', 'required'],
    pubKey: ['isPubkey', 'optional'],
    amount: ['isBN', 'required'],
    gasPrice: ['isBN', 'required'],
    gasLimit: ['isLong', 'required'],
    signature: ['isString', 'optional']
  })
  async completeTransaction(tx, account, password) {
    try {
      const accountSigning = account || this.signer.signer
      const passwordSigning = password
      const signedTxn = await accountSigning.signTransaction(tx, passwordSigning)

      const response = await this.messenger.send(RPCMethod.CreateTransaction, {
        ...signedTxn.txParams,
        amount: signedTxn.txParams.amount.toString(),
        gasLimit: signedTxn.txParams.gasLimit.toString(),
        gasPrice: signedTxn.txParams.gasPrice.toString()
      })
      return signedTxn.confirm(response.TranID)
    } catch (err) {
      throw err
    }
  }

  @assertObject({ txHash: ['isHash', 'required'] })
  async confirmTransaction({ txHash }) {
    try {
      const response = await this.messenger.send(RPCMethod.GetTransaction, txHash)

      if (response.error) {
        return Promise.reject(response.error)
      } else {
        return response.receipt.success
          ? Transaction.confirm(toTxParams(response), this.messenger)
          : Transaction.reject(toTxParams(response), this.messenger)
      }
    } catch (err) {
      throw err
    }
  }
}
