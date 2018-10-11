const ConnectionTimeout = ms => {
  return new Error(`CONNECTION TIMEOUT: timeout of ${ms} ms achived`)
}
const InvalidNumberOfRPCParams = () => {
  return new Error('Invalid number of input parameters to RPC method')
}

const InvalidConnection = host => {
  return new Error(`CONNECTION ERROR: Couldn't connect to node ${host}.`)
}
const InvalidProvider = () => {
  return new Error('Provider not set or invalid')
}
const InvalidResponse = result => {
  const message =
    !!result && !!result.error && !!result.error.message
      ? result.error.message
      : `Invalid JSON RPC response: ${JSON.stringify(result)}`
  return new Error(message)
}

export {
  ConnectionTimeout,
  InvalidResponse,
  InvalidConnection,
  InvalidProvider,
  InvalidNumberOfRPCParams
}
