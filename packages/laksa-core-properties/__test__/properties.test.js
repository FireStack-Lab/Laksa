import { ProtobufProvider as HttpProvider } from '../../laksa-providers-http/src'
import { Messenger } from '../../laksa-core-messenger/src'
import Property from '../src'
import Zil from '../../laksa-zil/src'
// import * as util from '../../laksa-utils/src'

describe('', () => {
  const messenger = new Messenger(new HttpProvider('https://api-scilla.zilliqa.com'))
  const scillaProvider = new HttpProvider('https://scilla-runner.zilliqa.com')
  messenger.setScillaProvider(scillaProvider)
  const zil = new Zil(messenger)
  it('test properties', async () => {
    const newProperty = new Property({
      name: 'myNetworkId',
      getter: 'GetNetworkId'
    })
    newProperty.setMessenger(messenger)
    newProperty.assignToObject(zil)
    const result = await zil.myNetworkId
    expect(result).toEqual('TestNet')
  })
})
