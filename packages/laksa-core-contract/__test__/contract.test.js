import fetch from 'jest-fetch-mock'
import { BN, Long } from '../../laksa-utils/src'
import { Contract, ContractStatus } from '../src'
import { HttpProvider } from '../../laksa-providers-http/src'
import { Messenger } from '../../laksa-core-messenger/src'
import { Wallet } from '../../laksa-wallet/src'
// import { TxStatus } from '../../laksa-core-transaction/src/util'
import config from '../../laksa-core/src/config'

import { testContract } from './fixtures/testContract'

const provider = new HttpProvider('https://mock.com')
const messenger = new Messenger(provider, config)
const wallet = new Wallet(messenger)
messenger.setScillaProvider(provider)

describe('test contract', () => {
  afterEach(() => {
    fetch.resetMocks()
  })
  it('should test contract', async () => {
    const responses = [
      {
        id: 1,
        jsonrpc: '2.0',
        result: {
          balance: '888',
          nonce: 0
        }
      },
      {
        id: '1',
        jsonrpc: '2.0',
        result: {
          Info: 'Contract creation Txn, sent to shard',
          TranID: '2d1eea871d8845472e98dbe9b7a7d788fbcce226f52e4216612592167b89042c'
        }
      },
      {
        id: '1',
        jsonrpc: '2.0',
        result: {
          ID: '463f20976c0bc91c7aaad9c8b31835c9554a28cd2e69992fd80d70e8d3746fe7',
          amount: '0',
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
          toAddr: '0000000000000000000000000000000000000000',
          version: '65537'
        }
      },
      {
        id: 1,
        jsonrpc: '2.0',
        result: {
          balance: '888',
          nonce: 0
        }
      },
      {
        id: 1,
        jsonrpc: '2.0',
        result: {
          balance: '888',
          nonce: 0
        }
      },
      {
        id: '1',
        jsonrpc: '2.0',
        result: {
          Info: 'Contract creation Txn, sent to shard',
          TranID: '2d1eea871d8845472e98dbe9b7a7d788fbcce226f52e4216612592167b89042c'
        }
      },
      {
        id: '1',
        jsonrpc: '2.0',
        result: {
          ID: '463f20976c0bc91c7aaad9c8b31835c9554a28cd2e69992fd80d70e8d3746fe7',
          amount: '0',
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
          toAddr: '0000000000000000000000000000000000000000',
          version: '65537'
        }
      }
    ].map(res => [JSON.stringify(res)])
    fetch.mockResponses(...responses)
    wallet.createAccount()
    const init = [
      {
        value: '0x9bfec715a6bd658fcb62b0f8cc9bfa2ade71434a',
        vname: 'owner',
        type: 'ByStr20'
      }
    ]
    const newContract = new Contract(
      { code: testContract, init },
      { messenger, signer: wallet },
      ContractStatus.INITIALISED
    )
    expect(newContract.code).toEqual(testContract)
    expect(newContract.isInitialised()).toEqual(true)

    const deployParams = {
      gasLimit: Long.fromNumber(2500),
      gasPrice: new BN(100),
      account: wallet.signer,
      password: null,
      maxAttempts: 20,
      interval: 1000
    }
    await newContract.setDeployPayload({
      gasPrice: deployParams.gasPrice,
      gasLimit: deployParams.gasLimit
    })
    // await newContract.signTxn({ account: deployParams.account, password: deployParams.password })
    // expect(newContract.isSigned()).toEqual(true)
    await newContract.sendContract({
      account: deployParams.account,
      password: deployParams.password
    })
    expect(newContract.isSent()).toEqual(true)
    await newContract.confirmTx(newContract.maxAttempts, newContract.interval)
    expect(newContract.isDeployed()).toEqual(true)

    const newContract2 = new Contract(
      { code: testContract, init },
      { messenger, signer: wallet },
      ContractStatus.INITIALISED
    )
    await newContract2.setDeployPayload({
      gasPrice: deployParams.gasPrice,
      gasLimit: deployParams.gasLimit
    })
    await newContract2.signTxn({ account: deployParams.account, password: deployParams.password })
    expect(newContract2.isSigned()).toEqual(true)
    const newContract3 = new Contract(
      { code: testContract, init, version: 1 },
      { messenger, signer: wallet },
      ContractStatus.INITIALISED
    )
    const deployed = await newContract3.deploy(deployParams)
    expect(deployed.isRejected()).toEqual(true)
  })
  it('should call a contract', async () => {
    const responses = [
      {
        id: 1,
        jsonrpc: '2.0',
        result: {
          balance: '888',
          nonce: 0
        }
      },
      {
        id: '1',
        jsonrpc: '2.0',
        result: {
          Info: 'Contract creation Txn, sent to shard',
          TranID: '2d1eea871d8845472e98dbe9b7a7d788fbcce226f52e4216612592167b89042c',
          ContractAddress: '0000000000000000000000000000000000000000'
        }
      },
      {
        id: '1',
        jsonrpc: '2.0',
        result: {
          ID: '463f20976c0bc91c7aaad9c8b31835c9554a28cd2e69992fd80d70e8d3746fe7',
          amount: '0',
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
          toAddr: '0000000000000000000000000000000000000000',
          version: '65537'
        }
      },
      {
        id: 1,
        jsonrpc: '2.0',
        result: {
          balance: '888',
          nonce: 0
        }
      },
      {
        id: '1',
        jsonrpc: '2.0',
        result: {
          Info: 'Contract creation Txn, sent to shard',
          TranID: '2d1eea871d8845472e98dbe9b7a7d788fbcce226f52e4216612592167b89042c',
          ContractAddress: '0000000000000000000000000000000000000000'
        }
      },
      {
        id: '1',
        jsonrpc: '2.0',
        result: {
          ID: '463f20976c0bc91c7aaad9c8b31835c9554a28cd2e69992fd80d70e8d3746fe7',
          amount: '0',
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
          toAddr: '0000000000000000000000000000000000000000',
          version: '65537'
        }
      }
    ].map(res => [JSON.stringify(res)])
    fetch.mockResponses(...responses)
    wallet.createAccount()

    const deployParams = {
      gasLimit: Long.fromNumber(2500),
      gasPrice: new BN(100),
      account: wallet.signer,
      password: null,
      maxAttempts: 20,
      interval: 1000
    }
    const callParams = {
      transition: 'SetHello',
      params: [],
      amount: new BN(0),
      gasLimit: Long.fromNumber(1000),
      gasPrice: new BN(100),
      account: wallet.signer,
      password: null,
      maxAttempts: 20,
      interval: 1000
    }
    const init = [
      {
        value: '0x9bfec715a6bd658fcb62b0f8cc9bfa2ade71434a',
        vname: 'owner',
        type: 'ByStr20'
      }
    ]
    const newContract = new Contract(
      { code: testContract, init },
      { messenger, signer: wallet },
      ContractStatus.INITIALISED
    )
    try {
      await newContract.call(callParams)
    } catch (error) {
      expect(error.message).toEqual('Contract has not been deployed!')
    }
    const newContract3 = new Contract(
      { code: testContract, init, version: 1 },
      { messenger, signer: wallet },
      ContractStatus.INITIALISED
    )
    const deployed = await newContract3.deploy(deployParams)

    await deployed.call(callParams)
    expect(deployed.transaction.data).toEqual(
      JSON.stringify({
        _tag: callParams.transition,
        params: callParams.params
      })
    )
  })
  it('should typecheck for ADTs', async () => {
    const init = [
      {
        vname: 'contractOwner',
        type: 'ByStr20',
        value: '0x124567890124567890124567890124567890'
      },
      { vname: 'name', type: 'String', value: 'NonFungibleToken' },
      { vname: 'symbol', type: 'String', value: 'NFT' },
      {
        vname: 'dummy_optional_value',
        type: 'Option (Uint32)',
        value: { constructor: 'None', argtypes: ['Uint32'], arguments: [] }
      }
    ]
    const contract = new Contract(
      { code: testContract, init, version: 1 },
      { messenger, signer: wallet },
      ContractStatus.INITIALISED
    )

    const responses = [
      {
        id: 1,
        jsonrpc: '2.0',
        result: {
          balance: 888,
          nonce: 1
        }
      },
      {
        id: 1,
        jsonrpc: '2.0',
        result: {
          TranID: 'some_hash',
          Info: 'Non-contract txn, sent to shard'
          // ContractAddress: '0000000000000000000000000000000000000000'
        }
      },
      {
        id: 1,
        jsonrpc: '2.0',
        result: {
          ID: 'some_hash',
          receipt: { success: true, cumulative_gas: '1000' }
        }
      }
    ].map(res => [JSON.stringify(res)])

    fetch.mockResponses(...responses)

    const deployed = await contract.deploy({
      gasPrice: new BN(1000),
      gasLimit: Long.fromNumber(1000)
    })

    expect(deployed.transaction.isConfirmed()).toBeTruthy()
    expect(deployed.isDeployed()).toBeTruthy()
    expect(deployed.status).toEqual(ContractStatus.DEPLOYED)
    expect(deployed.ContractAddress).toMatch(/[A-F0-9]+/)
  })
})
