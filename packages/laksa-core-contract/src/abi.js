/**
 * @function getParamTypes
 * @description extract param types for abi object
 * @param  {Array<Object>} list {description}
 * @return {Array<Object>} {description}
 */
function getParamTypes(list) {
  const result = []
  list.map((obj, index) => {
    result[index] = obj.type
    return false
  })
  return result
}

/**
 * @class ABI
 * @description ABI instance
 * @param  {Object} abi abi object
 * @return {ABI} ABI instance
 */
class ABI {
  constructor(abi) {
    /**
     * @var {Array} events
     * @memberof ABI
     * @description events
     */
    this.events = abi !== undefined ? abi.events : [] // Array<object>
    /**
     * @var {Array} fields
     * @memberof ABI
     * @description fields
     */
    this.fields = abi !== undefined ? abi.fields : [] // Array<object>
    /**
     * @var {String} name
     * @memberof ABI
     * @description name
     */
    this.name = abi !== undefined ? abi.name : '' // string
    /**
     * @var {Array} params
     * @memberof ABI
     * @description params
     */
    this.params = abi !== undefined ? abi.params : [] // Array<object>
    /**
     * @var {Array} transitions
     * @memberof ABI
     * @description transitions
     */
    this.transitions = abi !== undefined ? abi.transitions : [] // Array<object>
  }

  /**
   * @function getName
   * @memberof ABI
   * @description name getter
   * @return {String} ABI.name
   */
  getName() {
    return this.name
  }

  /**
   * @function getInitParams
   * @memberof ABI
   * @description params getter
   * @return {String} ABI.params
   */
  getInitParams() {
    return this.params
  }

  /**
   * @function getInitParamTypes
   * @memberof ABI
   * @description get param types array
   * @return {Array<Object>} param types
   */
  getInitParamTypes() {
    if (this.params.length > 0) {
      return getParamTypes(this.params)
    } else return []
  }

  /**
   * @function getFields
   * @memberof ABI
   * @description fields getter
   * @return {Array} ABI.fields
   */
  getFields() {
    return this.fields
  }

  /**
   * @function getFieldsTypes
   * @memberof ABI
   * @description get fields types array
   * @return {Array<Object>} fields types
   */
  getFieldsTypes() {
    if (this.fields.length > 0) {
      return getParamTypes(this.fields)
    } else return []
  }

  /**
   * @function getTransitions
   * @memberof ABI
   * @description transitions getter
   * @return {Array<Object>} ABI.transitions
   */
  getTransitions() {
    return this.transitions
  }

  /**
   * @function getTransitionsParamTypes
   * @memberof ABI
   * @description get transitions types array
   * @return {Array<Object>} transitions types
   */
  getTransitionsParamTypes() {
    const returnArray = []
    if (this.transitions.length > 0) {
      for (let i = 0; i < this.transitions.length; i += 1) {
        returnArray[i] = getParamTypes(this.transitions[i].params)
      }
    }
    return returnArray
  }

  /**
   * @function getEvents
   * @memberof ABI
   * @description events getter
   * @return {Array<Object>} ABI.events
   */
  getEvents() {
    return this.events
  }
}

export { ABI }
