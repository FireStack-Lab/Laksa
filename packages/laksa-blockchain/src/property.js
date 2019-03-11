/**
 * @class Property
 * @description generate a property for class
 * @param  {object}  options - property options
 * @param {Messenger} messenger - Messsenger instance
 * @return {Property}
 */
class Property {
  /**
   * @memberof Property
   * @type {String}
   * @description property name
   */
  name

  /**
   * @memberof Property
   * @type {Function}
   * @description property getter
   */
  getter

  /**
   * @memberof Property
   * @type {Function}
   * @description property setter
   */
  setter

  /**
   * @memberof Property
   * @type {Messenger}
   * @description Messenger instance
   */
  messenger

  constructor(options, messenger) {
    const { name, getter, setter } = options
    this.name = name
    this.getter = getter
    this.setter = setter
    this.messenger = messenger
  }

  /**
   * @function setMessenger
   * @memberof Property.prototype
   * @description messenger setter
   * @param  {Messenger} msg - messenger instance
   */
  setMessenger(msg) {
    this.messenger = msg
  }

  /**
   * @function assignToObject
   * @memberof Property.prototype
   * @param  {Object} object - method object
   * @description assign property to class
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
   * @function propertyBuilder
   * @memberof Property.prototype
   * @return {any} - property call
   */
  propertyBuilder() {
    if (this.messenger !== undefined) {
      return () => this.messenger.send(this.getter)
    }
  }
}

export { Property }
