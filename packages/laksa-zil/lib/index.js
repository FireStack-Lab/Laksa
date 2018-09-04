"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _laksaUtils = require("laksa-utils");

var _methodObjects = _interopRequireDefault(require("./methodObjects"));

var _propertyObjects = _interopRequireDefault(require("./propertyObjects"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    _classCallCheck(this, Zil);

    _defineProperty(this, "generateWallet", function (walletName) {
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


  _createClass(Zil, [{
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