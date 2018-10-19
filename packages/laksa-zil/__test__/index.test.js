import { ProtobufProvider as HttpProvider } from '../../laksa-providers-http/src'
import { Messenger } from '../../laksa-core-messenger/src'
import Zil from '../src'

describe('test createAccount', () => {
  const url = 'https://api-scilla.zilliqa.com'
  const provider = new HttpProvider(url)
  const messenger = new Messenger(provider)
  const zil = new Zil(messenger)
  it('should be test zil', async () => {
    const connection = await zil.isConnected()

    expect(connection).toEqual('TestNet')
  })
  it('should extend a zil method', async () => {
    const newMethod = {
      name: 'testConnected',
      call: 'GetNetworkId',
      params: {},
      isSendJson: false
    }
    zil.extendMethod(newMethod)
    const testMethod = await zil.testConnected()
    expect(testMethod).toEqual('TestNet')
    try {
      const wrongMethod = 'aka'
      zil.extendMethod(wrongMethod)
    } catch (error) {
      expect(error.message).toEqual('Method has to be an object')
    }
  })
})
