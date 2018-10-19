import { ProtobufProvider as HttpProvider } from '../../laksa-providers-http/src'
import { Messenger } from '../../laksa-core-messenger/src'
import Method from '../src'
import Zil from '../../laksa-zil/src'
import * as util from '../../laksa-utils/src'

describe('', () => {
  const messenger = new Messenger(new HttpProvider('https://api-scilla.zilliqa.com'))
  const scillaProvider = new HttpProvider('https://scilla-runner.zilliqa.com')
  messenger.setScillaProvider(scillaProvider)
  const zil = new Zil(messenger)
  it('test method send', async () => {
    const newMethod = new Method({
      name: 'getMyFavorTransaction',
      call: 'GetTransaction',
      params: {
        txHash: ['isHash', 'required']
      },
      isSendJson: false
    })
    newMethod.setMessenger(messenger)
    newMethod.assignToObject(zil)
    const result = await zil.getMyFavorTransaction({
      txHash: '5E3124A5DB6AA12FAB6CBDB5F50D5B4037022EF37B2EAB8921F07642B422F250'
    })
    expect(util.isAddress(result.toAddr)).toEqual(true)
  })
  it('test method sendAsync', () => {
    const newMethod = new Method({
      name: 'getMyFavorTransaction',
      call: 'GetTransaction',
      params: {
        txHash: ['isHash', 'required']
      },
      isSendJson: false
    })
    newMethod.setMessenger(messenger)
    newMethod.assignToObject(zil)
    zil.getMyFavorTransaction(
      {
        txHash: '5E3124A5DB6AA12FAB6CBDB5F50D5B4037022EF37B2EAB8921F07642B422F250'
      },
      (err, data) => {
        expect(util.isAddress(data.toAddr)).toEqual(true)
      }
    )
  })
  it('test method sendServer', async () => {
    const newMethod = new Method({
      name: 'checkMyCode',
      call: '',
      params: { code: ['isString', 'required'] },
      isSendJson: true,
      endpoint: '/contract/check'
    })
    newMethod.setMessenger(messenger)
    newMethod.assignToObject(zil)
    try {
      await zil.checkMyCode({
        code: ''
      })
    } catch (error) {
      expect(error.message).toEqual('Error: Bad Request')
    }
  })
  it('test method sendServerAsync', async () => {
    const newMethod = new Method({
      name: 'checkMyCode',
      call: '',
      params: { code: ['isString', 'required'] },
      isSendJson: true,
      endpoint: '/contract/check'
    })
    newMethod.setMessenger(messenger)
    newMethod.assignToObject(zil)

    zil.checkMyCode(
      {
        code: ''
      },
      (err, data) => {
        expect(err).toEqual('Error: Bad Request')
        expect(data).toEqual(null)
      }
    )
  })
})
