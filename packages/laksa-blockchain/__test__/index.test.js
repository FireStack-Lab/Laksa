import fetch from 'jest-fetch-mock'

import { BlockChain, Property } from '../src'

import { HttpProvider } from '../../laksa-providers-http/src'
import { Messenger } from '../../laksa-core-messenger/src'
import { BN, Long } from '../../laksa-utils/src'
import { TxStatus } from '../../laksa-core-transaction/src/util'
import config from '../../laksa-core/src/config'

const provider = new HttpProvider('https://mock.com')
const messenger = new Messenger(provider, config)
messenger.setScillaProvider(provider)

describe('test Blockchain', () => {
  afterEach(() => {
    fetch.resetMocks()
  })
  it('should test instant', async () => {
    const responses = [
      {
        id: '1',
        jsonrpc: '2.0',
        result: {
          ID: '463f20976c0bc91c7aaad9c8b31835c9554a28cd2e69992fd80d70e8d3746fe7',
          amount: '1344901',
          gasLimit: '1',
          gasPrice: '1000000000',
          nonce: '1344901',
          receipt: {
            cumulative_gas: '1',
            epoch_num: '5986',
            success: true
          },
          senderPubKey: '0x0276C8C0A21F38A7B18B356C9FBFF9AE9EE2CDF8F93051D4014CDB2042DEE184E8',
          signature:
            '0xBF16A0563D0D2FF57B045866EF1D955044175DA5558E22B772D7134DF09195B2A016489295BAB4C37D470F3022DAE5E4C3A1FF51F32B338C14427DA9A84C6024',
          toAddr: 'ad299429924fda0a194cf5442337bcaa47a78592',
          version: '65537'
        }
      },
      {
        id: '1',
        jsonrpc: '2.0',
        result: {
          Info: 'Non-contract txn, sent to shard',
          TranID: '2d1eea871d8845472e98dbe9b7a7d788fbcce226f52e4216612592167b89042c'
        }
      },
      {
        id: '1',
        jsonrpc: '2.0',
        result: 'TestNet'
      }
    ].map(res => [JSON.stringify(res)])
    fetch.mockResponses(...responses)
    const bc = new BlockChain(messenger)
    expect(bc.messenger).toEqual(messenger)

    const newObjects = [
      {
        name: 'getTransaction2',
        call: 'GetTransaction',
        params: {
          txHash: ['isHash', 'required']
        },
        isSendJson: false
      },
      {
        name: 'createTransaction2',
        call: 'CreateTransaction',
        params: {
          toAddr: ['isAddress', 'required'],
          pubKey: ['isPubkey', 'required'],
          amount: ['isBN', 'required'],
          gasPrice: ['isBN', 'required'],
          gasLimit: ['isLong', 'required'],
          signature: ['isString', 'required']
        },
        transformer: {
          amount: 'toString',
          gasPrice: 'toString',
          gasLimit: 'toString'
        },
        isSendJson: true
      },
      {
        name: 'getNetworkId2',
        call: 'getNetworkId',
        params: {},
        transformer: {},
        isSendJson: false
      }
    ]
    bc.extendMethod(newObjects[0])
    bc.extendMethod(newObjects[1])
    bc.extendMethod(newObjects[2])

    try {
      bc.extendMethod('')
    } catch (error) {
      expect(error.message).toEqual('Method has to be an object')
    }

    const txInfo = await bc.getTransaction2({ txHash: '0'.repeat(64) })
    expect(txInfo.ID).toEqual('463f20976c0bc91c7aaad9c8b31835c9554a28cd2e69992fd80d70e8d3746fe7')
    const sentTxn = await bc.createTransaction2({
      version: 0,
      toAddr: '0x1234567890123456789012345678901234567890',
      amount: new BN(0),
      gasPrice: new BN(1000),
      gasLimit: Long.fromNumber(1000),
      pubKey: '0'.repeat(66),
      signature: '0'.repeat(128)
    })
    expect(sentTxn.TranID).toEqual(
      '2d1eea871d8845472e98dbe9b7a7d788fbcce226f52e4216612592167b89042c'
    )
    const netId = await bc.getNetworkId2()
    expect(netId).toEqual('TestNet')

    const newP = [
      {
        name: 'getT',
        getter: 'Get'
      },
      /**
       * getClientVersion
       * @params {}
       */
      {
        name: 'cT',
        getter: 'Some'
      }
    ]
    bc.extendProperty(newP[0])
    bc.extendProperty(newP[1])

    try {
      bc.extendProperty('')
    } catch (error) {
      expect(error.message).toEqual('Property has to be an object')
    }
    const m = new Property({
      name: 'getT',
      getter: 'Get'
    })
    m.propertyBuilder()
    const k = new Property(
      {
        name: 'getT',
        getter: 'Get'
      },
      messenger
    )
    const s = k.propertyBuilder()
    expect(typeof s).toEqual('function')
  })
  it('should test a RPC method', async () => {
    const responses = [
      {
        id: 1,
        jsonrpc: '2.0',
        result: 'TestNet'
      }
    ].map(res => [JSON.stringify(res)])
    fetch.mockResponses(...responses)

    const bc = new BlockChain(messenger)
    const result = await bc.getNetworkId()
    expect(result).toEqual('TestNet')
  })
  it('should test complex method', async () => {
    const responses = [
      {
        id: 1,
        jsonrpc: '2.0',
        result: { balance: '888', nonce: 0 }
      }
    ].map(res => [JSON.stringify(res)])
    fetch.mockResponses(...responses)

    const bc = new BlockChain(messenger)
    const result = await bc.getBalance({ address: '0'.repeat(40) })
    expect(result.balance).toEqual('888')
  })
  it('should test complex sendServer method', async () => {
    const responses = [
      {
        id: 1,
        jsonrpc: '2.0',
        result: 'no problem'
      }
    ].map(res => [JSON.stringify(res)])
    fetch.mockResponses(...responses)

    const bc = new BlockChain(messenger)
    const res = await bc.checkCode({ code: '0'.repeat(40) })
    expect(res.result).toEqual('no problem')
  })
  it('should test confirm or reject transaction', async () => {
    const responses = [
      {
        id: '1',
        jsonrpc: '2.0',
        result: {
          ID: '463f20976c0bc91c7aaad9c8b31835c9554a28cd2e69992fd80d70e8d3746fe7',
          amount: '1344901',
          gasLimit: '1',
          gasPrice: '1000000000',
          nonce: '1344901',
          receipt: {
            cumulative_gas: '1',
            epoch_num: '5986',
            success: true
          },
          senderPubKey: '0x0276C8C0A21F38A7B18B356C9FBFF9AE9EE2CDF8F93051D4014CDB2042DEE184E8',
          signature:
            '0xBF16A0563D0D2FF57B045866EF1D955044175DA5558E22B772D7134DF09195B2A016489295BAB4C37D470F3022DAE5E4C3A1FF51F32B338C14427DA9A84C6024',
          toAddr: 'ad299429924fda0a194cf5442337bcaa47a78592',
          version: '65537'
        }
      },
      {
        id: '1',
        jsonrpc: '2.0',
        result: {
          ID: '463f20976c0bc91c7aaad9c8b31835c9554a28cd2e69992fd80d70e8d3746fe7',
          amount: '1344901',
          gasLimit: '1',
          gasPrice: '1000000000',
          nonce: '1344901',
          receipt: {
            cumulative_gas: '1',
            epoch_num: '5986',
            success: false
          },
          senderPubKey: '0x0276C8C0A21F38A7B18B356C9FBFF9AE9EE2CDF8F93051D4014CDB2042DEE184E8',
          signature:
            '0xBF16A0563D0D2FF57B045866EF1D955044175DA5558E22B772D7134DF09195B2A016489295BAB4C37D470F3022DAE5E4C3A1FF51F32B338C14427DA9A84C6024',
          toAddr: 'ad299429924fda0a194cf5442337bcaa47a78592',
          version: '65537'
        }
      }
    ].map(res => [JSON.stringify(res)])
    fetch.mockResponses(...responses)
    const bc = new BlockChain(messenger)
    const resConfirm = await bc.confirmTransaction({
      txHash: '463f20976c0bc91c7aaad9c8b31835c9554a28cd2e69992fd80d70e8d3746fe7'
    })
    const resReject = await bc.confirmTransaction({
      txHash: '463f20976c0bc91c7aaad9c8b31835c9554a28cd2e69992fd80d70e8d3746fe7'
    })
    expect(resConfirm.status).toEqual(TxStatus.Confirmed)
    expect(resReject.status).toEqual(TxStatus.Rejected)
  })
})
