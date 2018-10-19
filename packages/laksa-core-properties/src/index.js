class Property {
  constructor(options) {
    const { name, getter, setter } = options
    this.name = name
    this.getter = getter
    this.setter = setter
    this.messenger = null
  }

  setMessenger(msg) {
    this.messenger = msg
  }

  assignToObject(object) {
    const zilName = this.name
    const asyncGetterName = getName => {
      return `get${getName.charAt(0).toUpperCase()}${getName.slice(1)}`
    }
    const zilObject = {
      get: this.propertyBuilder(),
      enumerable: true
    }
    const newZilObject = {}
    newZilObject[asyncGetterName(zilName)] = this.propertyBuilder()
    Object.defineProperty(object, zilName, zilObject)
    Object.assign(object, newZilObject)
  }

  propertyBuilder() {
    if (this.messenger !== null) {
      return callback => {
        if (callback) {
          return this.messenger.sendAsync({ method: this.getter }, callback)
        }
        return this.messenger.send({ method: this.getter })
      }
    }
  }
}

export default Property
