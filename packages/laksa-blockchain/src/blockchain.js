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
 * @description Map Method objects to Method instance
 * @param  {BlockChain} main  - assign to Zil class
 * @return {Boolean} - status
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
 * @description Map Property objects to Property instance
 * @param  {BlockChain} main - assign to Zil class
 * @return {Boolean} - status
 */
const mapPropertyToObjects = main => {
  propertyObjects.forEach(data => {
    const zilProperty = new Property(data)
    zilProperty.setMessenger(main.messenger)
    zilProperty.assignToObject(main)
  })
}

/**
 * @class BlockChain
 * @description Blockchain instance
 * @param  {Messenger}  messsenger - Messenger instance
 * @param {Wallet} signer - Wallet instance as signer
 * @return {BlockChain} - Blockchain instance
 */
class BlockChain extends Core {
  /**
   * @memberof BlockChain.prototype
   * @type {Messenger} - Messenger Instance
   * @description Messenger instance from parent
   */
  messseger

  /**
   * @memberof BlockChain.prototype
   * @type {Wallet} - Wallet Instance
   * @description Wallet instance from parent
   */
  signer

  /**
   * @memberof BlockChain.prototype
   * @type {Function} - _completeTransaction
   * @description to make transaction and confirm
   */
  completeTransaction = this._completeTransaction

  /**
   * @memberof BlockChain.prototype
   * @type {Function} - _confirmTransaction
   * @description to make a confirm to a exist transaction
   */
  confirmTransaction = this._confirmTransaction

  constructor(messenger, signer) {
    super()
    this.messenger = messenger
    this.signer = signer
    mapObjectToMethods(this)
    mapPropertyToObjects(this)
  }

  /**
   * @function extendMethod
   * @memberof BlockChain.prototype
   * @param  {Object} object - method object
   * @return {Boolean} - status
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
   * @function extendProperty
   * @memberof BlockChain.prototype
   * @param  {Object} object - method object
   * @return {Boolean} - status
   */
  extendProperty = object => {
    if (typeof object !== 'object') {
      throw new Error('Property has to be an object')
    }
    const zilProperty = new Property(object)
    zilProperty.setMessenger(this.messenger)
    zilProperty.assignToObject(this)
  }

  /**
   * @function completeTransaction
   * @memberof BlockChain
   * @param  {Transaction} tx       - Transaction to send
   * @param  {?Account} account  - Account for signing if not use Wallet's signer
   * @param  {?String} password - Password of Account if it is encrypted
   * @return {any} - confirmation process
   */
  @assertObject({
    toAddr: ['isAddress', 'required'],
    pubKey: ['isPubkey', 'optional'],
    amount: ['isBN', 'required'],
    gasPrice: ['isBN', 'required'],
    gasLimit: ['isLong', 'required'],
    signature: ['isString', 'optional']
  })
  async _completeTransaction(tx, account, password) {
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

  // FIXME:Transaction as call back should not be implement with this function
  /**
   * @function confirmTransaction
   * @memberof BlockChain
   * @param  {String} txHash       - Transaction ID
   * @return {Transaction} - Transaction instance with confirm/reject state
   */
  @assertObject({ txHash: ['isHash', 'required'] })
  async _confirmTransaction({ txHash }) {
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

export { BlockChain }
