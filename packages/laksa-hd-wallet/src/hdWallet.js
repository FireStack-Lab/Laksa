import { Wallet } from 'laksa-wallet'
import * as Mnemonic from './mnemonic'
import HDKey from './hdkey'

class HDWallet extends Wallet {
  constructor(props, mnemonics, language) {
    super(props)
    this.mnemonicslang = language || 'EN'
    this.mnemonics = mnemonics || Mnemonic.generateMnemonic(this.mnemonicslang)
    this.seed = Mnemonic.mnemonicToSeed(this.mnemonics, this.mnemonicslang)
    this.hdkey = new HDKey()
  }

  network = {
    HDCoinValue: 1
  }

  HDRootKey

  getCurrentNetworkPathString = () => {
    return `m/44'/${this.network.HDCoinValue}'/0'/0`
  }

  createHDRoot = () => {
    const hdkey = this.hdkey.fromMasterSeed(this.seed)
    const HDRootKey = hdkey.derivePath(this.getCurrentNetworkPathString())
    this.HDRootKey = HDRootKey
  }

  createRootAccount = () => {
    if (this.HDRootKey !== undefined) {
      const privateKey = this.HDRootKey.getPrivateKeyString()
      // from laksa-wallet class
      this.importAccountFromPrivateKey(privateKey)
    }
  }
}

export default HDWallet
