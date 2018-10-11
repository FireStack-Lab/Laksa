import npmhdkeyobject from 'hdkey'

class HDKey {
  fromHDKey = npmhdkey => {
    const ret = new HDKey()
    ret.npmhdkey = npmhdkey
    return ret
  }

  fromMasterSeed = seedBuffer => {
    return this.fromHDKey(npmhdkeyobject.fromMasterSeed(seedBuffer))
  }

  npmhdkey

  derivePath = path => {
    return this.fromHDKey(this.npmhdkey.derive(path))
  }

  deriveChild = index => {
    return this.fromHDKey(this.npmhdkey.deriveChild(index))
  }

  getPrivateKey = () => {
    return this.npmhdkey._privateKey
  }

  getPrivateKeyString = () => {
    return this.npmhdkey._privateKey.toString('hex')
  }
}

export default HDKey
