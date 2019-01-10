import { version } from '../package.json'

export default {
  version,
  Default: {
    CHAIN_ID: 3,
    Network_ID: 'TestNet',
    nodeProviderUrl: 'http://localhost:4200'
  },
  Staging: {
    CHAIN_ID: 63,
    Network_ID: 'TestNet',
    nodeProviderUrl: 'https://staging-api.aws.z7a.xyz'
  },
  TestNet: {
    CHAIN_ID: 2,
    Network_ID: 'TestNet',
    nodeProviderUrl: 'https://api.zilliqa.com' // Mainnet
  },
  MainNet: {
    CHAIN_ID: 1,
    Network_ID: 'MainNet',
    nodeProviderUrl: 'https://api.zilliqa.com'
  }
}
