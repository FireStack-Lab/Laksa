export class Property {
  constructor(options, messenger) {
    const { name, getter, setter } = options
    this.name = name
    this.getter = getter
    this.setter = setter
    this.messenger = messenger
  }

  /**
   * @function {setMessenger}
   * @param  {Messenger} msg {messenger instance}
   * @return {Messenger} {messenger setter}
   */
  setMessenger(msg) {
    this.messenger = msg
  }

  /**
   * @function {assignToObject}
   * @param  {object} object {method object}
   * @return {object} {assiged to some object}
   */
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

  /**
   * @function {propertyBuilder}
   * @return {any} {property built}
   */
  propertyBuilder() {
    if (this.messenger !== undefined) {
      return () => this.messenger.send(this.getter)
    }
  }
}
