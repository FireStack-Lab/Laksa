"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _laksaUtils = require("laksa-utils");

var _methodObjects = _interopRequireDefault(require("./methodObjects"));

var _propertyObjects = _interopRequireDefault(require("./propertyObjects"));

var mapObjectToMethods = function mapObjectToMethods(main) {
  _methodObjects.default.map(function (data) {
    var zilMethod = new _laksaUtils.Method(data);
    zilMethod.setMessanger(main.messanger);
    zilMethod.assignToObject(main);
    return false;
  });
};

var mapPropertyToObjects = function mapPropertyToObjects(main) {
  _propertyObjects.default.map(function (data) {
    var zilProperty = new _laksaUtils.Property(data);
    zilProperty.setMessanger(main.messanger);
    zilProperty.assignToObject(main);
    return false;
  });
};

var Zil =
/*#__PURE__*/
function () {
  function Zil(Webz) {
    (0, _classCallCheck2.default)(this, Zil);
    (0, _defineProperty2.default)(this, "generateWallet", function (walletName) {
      if (!(0, _laksaUtils.isString)(walletName)) throw Error('walletName has to be String');
      var walletPrivateKey = (0, _laksaUtils.generatePrivateKey)();
      var walletPublicKey = walletPrivateKey ? (0, _laksaUtils.getPubKeyFromPrivateKey)(walletPrivateKey) : null;
      var walletAddress = walletPrivateKey ? (0, _laksaUtils.getAddressFromPrivateKey)(walletPrivateKey) : null;
      var Wallet = {
        walletName: walletName,
        walletPublicKey: walletPublicKey,
        walletPrivateKey: walletPrivateKey,
        walletAddress: walletAddress
      };
      return Wallet;
    });
    this.messanger = Webz.messanger;
    this.config = Webz.config;
    mapObjectToMethods(this);
    mapPropertyToObjects(this);
  }
  /**
   * generate Key pairs and use WalletName as input param to identify
   * @param  {[type]} walletName [description]
   * @return {[type]}            [description]
   */


  (0, _createClass2.default)(Zil, [{
    key: "defaultBlock",
    get: function get() {
      return this.config.defaultBlock;
    },
    set: function set(block) {
      this.config.defaultBlock = block;
      return block;
    }
  }, {
    key: "defaultAccount",
    get: function get() {
      return this.config.defaultAccount;
    },
    set: function set(account) {
      this.config.defaultAccount = account;
      return account;
    }
  }]);
  return Zil;
}();

var _default = Zil;
exports.default = _default;
module.exports = exports.default;