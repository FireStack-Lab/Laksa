'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es6.regexp.split');
require('core-js/modules/web.dom.iterable');
require('core-js/modules/es6.array.iterator');
require('core-js/modules/es6.object.keys');
require('core-js/modules/es6.array.find');
var bip = require('bip39');
require('core-js/modules/es6.regexp.to-string');
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
var npmhdkeyobject = _interopDefault(require('hdkey'));
var _possibleConstructorReturn = _interopDefault(require('@babel/runtime/helpers/possibleConstructorReturn'));
var _getPrototypeOf = _interopDefault(require('@babel/runtime/helpers/getPrototypeOf'));
var _inherits = _interopDefault(require('@babel/runtime/helpers/inherits'));
var _assertThisInitialized = _interopDefault(require('@babel/runtime/helpers/assertThisInitialized'));
var laksaWallet = require('laksa-wallet');

var getAvailableWordLists = function getAvailableWordLists() {
  return bip.wordlists;
};
var generateMnemonic = function generateMnemonic(language) {
  var languageToMnemonic = language || 'EN';
  var wordlists = getAvailableWordLists();

  if (Object.keys(wordlists).find(function (k) {
    return k === languageToMnemonic;
  })) {
    return bip.generateMnemonic(undefined, undefined, wordlists[languageToMnemonic]);
  }

  throw new Error("Mnemonics language '".concat(language, "' is not supported."));
};
var mnemonicToSeed = function mnemonicToSeed(mnemonic, language, password) {
  var languageToMnemonic = language || 'EN';
  var wordlists = getAvailableWordLists();

  if (bip.validateMnemonic(mnemonic, wordlists[languageToMnemonic])) {
    return bip.mnemonicToSeed(mnemonic, password);
  }

  throw new Error('Invalid Mnemonic.');
};

var HDKey = function HDKey() {
  var _this = this;

  _classCallCheck(this, HDKey);

  _defineProperty(this, "fromHDKey", function (npmhdkey) {
    var ret = new HDKey();
    ret.npmhdkey = npmhdkey;
    return ret;
  });

  _defineProperty(this, "fromMasterSeed", function (seedBuffer) {
    return _this.fromHDKey(npmhdkeyobject.fromMasterSeed(seedBuffer));
  });

  _defineProperty(this, "npmhdkey", void 0);

  _defineProperty(this, "derivePath", function (path) {
    return _this.fromHDKey(_this.npmhdkey.derive(path));
  });

  _defineProperty(this, "deriveChild", function (index) {
    return _this.fromHDKey(_this.npmhdkey.deriveChild(index));
  });

  _defineProperty(this, "getPrivateKey", function () {
    return _this.npmhdkey._privateKey;
  });

  _defineProperty(this, "getPrivateKeyString", function () {
    return _this.npmhdkey._privateKey.toString('hex');
  });
};

var HDWallet =
/*#__PURE__*/
function (_Wallet) {
  _inherits(HDWallet, _Wallet);

  function HDWallet(props, mnemonics, language) {
    var _this;

    _classCallCheck(this, HDWallet);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HDWallet).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "network", {
      HDCoinValue: 1
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "HDRootKey", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "getCurrentNetworkPathString", function () {
      return "m/44'/".concat(_this.network.HDCoinValue, "'/0'/0");
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "createHDRoot", function () {
      var hdkey = _this.hdkey.fromMasterSeed(_this.seed);

      var HDRootKey = hdkey.derivePath(_this.getCurrentNetworkPathString());
      _this.HDRootKey = HDRootKey;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "createRootAccount", function () {
      if (_this.HDRootKey !== undefined) {
        var privateKey = _this.HDRootKey.getPrivateKeyString(); // from laksa-wallet class


        _this.importAccountFromPrivateKey(privateKey);
      }
    });

    _this.mnemonicslang = language || 'EN';
    _this.mnemonics = mnemonics || generateMnemonic(_this.mnemonicslang);
    _this.seed = mnemonicToSeed(_this.mnemonics, _this.mnemonicslang);
    _this.hdkey = new HDKey();
    return _this;
  }

  return HDWallet;
}(laksaWallet.Wallet);

module.exports = HDWallet;
