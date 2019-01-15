import elliptic from 'elliptic'
import BN from 'bn.js'
import Long from 'long'
import { addresses } from './address.fixtures'
import { checksummedStore } from './checksum.fixtures'
import { pairs } from './keypairs.fixtures'
import schnorrVectors from './schnorr.fixtures.json'
import * as util from '../src'
import * as schnorr from '../src/schnorr'
import { Signature } from '../src/signature'
import { Unit } from '../../laksa-utils/src'

const secp256k1 = elliptic.ec('secp256k1')

describe('utils', () => {
  it('should be able to generate a valid 32-byte private key', () => {
    const pk = util.generatePrivateKey()

    expect(pk).toHaveLength(64)
    expect(util.verifyPrivateKey(pk)).toBeTruthy()
  })

  it('should recover a public key from a private key', () => {
    pairs.forEach(({ private: priv, public: expected }) => {
      const actual = util.getPubKeyFromPrivateKey(priv)
      expect(actual).toEqual(util.compressPublicKey(expected))
    })
  })

  it('should convert a public key to an address', () => {
    pairs.forEach(({ public: pub, digest }) => {
      const expected = digest.slice(24)
      const actual = util.getAddressFromPublicKey(pub)

      expect(actual).toHaveLength(40)
      expect(actual).toEqual(expected)
    })
  })

  it('should be able to recover an address from a private key', () => {
    const [pair] = pairs
    const expected = util.getAddressFromPublicKey(util.compressPublicKey(pair.public))
    const actual = util.getAddressFromPrivateKey(pair.private)

    expect(actual).toHaveLength(40)
    expect(actual).toEqual(expected)
  })

  it('should give the same address for a given public or private key', () => {
    pairs.forEach(({ private: priv, public: pub }) => {
      const fromPrivateKey = util.getAddressFromPrivateKey(priv)
      const fromPublicKey = util.getAddressFromPublicKey(util.compressPublicKey(pub))

      expect(fromPrivateKey).toHaveLength(40)
      expect(fromPublicKey).toHaveLength(40)
      expect(fromPublicKey).toEqual(fromPrivateKey)
    })
  })

  it('should produce the same results as the C++ keygen util', () => {
    addresses.forEach(({ public: pub, private: priv, address }) => {
      const generatedPub = util.getPubKeyFromPrivateKey(priv)
      const addressFromPriv = util.getAddressFromPrivateKey(priv)
      const addressFromPub = util.getAddressFromPrivateKey(priv)

      expect(generatedPub.toUpperCase()).toEqual(pub)
      expect(addressFromPriv.toUpperCase()).toEqual(address)
      expect(addressFromPub.toUpperCase()).toEqual(address)
    })
  })

  // it('should test trySign function', () => {
  //   expect(schnorr.trySign(123, 123, new BN(0), 123)).toThrowError(/Bad private key/)
  // })

  it('should test toSignature', () => {
    const testString =
      'A7AFD2A80B788FCA89BD3D55206AD9CF16FB0A1A6133FDC3F37CB7BD97E21189BB589B07446FD7600F3E45C7F5F77BE8848B87C6379901E642FB929EBEBCC589'
    const { r, s } = schnorr.toSignature(testString)
    expect(r.toString()).toEqual(
      '75846897846953601624291059212218325078635156806558587069341617825665068962185'
    )
    expect(s.toString()).toEqual(
      '84739055193381936333839076986853589798659574995325251877249779177312243991945'
    )
  })

  it('should sign messages correctly', () => {
    const privateKey = pairs[1].private
    const publicKey = secp256k1.keyFromPrivate(privateKey, 'hex').getPublic(false, 'hex')

    const tx = {
      version: 8,
      nonce: 8,
      toAddr: pairs[0].digest.slice(0, 40),
      pubKey: publicKey,
      amount: new BN('888', 10),
      gasPrice: new BN(8, 10),
      gasLimit: Long.fromNumber(88),
      code: '',
      data: ''
    }
    const tx2 = {
      version: 8,
      nonce: 8,
      toAddr: pairs[0].digest.slice(0, 40),
      pubKey: publicKey,
      amount: new BN('888', 10),
      gasPrice: new BN(8, 10),
      gasLimit: Long.fromNumber(88),
      code: 'test',
      data: 'test'
    }
    const tx3 = {
      version: 8,
      // nonce: 8,
      toAddr: '9bfec715a6bd658fcb62b0f8cc9bfa2ade71434a',
      // pubKey: publicKey,
      amount: new BN('888', 10),
      gasPrice: new BN(8, 10),
      gasLimit: Long.fromNumber(88),
      code: 'test',
      data: 'test'
    }

    const encodedTx = util.encodeTransactionProto(tx)
    const encodedTx2 = util.encodeTransactionProto(tx2)
    const encodedTx3 = util.encodeTransactionProto(tx3)

    const sig = schnorr.sign(
      encodedTx,
      Buffer.from(privateKey, 'hex'),
      Buffer.from(publicKey, 'hex')
    )
    const sig2 = schnorr.sign(
      encodedTx2,
      Buffer.from(privateKey, 'hex'),
      Buffer.from(publicKey, 'hex')
    )
    const res = schnorr.verify(encodedTx, sig, Buffer.from(publicKey, 'hex'))
    const res2 = schnorr.verify(encodedTx2, sig2, Buffer.from(publicKey, 'hex'))
    expect(encodedTx3.toString('hex')).toEqual(
      '080810001a149bfec715a6bd658fcb62b0f8cc9bfa2ade71434a22030a01002a120a100000000000000000000000000000037832120a100000000000000000000000000000000838584204746573744a0474657374'
    )
    expect(res).toBeTruthy()
    expect(res2).toBeTruthy()
  })

  it('should fail for bad signatures', () => {
    schnorrVectors.slice(0, 100).forEach(({ priv, k }) => {
      const pub = secp256k1.keyFromPrivate(priv, 'hex').getPublic(true, 'hex')
      const badPrivateKey = pairs[0].private

      const msg = util.randomBytes(128)

      let sig
      while (!sig) {
        sig = schnorr.trySign(
          Buffer.from(msg, 'hex'),
          new BN(k),
          new BN(Buffer.from(badPrivateKey, 'hex')),
          Buffer.from(pub, 'hex')
        )
      }

      const res = schnorr.verify(Buffer.from(msg, 'hex'), sig, Buffer.from(pub, 'hex'))
      expect(res).toBeFalsy()
    })
  })

  it('should match the C++ Schnorr implementation', () => {
    schnorrVectors.slice(0, 100).forEach(({
      msg, priv, pub, k, r, s
    }) => {
      let sig = null
      while (!sig) {
        sig = schnorr.trySign(
          Buffer.from(msg, 'hex'),
          new BN(k, 16),
          new BN(Buffer.from(priv, 'hex')),
          Buffer.from(pub, 'hex')
        )
      }

      const res = schnorr.verify(Buffer.from(msg, 'hex'), sig, Buffer.from(pub, 'hex'))

      expect(sig.r.eq(new BN(r, 16))).toBe(true)
      expect(sig.s.eq(new BN(s, 16))).toBe(true)
      expect(res).toBe(true)
    })
  })

  it('should not verify invalid public keys', () => {
    // invalid point for secp256k1
    const x = 'c70dc2f79d407ae3800098eea06c50cd80948d15d209a73df6f6c2b31bb247d4'
    const y = '07132a5e43e331ac0b4cbec1d7318add7d25533d0dbee5cd5ded9fe9ddb4248a'
    const pubKey = `04${x}${y}`

    // signature over the string 'test', for the invalid point (x,y) above
    const r = 'e5d98c86e8b85e4c41d47c4ed50219adad544c57c1f75408477c475abcc5e7bc'
    const s = 'de79ea11594f3dd3882fcc69a8413fa626a76df639a01c72dde9dc2d63c6d894'
    const signature = new Signature({ r, s })

    const res = () => schnorr.verify(Buffer.from('test'), signature, Buffer.from(pubKey, 'hex'))

    expect(res).toThrow('Invalid public key')
  })

  it('should return a valid 0x prefixed checksummed address', () => {
    checksummedStore.forEach(({ original: address, zil: expected }) => {
      const actual = util.toChecksumAddress(address)
      expect(actual).toEqual(expected)
      expect(actual.substr(0, 2)).toEqual('0x')
    })
  })

  it('should return true when a valid checksummed address is tested', () => {
    checksummedStore.forEach(({ zil: checksummed }) => {
      const actual = util.isValidChecksumAddress(checksummed)
      expect(actual).toBeTruthy()
    })
  })

  it('should return false when an invalid checksummed address is tested', () => {
    checksummedStore.forEach(({ eth: badlychecksummed }) => {
      const actual = util.isValidChecksumAddress(badlychecksummed)
      expect(actual).toBeFalsy()
    })
  })

  it('should compare bytes', () => {
    const testFalse = util.isEqual('aaa', 'bbb')
    expect(testFalse).toBeFalsy()
    const testFalse2 = util.isEqual('aaa', 'bbbb')
    expect(testFalse2).toBeFalsy()

    const testTrue = util.isEqual('aaa', 'aaa')
    expect(testTrue).toBeTruthy()
  })

  it('should test hex', () => {
    const testTrue = util.isHex('0x123')
    expect(testTrue).toBeTruthy()
  })

  it('should test hextoArray', () => {
    const tobe = new Uint8Array([0, 18, 52, 86, 120])
    const tobe0 = new Uint8Array([
      0,
      243,
      43,
      76,
      229,
      210,
      49,
      222,
      255,
      255,
      255,
      255,
      255,
      255,
      255,
      255,
      255,
      255,
      255
    ])
    const testArray = util.hexToByteArray('0x123456789')
    const testArray0 = util.hexToByteArray('0xf32b4ce5d231deffffffffffffffffffffff')
    const testEmpty = util.hexToIntArray()
    const testHi = util.hexToIntArray('0xĀ')
    expect(testHi).toEqual([48, 120, 1, 0, 0])
    expect(testEmpty).toEqual([])

    expect(testArray).toEqual(tobe)
    expect(testArray0).toEqual(tobe0)
  })

  it('should test intToByteArray', () => {
    const tobe = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 123])
    const testArray = util.intToByteArray(123, 16)
    const tobe0 = new Uint8Array([0, 0, 0, 0, 0, 0])
    const testArray0 = util.intToByteArray(0, 6)
    expect(testArray).toEqual(tobe)
    expect(testArray0).toEqual(tobe0)
  })
  it('should test intToHexArray', () => {
    const tobe = ['0', '0', '0', '0', '0', '0', '0', '1']
    const testArray = util.intToHexArray(1, 8)
    const tobe0 = ['0', '0', '0', '0']
    const testArray0 = util.intToHexArray(0, 4)
    expect(testArray).toEqual(tobe)
    expect(testArray0).toEqual(tobe0)
  })

  it('should test getAddressForContract', () => {
    const add = util.getAddressForContract({
      currentNonce: 0,
      address: '9bfec715a6bd658fcb62b0f8cc9bfa2ade71434a'
    })
    const add2 = util.getAddressForContract({
      currentNonce: 2,
      address: '9bfec715a6bd658fcb62b0f8cc9bfa2ade71434a'
    })
    expect(add).toEqual('50686b804c93c12e6a109353144c5e0078da9fe9')
    expect(add2).toEqual('5bbdc3987d61898e599408c3ea90b52932dfd0c2')
  })
  it('should sign transaction', () => {
    const privateKey = 'e19d05c5452598e24caad4a0d85a49146f7be089515c905ae6a19e8a578a6930'
    const pubKey = util.getPubKeyFromPrivateKey(privateKey)

    const txn = {
      version: 65537,
      nonce: 1,
      toAddr: '2E3C9B415B19AE4035503A06192A0FAD76E04243'.toLowerCase(),
      amount: Unit.Zil(1000).toQa(),
      gasPrice: Unit.Li(10000).toQa(),
      gasLimit: Long.fromNumber(250000000),
      pubKey,
      code: '',
      data: ''
    }

    const encodedTx = util.encodeTransactionProto(txn)

    txn.signature = util.sign(encodedTx, privateKey, pubKey)

    expect(txn.signature.length).toEqual(128)
  })
})

// TODO: schnorr verify test when failure
