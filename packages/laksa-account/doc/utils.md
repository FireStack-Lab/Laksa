---
title: utils
---

# utils

## Functions

<dl>
<dt><a href="#generateAccountObject">generateAccountObject(privateKey)</a> ⇒ <code>Account</code></dt>
<dd><p>gernerate account object</p>
</dd>
<dt><a href="#createAccount">createAccount()</a> ⇒ <code>Account</code></dt>
<dd></dd>
<dt><a href="#importAccount">importAccount(privateKey)</a> ⇒ <code>Account</code></dt>
<dd></dd>
<dt><a href="#encryptAccount">encryptAccount(accountObject, password, options)</a> ⇒ <code>Account</code></dt>
<dd></dd>
<dt><a href="#decryptAccount">decryptAccount(accountObject, password)</a> ⇒ <code>Account</code></dt>
<dd></dd>
<dt><a href="#signTransaction">signTransaction(privateKey, transactionObject)</a> ⇒ <code>Transaction</code></dt>
<dd></dd>
</dl>

<a name="generateAccountObject"></a>

## generateAccountObject(privateKey) ⇒ <code>Account</code>
gernerate account object

**Kind**: global function  
**Returns**: <code>Account</code> - {Account object}  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | {description} |

<a name="createAccount"></a>

## createAccount() ⇒ <code>Account</code>
**Kind**: global function  
**Returns**: <code>Account</code> - {account object}  
<a name="importAccount"></a>

## importAccount(privateKey) ⇒ <code>Account</code>
**Kind**: global function  
**Returns**: <code>Account</code> - {account object}  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>PrivateKey</code> | {privatekey string} |

<a name="encryptAccount"></a>

## encryptAccount(accountObject, password, options) ⇒ <code>Account</code>
**Kind**: global function  
**Returns**: <code>Account</code> - {encrypted account object}  

| Param | Type | Description |
| --- | --- | --- |
| accountObject | <code>Account</code> | {account object} |
| password | <code>string</code> | {password string} |
| options | <code>object</code> | {encryption options} |

<a name="decryptAccount"></a>

## decryptAccount(accountObject, password) ⇒ <code>Account</code>
**Kind**: global function  
**Returns**: <code>Account</code> - {decrypted account object}  

| Param | Type | Description |
| --- | --- | --- |
| accountObject | <code>Account</code> | {encrypted account object} |
| password | <code>string</code> | {password string} |

<a name="signTransaction"></a>

## signTransaction(privateKey, transactionObject) ⇒ <code>Transaction</code>
**Kind**: global function  
**Returns**: <code>Transaction</code> - {signed transaction}  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>PrivateKey</code> | {privatekey} |
| transactionObject | <code>Transaction</code> | {transaction object} |

