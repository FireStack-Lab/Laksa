import { ContractStatus } from 'laksa-core-contract'
import { Messenger } from '../../laksa-core-messenger/src'
import { ProtobufProvider as HttpProvider } from '../../laksa-providers-http/src'
import { Wallet } from '../../laksa-wallet/src'
import { toHex } from '../../laksa-utils/src'
import Contracts from '../src'
import { testContract } from './fixtures'

// set accountA as defaultAccount and signer
// set provider
const nodeProvider = new HttpProvider('https://api-scilla.zilliqa.com')
const scillaProvider = new HttpProvider('https://scilla-runner.zilliqa.com')
// set messenger
const messenger = new Messenger()
messenger.setProvider(nodeProvider)
messenger.setScillaProvider(scillaProvider)
// init wallet and contracts
const wallet = new Wallet(messenger)
const contractFactory = new Contracts(messenger, wallet)

// default privatekey and import to wallet
const privateKey = '97d2d3a21d829800eeb01aa7f244926f993a1427d9ba79d9dc3bf14fe04d9e37'
const accountA = wallet.importAccountFromPrivateKey(privateKey)
wallet.setSigner(accountA)

describe('test Contracts', () => {
  let contract
  it('should create a new contract', async () => {
    contract = await contractFactory.new(testContract, [toHex(accountA.address)], {
      gasLimit: 2000,
      blockNumber: 1999
    })
    expect(contract.initParams[0].value).toEqual(`0x${accountA.address}`)
    expect(contractFactory.storage.waitForSign[0].contractStatus).toEqual(
      ContractStatus.waitForSign
    )
    const contractWithDefaulGasLimit = await contractFactory.new(testContract, [
      toHex(accountA.address)
    ])
    expect(contractWithDefaulGasLimit.initParams[0].value).toEqual(`0x${accountA.address}`)
    expect(contractFactory.storage.waitForSign[1].contractStatus).toEqual(
      ContractStatus.waitForSign
    )
  })
  it('should mannually deploy a new contract', async () => {
    const protectedAccount = await accountA.encrypt('passWordProtected')
    const contractDeployed = await contractFactory.deploy(
      { contract, gasLimit: 1000, gasPrice: 1000 },
      { signer: protectedAccount, password: 'passWordProtected' }
    )
    expect(contractDeployed.initParams[0].value).toEqual(`0x${accountA.address}`)
    expect(contractFactory.storage.deployed[0].contractStatus).toEqual(ContractStatus.deployed)

    const noProtectedAccount = await accountA.decrypt('passWordProtected')
    const contractDeployedAgain = await contractFactory.deploy(
      { contract, gasLimit: 1000, gasPrice: 1000 },
      { signer: noProtectedAccount }
    )
    expect(contractDeployedAgain.initParams[0].value).toEqual(`0x${accountA.address}`)
    expect(contractFactory.storage.deployed[1].contractStatus).toEqual(ContractStatus.deployed)
  })
})
