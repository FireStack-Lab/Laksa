import fetch from 'jest-fetch-mock'
import { ContractStatus, Contracts } from '../src'
import { HttpProvider } from '../../laksa-providers-http/src'
import { Messenger } from '../../laksa-core-messenger/src'
// import { BN, Long } from '../../laksa-utils/src'
// import { TxStatus } from '../../laksa-core-transaction/src/util'
import config from '../../laksa-core/src/config'

import { testContract } from './fixtures/testContract'
import { Wallet } from '../../laksa-wallet/src'

const provider = new HttpProvider('https://mock.com')
const messenger = new Messenger(provider, config)
const wallet = new Wallet(messenger)
const contracts = new Contracts(messenger, wallet)
messenger.setScillaProvider(provider)

describe('test contract factory', () => {
  afterEach(() => {
    fetch.resetMocks()
  })
  it('should test test scilla', async () => {
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

    const result = await contracts.testContract(testContract, init)
    expect(result.status).toEqual(ContractStatus.TESTED)
  })
  it('should generate a new contract', () => {
    const init = [
      {
        value: '0x9bfec715a6bd658fcb62b0f8cc9bfa2ade71434a',
        vname: 'owner',
        type: 'ByStr20'
      }
    ]
    const newContract = contracts.new(testContract, init)
    expect(newContract.status).toEqual(ContractStatus.INITIALISED)
    expect(newContract.code).toEqual(testContract)

    const newContract2 = contracts.at(newContract)
    expect(newContract2.code).toEqual(testContract)
    expect(newContract.status).toEqual(ContractStatus.INITIALISED)
  })
})
