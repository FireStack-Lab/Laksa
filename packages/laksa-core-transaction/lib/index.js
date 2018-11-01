'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es6.regexp.to-string');
var laksaUtils = require('laksa-utils');
var _objectSpread = _interopDefault(require('@babel/runtime/helpers/objectSpread'));
require('core-js/modules/es6.promise');
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
require('core-js/modules/es7.symbol.async-iterator');
require('core-js/modules/es6.symbol');

var encodeTransaction = function encodeTransaction(tx) {
  var codeHex = Buffer.from(tx.code || '').toString('hex');
  var dataHex = Buffer.from(tx.data || '').toString('hex');
  var pubKeyHex = Buffer.from(tx.pubKey || '').toString();
  var encoded = laksaUtils.intToHexArray(tx.version, 64).join('') + laksaUtils.intToHexArray(tx.nonce || 0, 64).join('') + tx.to + pubKeyHex + tx.amount.toString('hex', 64) + laksaUtils.intToHexArray(tx.gasPrice, 64).join('') + laksaUtils.intToHexArray(tx.gasLimit, 64).join('') + laksaUtils.intToHexArray(tx.code && tx.code.length || 0, 8).join('') + // size of code
  codeHex + laksaUtils.intToHexArray(tx.data && tx.data.length || 0, 8).join('') + // size of data
  dataHex;
  return Buffer.from(encoded, 'hex');
};

var TxStatus = {
  Pending: Symbol('Pending'),
  Initialised: Symbol('Initialised'),
  Confirmed: Symbol('Confirmed'),
  Rejected: Symbol('Rejected')
};
var Transaction =
/*#__PURE__*/
function () {
  function Transaction(params) {
    var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : TxStatus.Initialised;

    _classCallCheck(this, Transaction);

    _defineProperty(this, "version", void 0);

    _defineProperty(this, "to", void 0);

    _defineProperty(this, "amount", void 0);

    _defineProperty(this, "gasPrice", void 0);

    _defineProperty(this, "gasLimit", void 0);

    _defineProperty(this, "id", void 0);

    _defineProperty(this, "code", void 0);

    _defineProperty(this, "data", void 0);

    _defineProperty(this, "receipt", void 0);

    _defineProperty(this, "nonce", void 0);

    _defineProperty(this, "pubKey", void 0);

    _defineProperty(this, "signature", void 0);

    _defineProperty(this, "status", void 0);

    // params
    this.version = params.version;
    this.id = params.id;
    this.to = params.to;
    this.nonce = params.nonce;
    this.pubKey = params.pubKey;
    this.amount = params.amount;
    this.code = params.code;
    this.data = params.data;
    this.signature = params.signature;
    this.gasPrice = params.gasPrice;
    this.gasLimit = params.gasLimit;
    this.receipt = params.receipt; // status

    this.status = status;
  }
  /**
   * confirmed
   *
   * constructs an already-confirmed transaction.
   *
   * @static
   * @param {BaseTx} params
   */


  _createClass(Transaction, [{
    key: "setStatus",

    /**
     * setStatus
     *
     * Escape hatch to imperatively set the state of the transaction.
     *
     * @param {TxStatus} status
     * @returns {undefined}
     */
    value: function setStatus(status) {
      this.status = status;
      return this;
    } // parameters

  }, {
    key: "isPending",

    /**
     * isPending
     *
     * @returns {boolean}
     */
    value: function isPending() {
      return this.status === TxStatus.Pending;
    }
    /**
     * isInitialised
     *
     * @returns {boolean}
     */

  }, {
    key: "isInitialised",
    value: function isInitialised() {
      return this.status === TxStatus.Initialised;
    }
    /**
     * isConfirmed
     *
     * @returns {boolean}
     */

  }, {
    key: "isConfirmed",
    value: function isConfirmed() {
      return this.status === TxStatus.Confirmed;
    }
    /**
     * isRejected
     *
     * @returns {boolean}
     */

  }, {
    key: "isRejected",
    value: function isRejected() {
      return this.status === TxStatus.Rejected;
    }
    /**
     * confirmReceipt
     *
     * Similar to the Promise API. This sets the Transaction instance to a state
     * of pending. Calling this function kicks off a passive loop that polls the
     * lookup node for confirmation on the txHash.
     *
     * This is a low-level method that you should generally not have to use
     * directly.
     *
     * @param {string} txHash
     * @param {number} timeout
     * @returns {Promise<Transaction>}
     */

  }, {
    key: "confirm",
    value: function confirm(txHash) {
      var _this = this;

      var maxTry = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
      var poll = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3000;
      this.status = TxStatus.Pending;
      return new Promise(function (resolve, reject) {
        var token = setTimeout(function () {
          _this.status = TxStatus.Rejected;
          reject(new Error('The transaction is taking unusually long to be confirmed. It may be lost.'));
        }, maxTry * poll * 2);

        var cancelTimeout = function cancelTimeout() {
          clearTimeout(token);
        };

        _this.trackTx(txHash, resolve, reject, {
          cancelTimeout: cancelTimeout,
          tried: 0,
          maxTry: maxTry,
          poll: poll
        });
      });
    }
    /**
     * map
     *
     * maps over the transaction, allowing for manipulation.
     *
     * @param {(prev: TxParams) => TxParams} fn - mapper
     * @returns {Transaction}
     */

  }, {
    key: "map",
    value: function map(fn) {
      var newParams = fn(this.txParams);
      this.setParams(newParams);
      return this;
    }
  }, {
    key: "setParams",
    value: function setParams(params) {
      this.version = params.version;
      this.id = params.id;
      this.to = params.to;
      this.nonce = params.nonce;
      this.pubKey = params.pubKey;
      this.amount = params.amount;
      this.code = params.code;
      this.data = params.data;
      this.signature = params.signature;
      this.gasPrice = params.gasPrice;
      this.gasLimit = params.gasLimit;
      this.receipt = params.receipt;
    }
  }, {
    key: "trackTx",
    value: function trackTx(txHash, resolve, reject, options) {
      var _this2 = this;

      var cancelTimeout = options.cancelTimeout,
          tried = options.tried,
          maxTry = options.maxTry,
          poll = options.poll;

      if (this.isRejected()) {
        return;
      }

      function sleep(time) {
        return new Promise(function (res) {
          return setTimeout(res, time);
        });
      } // TODO: regex validation for txHash so we don't get garbage


      var result = Transaction.messenger.send({
        method: 'GetTransaction',
        params: [txHash]
      });
      var attemped = tried + 1;

      if (attemped < (maxTry || 10)) {
        result.then(function (res) {
          if (res && res.error) {
            sleep(poll).then(function () {
              return _this2.trackTx(txHash, resolve, reject, _objectSpread({}, options, {
                tried: attemped
              }));
            });
            return;
          }

          if (res && !res.error) {
            _this2.id = res.ID;
            _this2.receipt = res.receipt;
            var isRecipt = _this2.receipt && _this2.receipt.success;
            _this2.status = isRecipt ? TxStatus.Confirmed : TxStatus.Rejected;
            cancelTimeout();
            resolve(_this2);
          }
        }).catch(function (err) {
          cancelTimeout();
          _this2.status = TxStatus.Rejected;
          reject(err);
        });
      } else {
        cancelTimeout();
      }
    }
  }, {
    key: "bytes",
    get: function get() {
      return encodeTransaction(this.txParams);
    }
  }, {
    key: "txParams",
    get: function get() {
      return {
        version: 0,
        id: this.id,
        to: this.to,
        nonce: this.nonce,
        pubKey: this.pubKey,
        amount: this.amount,
        gasPrice: this.gasPrice,
        gasLimit: this.gasLimit,
        code: this.code,
        data: this.data,
        signature: this.signature,
        receipt: this.receipt
      };
    }
  }], [{
    key: "confirm",
    value: function confirm(params) {
      return new Transaction(params, TxStatus.Confirmed);
    }
  }, {
    key: "setMessenger",
    value: function setMessenger(messenger) {
      Transaction.messenger = messenger;
    }
  }]);

  return Transaction;
}();

_defineProperty(Transaction, "messenger", void 0);

exports.TxStatus = TxStatus;
exports.Transaction = Transaction;
