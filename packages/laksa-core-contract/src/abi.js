function getParamTypes(list) {
  const result = []
  list.map((obj, index) => {
    result[index] = obj.type
    return false
  })
  return result
}

class ABI {
  constructor(abi) {
    this.events = abi !== undefined ? abi.events : [] // Array<object>
    this.fields = abi !== undefined ? abi.fields : [] // Array<object>
    this.name = abi !== undefined ? abi.name : '' // string
    this.params = abi !== undefined ? abi.params : [] // Array<object>
    this.transitions = abi !== undefined ? abi.transitions : [] // Array<object>
  }

  getName() {
    return this.name
  }

  getInitParams() {
    return this.params
  }

  getInitParamTypes() {
    if (this.params.length > 0) {
      return getParamTypes(this.params)
    }
  }

  getFields() {
    return this.fields
  }

  getFieldsTypes() {
    if (this.fields.length > 0) {
      return getParamTypes(this.fields)
    }
  }

  getTransitions() {
    return this.transitions
  }

  getTransitionsParamTypes() {
    const returnArray = []
    if (this.transitions.length > 0) {
      for (let i = 0; i < this.transitions.length; i += 1) {
        returnArray[i] = getParamTypes(this.transitions[i].params)
      }
    }
    return returnArray
  }

  getEvents() {
    return this.events
  }
}

export default ABI
