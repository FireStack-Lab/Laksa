import { Messenger } from 'laksa-core-messenger'
import HttpProvider from 'laksa-providers-http'
import { Wallet } from 'laksa-wallet'
import { toHex } from 'laksa-utils'
import Contracts from '../src'
import { testContract } from './fixtures'
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

// set accountA as defaultAccount and signer
wallet.setDefaultAccount(accountA).setSigner(accountA)

describe('test Contracts', () => {
  let contract
  it('should create a new contract', async () => {
    contract = await contractFactory.new(testContract, [toHex(accountA.address)])
    expect(contract.initParams[0].value).toEqual(`0x${accountA.address}`)
  })
})
