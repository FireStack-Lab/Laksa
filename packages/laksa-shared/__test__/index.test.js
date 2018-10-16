import {
  ConnectionTimeout,
  InvalidResponse,
  InvalidConnection,
  InvalidProvider,
  InvalidNumberOfRPCParams
} from '../src'

test('test ConnectionTimeout', () => {
  expect(ConnectionTimeout(500)).toEqual(new Error('CONNECTION TIMEOUT: timeout of 500 ms achived'))
})

test('test InvalidResponse', () => {
  expect(InvalidResponse({ error: 'lll' })).toEqual(
    new Error('Invalid JSON RPC response: {"error":"lll"}')
  )
})

test('test InvalidConnection', () => {
  expect(InvalidConnection('host')).toEqual(
    new Error("CONNECTION ERROR: Couldn't connect to node host.")
  )
})

test('test InvalidProvider', () => {
  expect(InvalidProvider()).toEqual(new Error('Provider not set or invalid'))
})

test('test InvalidNumberOfRPCParams', () => {
  expect(InvalidNumberOfRPCParams()).toEqual(
    new Error('Invalid number of input parameters to RPC method')
  )
})
