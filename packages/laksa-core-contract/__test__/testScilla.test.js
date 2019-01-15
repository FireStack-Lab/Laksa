import fetch from 'jest-fetch-mock'
import { TestScilla, ABI, ContractStatus } from '../src'
import { HttpProvider } from '../../laksa-providers-http/src'
import { Messenger } from '../../laksa-core-messenger/src'
// import { BN, Long } from '../../laksa-utils/src'
// import { TxStatus } from '../../laksa-core-transaction/src/util'
import config from '../../laksa-core/src/config'

import { testContract } from './fixtures/testContract'

const provider = new HttpProvider('https://mock.com')
const messenger = new Messenger(provider, config)
messenger.setScillaProvider(provider)

describe('TestScilla', () => {
  afterEach(() => {
    fetch.resetMocks()
  })
  it('should test ABI', async () => {
    const responses = [
      {
        result: 'success',
        message:
          '{\n  "name": "HelloWorld",\n  "params": [ { "name": "owner", "type": "ByStr20" } ],\n  "fields": [ { "name": "welcome_msg", "type": "String" } ],\n  "transitions": [\n    { "name": "setHello", "params": [ { "name": "msg", "type": "String" } ] },\n    { "name": "getHello", "params": [] }\n  ],\n  "events": []\n}\n'
      }
    ].map(res => [JSON.stringify(res)])
    fetch.mockResponses(...responses)
    const res = await messenger.sendServer('/contract/check', { code: testContract })
    if (res.result !== 'error' && res.message !== null) {
      // expect(JSON.parse(res.message)).toEqual('111')
      const abiObject = new ABI(JSON.parse(res.message))
      expect(abiObject.name).toEqual('HelloWorld')
      expect(abiObject.params).toEqual([{ name: 'owner', type: 'ByStr20' }])
      expect(abiObject.fields).toEqual([{ name: 'welcome_msg', type: 'String' }])

      expect(abiObject.transitions).toEqual([
        { name: 'setHello', params: [{ name: 'msg', type: 'String' }] },
        { name: 'getHello', params: [] }
      ])
      expect(abiObject.events).toEqual([])
    }
  })
  it('should test TestScilla', async () => {
    const responses = [
      {
        result: 'success',
        message:
          '{\n  "name": "HelloWorld",\n  "params": [ { "name": "owner", "type": "ByStr20" } ],\n  "fields": [ { "name": "welcome_msg", "type": "String" } ],\n  "transitions": [\n    { "name": "setHello", "params": [ { "name": "msg", "type": "String" } ] },\n    { "name": "getHello", "params": [] }\n  ],\n  "events": []\n}\n'
      },
      {
        id: 1,
        jsonrpc: '2.0',
        result: {
          body: {
            HeaderSign:
              '2D4601192F6D46E24107D962D5F9C9DFCFB8E2DCC5E6574C6DFA58A3CDE535FE1512436C7117CB4144DE2A4C26B318C12D7D89031964F08E47694DD99182F1D8',
            MicroBlockInfos: [
              {
                MicroBlockHash: '8146ab5769b31ce4fb6e67223456b03d1d69bcf1023f81a1b3ee39566b8221fa',
                MicroBlockShardId: 0,
                MicroBlockTxnRootHash:
                  '0000000000000000000000000000000000000000000000000000000000000000'
              },
              {
                MicroBlockHash: 'c6043ba5aefb09c53046b939e5c463ab34ed50887a9dc804be8a83952c5802d4',
                MicroBlockShardId: 1,
                MicroBlockTxnRootHash:
                  '0000000000000000000000000000000000000000000000000000000000000000'
              },
              {
                MicroBlockHash: 'f90e9c9df5cb18f8bf42ac721a5e45cc459dcc9391c0fb0a1eff521bc055dc95',
                MicroBlockShardId: 2,
                MicroBlockTxnRootHash:
                  '0000000000000000000000000000000000000000000000000000000000000000'
              },
              {
                MicroBlockHash: '64b8eea666208f9154c51c977950aa5b90535637fc956c3326625f78982a481f',
                MicroBlockShardId: 3,
                MicroBlockTxnRootHash:
                  '0000000000000000000000000000000000000000000000000000000000000000'
              }
            ]
          },
          header: {
            BlockNum: '1690',
            DSBlockNum: '17',
            GasLimit: '2000000',
            GasUsed: '0',
            MbInfoHash: 'a42d2a95998a1c043f4c98c8794279f85c6b32586b81a174e215c4375294a6e5',
            MinerPubKey: '0x021257AE3238A022076F0A615F5DBB3A32924AD6B621825FF6B9C71ADD593CF25E',
            NumMicroBlocks: 4,
            NumTxns: 0,
            PrevBlockHash: '8d397b7364a79910620afdb8e15fe334f31a2516092d2b151e44f112a18cbdee',
            Rewards: '0',
            StateDeltaHash: '0000000000000000000000000000000000000000000000000000000000000000',
            StateRootHash: '9cc4bc3273ebcf05630b3f46be4a90015f51e3c8b6211f2a1e7582fa0461bc67',
            Timestamp: '1547545866015257',
            Version: 1
          }
        }
      },
      {
        result: 'success',
        message: {
          gas_remaining: '1947',
          message: null,
          states: [],
          events: []
        }
      }
    ].map(res => [JSON.stringify(res)])
    fetch.mockResponses(...responses)
    const init = [
      {
        value: '0x9bfec715a6bd658fcb62b0f8cc9bfa2ade71434a',
        vname: 'owner',
        type: 'ByStr20'
      }
    ]

    const newContract = new TestScilla({ code: testContract, init }, { messenger })
    const result = await newContract
      // decode ABI from code first
      .decodeABI({ code: testContract })
      // we set the init params to decoded ABI
      .then(decoded => decoded.setInitParamsValues(decoded.abi.getInitParams(), init))
      // we get the current block number from node, and set it to params
      .then(inited => inited.setBlockNumber())
      // but we have to give it a test
      .then(ready => ready.testCall(2000))
      // now we change the status to wait for sign
      .then(state => {
        return state.status === ContractStatus.TESTED
          ? { abi: state.abi, init: state.init, status: state.status }
          : false
      })

    expect(result.status).toEqual(ContractStatus.TESTED)
  })
})
