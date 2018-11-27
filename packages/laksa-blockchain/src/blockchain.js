import { Core } from 'laksa-shared'
import { Method } from './method'
import { Property } from './property'
import methodObjects from './methodObjects'
import propertyObjects from './propertyObjects'
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
}
