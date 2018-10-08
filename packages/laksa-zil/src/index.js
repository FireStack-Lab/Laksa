import Method from 'laksa-core-methods'
import Property from 'laksa-core-properties'
import methodObjects from './methodObjects'
import propertyObjects from './propertyObjects'

const mapObjectToMethods = (main) => {
  methodObjects.map((data) => {
    const zilMethod = new Method(data)
    zilMethod.setMessanger(main.messenger)
    zilMethod.assignToObject(main)
    return false
  })
}

const mapPropertyToObjects = (main) => {
  propertyObjects.map((data) => {
    const zilProperty = new Property(data)
    zilProperty.setMessanger(main.messenger)
    zilProperty.assignToObject(main)
    return false
  })
}

class Zil {
  constructor(Laksa) {
    this.messenger = Laksa.messenger
    this.config = Laksa.config
    mapObjectToMethods(this)
    mapPropertyToObjects(this)
  }

  get defaultBlock() {
    return this.config.defaultBlock
  }

  set defaultBlock(block) {
    this.config.defaultBlock = block
    return block
  }

  get defaultAccount() {
    return this.config.defaultAccount
  }

  set defaultAccount(account) {
    this.config.defaultAccount = account
    return account
  }

  extendMethod = (object) => {
    if (typeof object !== 'object') {
      throw new Error('Method has to be an object')
    }
    const zilMethod = new Method(object)
    zilMethod.setMessanger(this.messenger)
    zilMethod.assignToObject(this)
    return true
  }
}

export default Zil
