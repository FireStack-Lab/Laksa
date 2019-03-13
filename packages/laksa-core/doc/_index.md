---
title: _index
---

# _index

<a name="Laksa"></a>

## Laksa
**Kind**: global class  

* [Laksa](#Laksa)
    * [new Laksa(url)](#new_Laksa_new)
    * _instance_
        * [.setProvider(provider)](#Laksa+setProvider) ⇒ <code>Boolean</code>
    * _static_
        * [.version()](#Laksa.version) ⇒ <code>String</code>
        * [.isConnected()](#Laksa.isConnected) ⇒ <code>any</code>
        * [.connection(callback)](#Laksa.connection) ⇒ <code>Promise.&lt;any&gt;</code>
        * [.getProvider()](#Laksa.getProvider) ⇒ <code>Object</code>
        * [.getLibraryVersion()](#Laksa.getLibraryVersion) ⇒ <code>String</code>
        * [.getDefaultAccount()](#Laksa.getDefaultAccount) ⇒ <code>Account</code>
        * [.setNodeProvider(providerObject)](#Laksa.setNodeProvider)
        * [.setScillaProvider(providerObject)](#Laksa.setScillaProvider)
        * [.register(moduleObject)](#Laksa.register)
        * [.getNetworkSetting()](#Laksa.getNetworkSetting) ⇒ <code>Object</code>
        * [.setNetworkID(networkId)](#Laksa.setNetworkID) ⇒ <code>Object</code>

<a name="new_Laksa_new"></a>

### new Laksa(url)
**Returns**: [<code>Laksa</code>](#Laksa) - - Laksa instance  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | Url string to initializing Laksa |

<a name="Laksa+setProvider"></a>

### laksa.setProvider(provider) ⇒ <code>Boolean</code>
provider setter

**Kind**: instance method of [<code>Laksa</code>](#Laksa)  
**Returns**: <code>Boolean</code> - - if provider is set, return true  

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>HttpProvider</code> | HttpProvider |

<a name="Laksa.version"></a>

### Laksa.version() ⇒ <code>String</code>
get library version

**Kind**: static method of [<code>Laksa</code>](#Laksa)  
**Returns**: <code>String</code> - - library version  
<a name="Laksa.isConnected"></a>

### Laksa.isConnected() ⇒ <code>any</code>
check connection status

**Kind**: static method of [<code>Laksa</code>](#Laksa)  
**Returns**: <code>any</code> - - connection status  
<a name="Laksa.connection"></a>

### Laksa.connection(callback) ⇒ <code>Promise.&lt;any&gt;</code>
check connection status

**Kind**: static method of [<code>Laksa</code>](#Laksa)  
**Returns**: <code>Promise.&lt;any&gt;</code> - - connection status  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | callback function |

<a name="Laksa.getProvider"></a>

### Laksa.getProvider() ⇒ <code>Object</code>
provider getter

**Kind**: static method of [<code>Laksa</code>](#Laksa)  
**Returns**: <code>Object</code> - - currentProvider with nodeProvider and scillaProvider  
<a name="Laksa.getLibraryVersion"></a>

### Laksa.getLibraryVersion() ⇒ <code>String</code>
version getter

**Kind**: static method of [<code>Laksa</code>](#Laksa)  
**Returns**: <code>String</code> - - version string  
<a name="Laksa.getDefaultAccount"></a>

### Laksa.getDefaultAccount() ⇒ <code>Account</code>
get wallet's default Account or config default Account

**Kind**: static method of [<code>Laksa</code>](#Laksa)  
**Returns**: <code>Account</code> - - Account instance  
<a name="Laksa.setNodeProvider"></a>

### Laksa.setNodeProvider(providerObject)
set provider to nodeProvider

**Kind**: static method of [<code>Laksa</code>](#Laksa)  

| Param | Type | Description |
| --- | --- | --- |
| providerObject | <code>Object</code> |  |
| providerObject.url | <code>String</code> | url String |
| providerObject.options | <code>Object</code> | provider options |

<a name="Laksa.setScillaProvider"></a>

### Laksa.setScillaProvider(providerObject)
set provider to scillaProvider

**Kind**: static method of [<code>Laksa</code>](#Laksa)  

| Param | Type | Description |
| --- | --- | --- |
| providerObject | <code>Object</code> |  |
| providerObject.url | <code>String</code> | url String |
| providerObject.options | <code>Object</code> | provider options |

<a name="Laksa.register"></a>

### Laksa.register(moduleObject)
register a Module attach to Laksa

**Kind**: static method of [<code>Laksa</code>](#Laksa)  

| Param | Type | Description |
| --- | --- | --- |
| moduleObject | <code>Object</code> |  |
| moduleObject.name | <code>String</code> | Module name |
| moduleObject.pkg | <code>any</code> | Module instance |

<a name="Laksa.getNetworkSetting"></a>

### Laksa.getNetworkSetting() ⇒ <code>Object</code>
get config's network settings

**Kind**: static method of [<code>Laksa</code>](#Laksa)  
<a name="Laksa.setNetworkID"></a>

### Laksa.setNetworkID(networkId) ⇒ <code>Object</code>
set network Id to messenger

**Kind**: static method of [<code>Laksa</code>](#Laksa)  

| Param | Type |
| --- | --- |
| networkId | <code>String</code> | 

