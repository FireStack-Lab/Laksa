---
title: messenger
---

# messenger

## Classes

<dl>
<dt><a href="#Messenger">Messenger</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#sendServer">sendServer(endpoint, data)</a> ⇒ <code>Object</code></dt>
<dd><p>send data to scilla runner endpoint</p>
</dd>
</dl>

<a name="Messenger"></a>

## Messenger
**Kind**: global class  

* [Messenger](#Messenger)
    * [new Messenger(provider, config)](#new_Messenger_new)
    * _instance_
        * [.provider](#Messenger+provider) : <code>Provider</code>
        * [.scillaProvider](#Messenger+scillaProvider) : <code>Provider</code>
        * [.config](#Messenger+config) : <code>Object</code>
        * [.Network_ID](#Messenger+Network_ID) : <code>Number</code>
        * [.JsonRpc](#Messenger+JsonRpc) : <code>JsonRpc</code>
        * [.send(method, params)](#Messenger+send) ⇒ <code>Object</code>
    * _static_
        * [.setProvider(provider)](#Messenger.setProvider)
        * [.setScillaProvider(provider)](#Messenger.setScillaProvider)
        * [.providerCheck()](#Messenger.providerCheck) ⇒ <code>Error</code> \| <code>null</code>
        * [.setReqMiddleware(middleware, method)](#Messenger.setReqMiddleware)
        * [.setResMiddleware(middleware, method)](#Messenger.setResMiddleware)
        * [.{function name}(version, networkId)](#Messenger.{function name})
        * [.setNetworkID(id)](#Messenger.setNetworkID)

<a name="new_Messenger_new"></a>

### new Messenger(provider, config)
Messenger instance

**Returns**: [<code>Messenger</code>](#Messenger) - Messenger instance  

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>HttpProvider</code> | HttpProvider |
| config | <code>Object</code> | config object |

<a name="Messenger+provider"></a>

### messenger.provider : <code>Provider</code>
Provider instance

**Kind**: instance property of [<code>Messenger</code>](#Messenger)  
<a name="Messenger+scillaProvider"></a>

### messenger.scillaProvider : <code>Provider</code>
scilla Provider instance

**Kind**: instance property of [<code>Messenger</code>](#Messenger)  
<a name="Messenger+config"></a>

### messenger.config : <code>Object</code>
Messenger config

**Kind**: instance property of [<code>Messenger</code>](#Messenger)  
<a name="Messenger+Network_ID"></a>

### messenger.Network\_ID : <code>Number</code>
Network ID for current provider

**Kind**: instance property of [<code>Messenger</code>](#Messenger)  
<a name="Messenger+JsonRpc"></a>

### messenger.JsonRpc : <code>JsonRpc</code>
JsonRpc instance

**Kind**: instance property of [<code>Messenger</code>](#Messenger)  
<a name="Messenger+send"></a>

### messenger.send(method, params) ⇒ <code>Object</code>
**Kind**: instance method of [<code>Messenger</code>](#Messenger)  
**Returns**: <code>Object</code> - RPC result  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>String</code> | RPC method |
| params | <code>Object</code> | RPC method params |

<a name="Messenger.setProvider"></a>

### Messenger.setProvider(provider)
provider setter

**Kind**: static method of [<code>Messenger</code>](#Messenger)  

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | provider instance |

<a name="Messenger.setScillaProvider"></a>

### Messenger.setScillaProvider(provider)
scilla provider setter

**Kind**: static method of [<code>Messenger</code>](#Messenger)  

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | provider instance |

<a name="Messenger.providerCheck"></a>

### Messenger.providerCheck() ⇒ <code>Error</code> \| <code>null</code>
provider checker

**Kind**: static method of [<code>Messenger</code>](#Messenger)  
**Returns**: <code>Error</code> \| <code>null</code> - provider validator  
<a name="Messenger.setReqMiddleware"></a>

### Messenger.setReqMiddleware(middleware, method)
set request middleware

**Kind**: static method of [<code>Messenger</code>](#Messenger)  

| Param | Type | Description |
| --- | --- | --- |
| middleware | <code>any</code> | middle ware for req |
| method | <code>String</code> | method name |

<a name="Messenger.setResMiddleware"></a>

### Messenger.setResMiddleware(middleware, method)
set response middleware

**Kind**: static method of [<code>Messenger</code>](#Messenger)  

| Param | Type | Description |
| --- | --- | --- |
| middleware | <code>any</code> | middle ware for req |
| method | <code>String</code> | method name |

<a name="Messenger.{function name}"></a>

### Messenger.{function name}(version, networkId)
**Kind**: static method of [<code>Messenger</code>](#Messenger)  

| Param | Type | Description |
| --- | --- | --- |
| version | <code>Number</code> | version number |
| networkId | <code>String</code> | network id |

<a name="Messenger.setNetworkID"></a>

### Messenger.setNetworkID(id)
**Kind**: static method of [<code>Messenger</code>](#Messenger)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | network id string |

<a name="sendServer"></a>

## sendServer(endpoint, data) ⇒ <code>Object</code>
send data to scilla runner endpoint

**Kind**: global function  
**Returns**: <code>Object</code> - RPC result  

| Param | Type | Description |
| --- | --- | --- |
| endpoint | <code>String</code> | endpoint that point to server |
| data | <code>Object</code> | data object with method and params |

