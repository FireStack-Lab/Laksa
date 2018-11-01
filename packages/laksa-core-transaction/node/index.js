(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('laksa-utils')) :
  typeof define === 'function' && define.amd ? define(['exports', 'laksa-utils'], factory) :
  (factory((global.Laksa = {}),global.laksaUtils));
}(this, (function (exports,laksaUtils) { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  const encodeTransaction = tx => {
    const codeHex = Buffer.from(tx.code || '').toString('hex');
    const dataHex = Buffer.from(tx.data || '').toString('hex');
    const pubKeyHex = Buffer.from(tx.pubKey || '').toString();
    const encoded = laksaUtils.intToHexArray(tx.version, 64).join('') + laksaUtils.intToHexArray(tx.nonce || 0, 64).join('') + tx.to + pubKeyHex + tx.amount.toString('hex', 64) + laksaUtils.intToHexArray(tx.gasPrice, 64).join('') + laksaUtils.intToHexArray(tx.gasLimit, 64).join('') + laksaUtils.intToHexArray(tx.code && tx.code.length || 0, 8).join('') + // size of code
    codeHex + laksaUtils.intToHexArray(tx.data && tx.data.length || 0, 8).join('') + // size of data
    dataHex;
    return Buffer.from(encoded, 'hex');
  };

  const TxStatus = {
    Pending: Symbol('Pending'),
    Initialised: Symbol('Initialised'),
    Confirmed: Symbol('Confirmed'),
    Rejected: Symbol('Rejected')
  };
  class Transaction {
    constructor(params, status = TxStatus.Initialised) {
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


    static confirm(params) {
      return new Transaction(params, TxStatus.Confirmed);
    }

    static setMessenger(messenger) {
      Transaction.messenger = messenger;
    }
    /**
     * setStatus
     *
     * Escape hatch to imperatively set the state of the transaction.
     *
     * @param {TxStatus} status
     * @returns {undefined}
     */


    setStatus(status) {
      this.status = status;
      return this;
    } // parameters


    get bytes() {
      return encodeTransaction(this.txParams);
    }

    get txParams() {
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
    /**
     * isPending
     *
     * @returns {boolean}
     */


    isPending() {
      return this.status === TxStatus.Pending;
    }
    /**
     * isInitialised
     *
     * @returns {boolean}
     */


    isInitialised() {
      return this.status === TxStatus.Initialised;
    }
    /**
     * isConfirmed
     *
     * @returns {boolean}
     */


    isConfirmed() {
      return this.status === TxStatus.Confirmed;
    }
    /**
     * isRejected
     *
     * @returns {boolean}
     */


    isRejected() {
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


    confirm(txHash, maxTry = 10, poll = 3000) {
      this.status = TxStatus.Pending;
      return new Promise((resolve, reject) => {
        const token = setTimeout(() => {
          this.status = TxStatus.Rejected;
          reject(new Error('The transaction is taking unusually long to be confirmed. It may be lost.'));
        }, maxTry * poll * 2);

        const cancelTimeout = () => {
          clearTimeout(token);
        };

        this.trackTx(txHash, resolve, reject, {
          cancelTimeout,
          tried: 0,
          maxTry,
          poll
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


    map(fn) {
      const newParams = fn(this.txParams);
      this.setParams(newParams);
      return this;
    }

    setParams(params) {
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

    trackTx(txHash, resolve, reject, options) {
      const {
        cancelTimeout,
        tried,
        maxTry,
        poll
      } = options;

      if (this.isRejected()) {
        return;
      }

      function sleep(time) {
        return new Promise(res => setTimeout(res, time));
      } // TODO: regex validation for txHash so we don't get garbage


      const result = Transaction.messenger.send({
        method: 'GetTransaction',
        params: [txHash]
      });
      const attemped = tried + 1;

      if (attemped < (maxTry || 10)) {
        result.then(res => {
          if (res && res.error) {
            sleep(poll).then(() => this.trackTx(txHash, resolve, reject, _objectSpread({}, options, {
              tried: attemped
            })));
            return;
          }

          if (res && !res.error) {
            this.id = res.ID;
            this.receipt = res.receipt;
            const isRecipt = this.receipt && this.receipt.success;
            this.status = isRecipt ? TxStatus.Confirmed : TxStatus.Rejected;
            cancelTimeout();
            resolve(this);
          }
        }).catch(err => {
          cancelTimeout();
          this.status = TxStatus.Rejected;
          reject(err);
        });
      } else {
        cancelTimeout();
      }
    }

  }

  _defineProperty(Transaction, "messenger", void 0);

  exports.TxStatus = TxStatus;
  exports.Transaction = Transaction;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
