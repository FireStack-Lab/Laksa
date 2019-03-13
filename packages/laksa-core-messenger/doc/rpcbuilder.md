---
title: rpcbuilder
---

# rpcbuilder

<a name="JsonRpc"></a>

## JsonRpc
**Kind**: global class  

* [JsonRpc](#JsonRpc)
    * [new JsonRpc()](#new_JsonRpc_new)
    * [.messageId](#JsonRpc+messageId) : <code>Number</code>
    * [.toPayload(method, params)](#JsonRpc+toPayload) ⇒ <code>Object</code>

<a name="new_JsonRpc_new"></a>

### new JsonRpc()
json rpc instance

**Returns**: [<code>JsonRpc</code>](#JsonRpc) - Json RPC instance  
<a name="JsonRpc+messageId"></a>

### jsonRpc.messageId : <code>Number</code>
message id, default 0

**Kind**: instance property of [<code>JsonRpc</code>](#JsonRpc)  
<a name="JsonRpc+toPayload"></a>

### jsonRpc.toPayload(method, params) ⇒ <code>Object</code>
convert method and params to payload object

**Kind**: instance method of [<code>JsonRpc</code>](#JsonRpc)  
**Returns**: <code>Object</code> - payload object  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>String</code> | RPC method |
| params | <code>Array.&lt;object&gt;</code> | params that send to RPC |

