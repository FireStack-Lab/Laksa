---
title: HttpProvider
---

# HttpProvider

<a name="HttpProvider"></a>

## HttpProvider
**Kind**: global class  

* [HttpProvider](#HttpProvider)
    * [.send(payload, callback)](#HttpProvider+send) ⇒ <code>any</code>
    * [.sendServer(endpoint, payload, callback)](#HttpProvider+sendServer) ⇒ <code>function</code>
    * [.requestFunc(endpoint, payload, callback)](#HttpProvider+requestFunc) ⇒ <code>function</code>
    * [.payloadHandler(payload)](#HttpProvider+payloadHandler) ⇒ <code>Object</code>
    * [.endpointHandler(obj, endpoint)](#HttpProvider+endpointHandler) ⇒ <code>Object</code>
    * [.optionsHandler(obj)](#HttpProvider+optionsHandler) ⇒ <code>Object</code>
    * [.callbackHandler(data, cb)](#HttpProvider+callbackHandler) ⇒ <code>Object</code> \| <code>function</code>

<a name="HttpProvider+send"></a>

### httpProvider.send(payload, callback) ⇒ <code>any</code>
**Kind**: instance method of [<code>HttpProvider</code>](#HttpProvider)  
**Returns**: <code>any</code> - - RPC Response  

| Param | Type | Description |
| --- | --- | --- |
| payload | <code>Object</code> | payload object |
| callback | <code>function</code> | callback function |

<a name="HttpProvider+sendServer"></a>

### httpProvider.sendServer(endpoint, payload, callback) ⇒ <code>function</code>
**Kind**: instance method of [<code>HttpProvider</code>](#HttpProvider)  
**Returns**: <code>function</code> - - RPC Response  

| Param | Type | Description |
| --- | --- | --- |
| endpoint | <code>String</code> | endpoint to server |
| payload | <code>Object</code> | payload object |
| callback | <code>function</code> | callback function |

<a name="HttpProvider+requestFunc"></a>

### httpProvider.requestFunc(endpoint, payload, callback) ⇒ <code>function</code>
**Kind**: instance method of [<code>HttpProvider</code>](#HttpProvider)  
**Returns**: <code>function</code> - - performRPC call from laksa-core-provider  

| Param | Type | Description |
| --- | --- | --- |
| endpoint | <code>String</code> | endpoint to the server |
| payload | <code>Object</code> | payload object |
| callback | <code>function</code> | callback function |

<a name="HttpProvider+payloadHandler"></a>

### httpProvider.payloadHandler(payload) ⇒ <code>Object</code>
**Kind**: instance method of [<code>HttpProvider</code>](#HttpProvider)  
**Returns**: <code>Object</code> - - to payload object  

| Param | Type | Description |
| --- | --- | --- |
| payload | <code>Object</code> | payload object |

<a name="HttpProvider+endpointHandler"></a>

### httpProvider.endpointHandler(obj, endpoint) ⇒ <code>Object</code>
**Kind**: instance method of [<code>HttpProvider</code>](#HttpProvider)  
**Returns**: <code>Object</code> - - assign a new object  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | payload object |
| endpoint | <code>String</code> | add the endpoint to payload object |

<a name="HttpProvider+optionsHandler"></a>

### httpProvider.optionsHandler(obj) ⇒ <code>Object</code>
**Kind**: instance method of [<code>HttpProvider</code>](#HttpProvider)  
**Returns**: <code>Object</code> - - assign a new option object  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | options object |

<a name="HttpProvider+callbackHandler"></a>

### httpProvider.callbackHandler(data, cb) ⇒ <code>Object</code> \| <code>function</code>
**Kind**: instance method of [<code>HttpProvider</code>](#HttpProvider)  
**Returns**: <code>Object</code> \| <code>function</code> - - return object or callback function  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | from server |
| cb | <code>function</code> | callback function |

