import { isAddress, isBase58, isBech32 } from 'laksa-utils'
import {
  isValidChecksumAddress, decodeBase58, toChecksumAddress, encodeBase58
} from './util'
import { toBech32Address, fromBech32Address } from './bech32'

const AddressType = Object.freeze({
  bytes20: 'bytes20',
  bytes20Hex: 'bytes20Hex',
  checkSum: 'checkSum',
  base58: 'base58',
  bech32: 'bech32'
})

class ZilAddress {
  addressType

  bytes20

  checkSum

  bech32

  base58

  constructor(raw) {
    this.raw = raw
    this.getAddressType()
  }

  getAddressType() {
    const addrBool = isAddress(this.raw)
    const base58Bool = isBase58(this.raw)
    const bech32Bool = isBech32(this.raw)
    const checksumBool = isValidChecksumAddress(this.raw)

    if (addrBool === true && checksumBool === false) {
      this.addressType = AddressType.bytes20
      this.bytes20 = this.raw.startsWith('0x') ? this.raw.substring(2) : this.raw
      this.normalize()
    } else if (addrBool === true && checksumBool === true) {
      this.addressType = AddressType.checkSum
      this.bytes20 = this.raw.toLowerCase().substring(2)
      this.normalize()
    } else if (bech32Bool === true && isAddress(fromBech32Address(this.raw))) {
      this.addressType = AddressType.bech32
      const decoded = fromBech32Address(this.raw).toLowerCase()
      this.bytes20 = decoded.startsWith('0x') ? decoded.substring(2) : decoded
      this.normalize()
    } else if (base58Bool === true && isAddress(decodeBase58(this.raw))) {
      this.addressType = AddressType.base58
      const decoded = decodeBase58(this.raw).toLowerCase()
      this.bytes20 = decoded.startsWith('0x') ? decoded.substring(2) : decoded
      this.normalize()
    } else {
      throw new Error('unknown address')
    }
  }

  normalize() {
    this.bytes20Hex = `0x${this.bytes20}`
    this.checkSum = toChecksumAddress(this.bytes20)
    this.base58 = encodeBase58(this.checkSum)
    this.bech32 = toBech32Address(this.checkSum)
  }
}

export { ZilAddress, AddressType }
