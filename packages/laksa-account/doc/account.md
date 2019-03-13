---
title: account
---

# account

<a name="Account"></a>

## Account
**Kind**: global class  

* [Account](#Account)
    * [new Account(messenger)](#new_Account_new)
    * _instance_
        * [.privateKey](#Account+privateKey) : <code>String</code>
        * [.publicKey](#Account+publicKey) : <code>String</code>
        * [.address](#Account+address) : <code>String</code>
        * [.balance](#Account+balance) : <code>String</code>
        * [.privateKey](#Account+privateKey) : <code>Number</code>
    * _static_
        * [.createAccount()](#Account.createAccount) ⇒ [<code>Account</code>](#Account)
        * [.importAccount(privateKey)](#Account.importAccount) ⇒ [<code>Account</code>](#Account)
        * [.encrypt(password, options)](#Account.encrypt) ⇒ [<code>Promise.&lt;Account&gt;</code>](#Account)
        * [.decrypt(password)](#Account.decrypt) ⇒ <code>Promise.&lt;Object&gt;</code>
        * [.toFile(password, options)](#Account.toFile) ⇒ <code>Promise.&lt;String&gt;</code>
        * [.fromFile(keyStore, password)](#Account.fromFile) ⇒ [<code>Promise.&lt;Account&gt;</code>](#Account)
        * [.signTransactionWithPassword(txnObj, password)](#Account.signTransactionWithPassword) ⇒ <code>Promise.&lt;Object&gt;</code>
        * [.getBalance()](#Account.getBalance) ⇒ <code>Promise.&lt;Object&gt;</code>
        * [.updateBalance()](#Account.updateBalance) ⇒ [<code>Promise.&lt;Account&gt;</code>](#Account)

<a name="new_Account_new"></a>

### new Account(messenger)
**Returns**: [<code>Account</code>](#Account) - {description}  

| Param | Type | Description |
| --- | --- | --- |
| messenger | <code>Messenger</code> | messsenger instance |

<a name="Account+privateKey"></a>

### account.privateKey : <code>String</code>
privateKey of Account

**Kind**: instance property of [<code>Account</code>](#Account)  
<a name="Account+publicKey"></a>

### account.publicKey : <code>String</code>
publicKey of Account

**Kind**: instance property of [<code>Account</code>](#Account)  
<a name="Account+address"></a>

### account.address : <code>String</code>
address of Account

**Kind**: instance property of [<code>Account</code>](#Account)  
<a name="Account+balance"></a>

### account.balance : <code>String</code>
balance of Account

**Kind**: instance property of [<code>Account</code>](#Account)  
<a name="Account+privateKey"></a>

### account.privateKey : <code>Number</code>
nonce of Account

**Kind**: instance property of [<code>Account</code>](#Account)  
<a name="Account.createAccount"></a>

### Account.createAccount() ⇒ [<code>Account</code>](#Account)
create new Account instance

**Kind**: static method of [<code>Account</code>](#Account)  
**Returns**: [<code>Account</code>](#Account) - - create a new Account  
<a name="Account.importAccount"></a>

### Account.importAccount(privateKey) ⇒ [<code>Account</code>](#Account)
import private key string and return an Account instance

**Kind**: static method of [<code>Account</code>](#Account)  
**Returns**: [<code>Account</code>](#Account) - - create a new Account  

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>String</code> | privatekey string |

<a name="Account.encrypt"></a>

### Account.encrypt(password, options) ⇒ [<code>Promise.&lt;Account&gt;</code>](#Account)
encrypt an account providing password and encrypt options

**Kind**: static method of [<code>Account</code>](#Account)  
**Returns**: [<code>Promise.&lt;Account&gt;</code>](#Account) - - encrypt an account  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>String</code> | password string |
| options | <code>Object</code> | options object for encryption |

<a name="Account.decrypt"></a>

### Account.decrypt(password) ⇒ <code>Promise.&lt;Object&gt;</code>
decrypt an account providing password

**Kind**: static method of [<code>Account</code>](#Account)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - account object  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>String</code> | password string |

<a name="Account.toFile"></a>

### Account.toFile(password, options) ⇒ <code>Promise.&lt;String&gt;</code>
encrypt an account and return as jsonString

**Kind**: static method of [<code>Account</code>](#Account)  
**Returns**: <code>Promise.&lt;String&gt;</code> - - encrypted jsonString  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>String</code> | password string |
| options | <code>Object</code> | encryption options |

<a name="Account.fromFile"></a>

### Account.fromFile(keyStore, password) ⇒ [<code>Promise.&lt;Account&gt;</code>](#Account)
Decrypt a keystore jsonString and generate an account.

**Kind**: static method of [<code>Account</code>](#Account)  
**Returns**: [<code>Promise.&lt;Account&gt;</code>](#Account) - - Account  

| Param | Type | Description |
| --- | --- | --- |
| keyStore | <code>String</code> | keystore jsonString |
| password | <code>String</code> | password string |

<a name="Account.signTransactionWithPassword"></a>

### Account.signTransactionWithPassword(txnObj, password) ⇒ <code>Promise.&lt;Object&gt;</code>
sign transaction object with password

**Kind**: static method of [<code>Account</code>](#Account)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - signed transaction object  

| Param | Type | Description |
| --- | --- | --- |
| txnObj | <code>Transaction</code> | transaction object |
| password | <code>String</code> | password string |

<a name="Account.getBalance"></a>

### Account.getBalance() ⇒ <code>Promise.&lt;Object&gt;</code>
get balance of current Account

**Kind**: static method of [<code>Account</code>](#Account)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - signed transaction object  
<a name="Account.updateBalance"></a>

### Account.updateBalance() ⇒ [<code>Promise.&lt;Account&gt;</code>](#Account)
update balance and nonce of current account

**Kind**: static method of [<code>Account</code>](#Account)  
**Returns**: [<code>Promise.&lt;Account&gt;</code>](#Account) - - return current Account instance  
