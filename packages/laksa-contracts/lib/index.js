'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _typeof = _interopDefault(require('@babel/runtime/helpers/typeof'));
require('core-js/modules/es6.object.assign');
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
var _objectSpread = _interopDefault(require('@babel/runtime/helpers/objectSpread'));
require('regenerator-runtime/runtime');
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
var laksaCoreContract = require('laksa-core-contract');

var Contracts =
/*#__PURE__*/
function () {
  function Contracts(messenger, signer) {
    _classCallCheck(this, Contracts);

    _defineProperty(this, "storage", {
      waitForSign: [],
      deployed: []
      /**
       * @function {at}
       * @param  {string} address    {description}
       * @param  {ABI} abi        {description}
       * @param  {string} code       {scilla code string}
       * @param  {Array<object>} initParams {description}
       * @param  {Symbol} state      {description}
       * @return {Contract} {description}
       */

    });

    this.messenger = messenger;
    this.signer = signer;
  }

  _createClass(Contracts, [{
    key: "at",
    value: function at(address, abi, code, initParams, state) {
      return new laksaCoreContract.Contract(this, abi, address, code, initParams, state);
    }
    /**
     * @function {new}
     * @param  {string} code       {scilla code string}
     * @param  {Array<object>} initParams {array of init params}
     * @param  {object} options    {options that set for new contract}
     * @return {Contract} {contract that created}
     */

  }, {
    key: "new",
    value: function () {
      var _new2 = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(code, initParams, options) {
        var contract, result;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                contract = new laksaCoreContract.Contract(this);
                _context.next = 3;
                return contract // decode ABI from code first
                .decodeABI({
                  code: code
                }) // we set the init params to decoded ABI
                .then(function (decoded) {
                  return decoded.setInitParamsValues(decoded.abi.getInitParams(), initParams);
                }) // we get the current block number from node, and set it to params
                .then(function (inited) {
                  return inited.setBlockNumber(options ? options.blockNumber : undefined);
                }) // we have a contract json now
                .then(function (setted) {
                  return setted.generateNewContractJson();
                }) // but we have to give it a test
                .then(function (ready) {
                  return ready.testCall(options ? options.gasLimit : 2000);
                }) // now we change the status to wait for sign
                .then(function (state) {
                  if (state.contractStatus === laksaCoreContract.ContractStatus.waitForSign) {
                    return state;
                  }
                });

              case 3:
                result = _context.sent;
                // now store it to contracts-storage array
                this.storage.waitForSign.push(_objectSpread({
                  createTime: new Date()
                }, result));
                return _context.abrupt("return", result);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function _new(_x, _x2, _x3) {
        return _new2.apply(this, arguments);
      };
    }()
    /**
     * @function {deploy}
     * @param  {Contract} contract {contract object}
     * @param  {Int} gasLimit {gasLimit that set for contract}
     * @param  {Int} gasPrice {gasPrice that set for contract}
     * @param  {Account} signer   {account that for sign}
     * @param  {string} password {password for signer if encrypted}
     * @return {Contract} {contract that deployed}
     */

  }, {
    key: "deploy",
    value: function () {
      var _deploy = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2(_ref, _ref2) {
        var contract, gasLimit, gasPrice, signer, password, _ref3, nonce, txnJson, txnDetail, signedContract, result;

        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                contract = _ref.contract, gasLimit = _ref.gasLimit, gasPrice = _ref.gasPrice;
                signer = _ref2.signer, password = _ref2.password;
                _context2.next = 4;
                return this.messenger.send({
                  method: 'GetBalance',
                  params: [signer.address]
                });

              case 4:
                _ref3 = _context2.sent;
                nonce = _ref3.nonce;
                // to create a txn Json
                txnJson = {
                  // version number for deployment
                  version: 0,
                  // increase the nonce
                  nonce: nonce + 1,
                  // set to 40 bit length zeros
                  to: '0000000000000000000000000000000000000000',
                  // deploying a new contract, amount will be zero according to zilliqa
                  amount: laksaCoreContract.toBN(0),
                  // gasPrice will be forced to transform to BN first in the future
                  gasPrice: laksaCoreContract.toBN(gasPrice).toNumber(),
                  // gasLimit will be forced to transform to BN first in the future
                  gasLimit: laksaCoreContract.toBN(gasLimit).toNumber() // generate a new txn json with contract json

                };
                txnDetail = Object.assign({}, contract.contractJson, txnJson); // check if the signer is encrypted

                if (!(_typeof(signer.privateKey) !== 'symbol')) {
                  _context2.next = 12;
                  break;
                }

                _context2.t0 = signer.signTransaction(txnDetail);
                _context2.next = 15;
                break;

              case 12:
                _context2.next = 14;
                return signer.signTransactionWithPassword(txnDetail, password);

              case 14:
                _context2.t0 = _context2.sent;

              case 15:
                signedContract = _context2.t0;

                if (!signedContract.signature) {
                  _context2.next = 22;
                  break;
                }

                _context2.next = 19;
                return contract.deploy(signedContract);

              case 19:
                result = _context2.sent;
                // after that we save it to storage
                this.storage.deployed.push(_objectSpread({
                  deployedTime: new Date()
                }, result));
                return _context2.abrupt("return", result);

              case 22:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function deploy(_x4, _x5) {
        return _deploy.apply(this, arguments);
      };
    }()
  }]);

  return Contracts;
}();

module.exports = Contracts;
