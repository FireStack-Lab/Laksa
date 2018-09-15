import * as bip from 'bip39'

export const getAvailableWordLists = () => {
  return bip.wordlists
}

export const generateMnemonic = (language) => {
  const languageToMnemonic = language || 'EN'
  const wordlists = getAvailableWordLists()

  if (Object.keys(wordlists).find(k => k === languageToMnemonic)) {
    return bip.generateMnemonic(undefined, undefined, wordlists[languageToMnemonic])
  }

  throw new Error(`Mnemonics language '${language}' is not supported.`)
}

export const mnemonicToSeed = (mnemonic, language, password) => {
  const languageToMnemonic = language || 'EN'
  const wordlists = getAvailableWordLists()

  if (bip.validateMnemonic(mnemonic, wordlists[languageToMnemonic])) {
    return bip.mnemonicToSeed(mnemonic, password)
  }
  throw new Error('Invalid Mnemonic.')
}

export const getWordsFromMnemonic = (mnemonic, language) => {
  const JPSeparator = '\u3000'
  const languageToMnemonic = language || 'EN'
  if (languageToMnemonic === 'JP' || languageToMnemonic === 'JA') {
    return mnemonic.split(JPSeparator)
  } else {
    return mnemonic.split(' ')
  }
}
