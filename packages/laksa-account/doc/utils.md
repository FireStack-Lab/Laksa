---
title: utils
---

# utils

## Functions

<dl>
<dt><a href="#generateAccountObject">generateAccountObject(privateKey)</a> ⇒ <code>Object</code></dt>
<dd><p>generate Account object</p>
</dd>
<dt><a href="#createAccount">createAccount()</a> ⇒ <code>Object</code></dt>
<dd><p>create an account</p>
</dd>
<dt><a href="#importAccount">importAccount(privateKey)</a> ⇒ <code>Object</code></dt>
<dd><p>import privatekey and generate an account object</p>
</dd>
<dt><a href="#encryptAccount">encryptAccount(accountObject, password, options)</a> ⇒ <code>Object</code></dt>
<dd><p>encrypt Account</p>
</dd>
<dt><a href="#decryptAccount">decryptAccount(accountObject, password)</a> ⇒ <code>Object</code></dt>
<dd><p>decrypt an account object</p>
</dd>
<dt><a href="#signTransaction">signTransaction(privateKey, txnDetails)</a> ⇒ <code>Transaction</code></dt>
<dd><p>sign a transaction providing privatekey and transaction object</p>
</dd>
</dl>

<a name="generateAccountObject"></a>

## generateAccountObject(privateKey) ⇒ <code>Object</code>
generate Account object

**Kind**: global function  
**Returns**: <code>Object</code> - Account object  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>String</code> | privateKey String |

<a name="createAccount"></a>

## createAccount() ⇒ <code>Object</code>
create an account

**Kind**: global function  
**Returns**: <code>Object</code> - account object  
<a name="importAccount"></a>

## importAccount(privateKey) ⇒ <code>Object</code>
import privatekey and generate an account object

**Kind**: global function  
**Returns**: <code>Object</code> - account object  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>String</code> | privatekey string |

<a name="encryptAccount"></a>

## encryptAccount(accountObject, password, options) ⇒ <code>Object</code>
encrypt Account

**Kind**: global function  
**Returns**: <code>Object</code> - encrypted account object  

| Param | Type | Description |
| --- | --- | --- |
| accountObject | <code>Account</code> | account instance |
| password | <code>String</code> | password string |
| options | <code>Object</code> | encryption options |

<a name="decryptAccount"></a>

## decryptAccount(accountObject, password) ⇒ <code>Object</code>
decrypt an account object

**Kind**: global function  
**Returns**: <code>Object</code> - decrypted account object  

| Param | Type | Description |
| --- | --- | --- |
| accountObject | <code>Account</code> | encrypted account object |
| password | <code>String</code> | password string |

<a name="signTransaction"></a>

## signTransaction(privateKey, txnDetails) ⇒ <code>Transaction</code>
sign a transaction providing privatekey and transaction object

**Kind**: global function  
**Returns**: <code>Transaction</code> - signed transaction  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>String</code> | privatekey String |
| txnDetails | <code>Transaction</code> | transaction object |

