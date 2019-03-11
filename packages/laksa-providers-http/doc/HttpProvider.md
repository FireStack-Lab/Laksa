---
title: HttpProvider
---

# HttpProvider

## Functions

<dl>
<dt><a href="#{send}">{send}(payload, callback)</a> ⇒ <code>function</code></dt>
<dd></dd>
<dt><a href="#{sendServer}">{sendServer}(endpoint, payload, callback)</a> ⇒ <code>function</code></dt>
<dd></dd>
<dt><a href="#{requestFunc}">{requestFunc}(endpoint, payload, callback)</a> ⇒ <code>function</code></dt>
<dd></dd>
<dt><a href="#{payloadHandler}">{payloadHandler}(payload)</a> ⇒ <code>object</code></dt>
<dd></dd>
<dt><a href="#{endpointHandler}">{endpointHandler}(obj, endpoint)</a> ⇒ <code>object</code></dt>
<dd></dd>
<dt><a href="#{optionsHandler}">{optionsHandler}(obj)</a> ⇒ <code>object</code></dt>
<dd></dd>
<dt><a href="#{callbackHandler}">{callbackHandler}(data, cb)</a> ⇒ <code>object</code> | <code>function</code></dt>
<dd></dd>
</dl>

<a name="{send}"></a>

## {send}(payload, callback) ⇒ <code>function</code>
**Kind**: global function  
**Returns**: <code>function</code> - {to requestFunc}  

| Param | Type | Description |
| --- | --- | --- |
| payload | <code>object</code> | {payload object} |
| callback | <code>function</code> | {callback function} |

<a name="{sendServer}"></a>

## {sendServer}(endpoint, payload, callback) ⇒ <code>function</code>
**Kind**: global function  
**Returns**: <code>function</code> - {to requestFunc}  

| Param | Type | Description |
| --- | --- | --- |
| endpoint | <code>string</code> | {endpoint to the server} |
| payload | <code>object</code> | {payload object} |
| callback | <code>function</code> | {callback function} |

<a name="{requestFunc}"></a>

## {requestFunc}(endpoint, payload, callback) ⇒ <code>function</code>
**Kind**: global function  
**Returns**: <code>function</code> - {performRPC call from laksa-core-provider}  

| Param | Type | Description |
| --- | --- | --- |
| endpoint | <code>string</code> | {endpoint to the server} |
| payload | <code>object</code> | {payload object} |
| callback | <code>function</code> | {callback function} |

<a name="{payloadHandler}"></a>

## {payloadHandler}(payload) ⇒ <code>object</code>
**Kind**: global function  
**Returns**: <code>object</code> - {to payload object}  

| Param | Type | Description |
| --- | --- | --- |
| payload | <code>object</code> | {payload object} |

<a name="{endpointHandler}"></a>

## {endpointHandler}(obj, endpoint) ⇒ <code>object</code>
**Kind**: global function  
**Returns**: <code>object</code> - {assign a new object}  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | {payload object} |
| endpoint | <code>string</code> | {add the endpoint to payload object} |

<a name="{optionsHandler}"></a>

## {optionsHandler}(obj) ⇒ <code>object</code>
**Kind**: global function  
**Returns**: <code>object</code> - {assign a new option object}  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | {options object} |

<a name="{callbackHandler}"></a>

## {callbackHandler}(data, cb) ⇒ <code>object</code> \| <code>function</code>
**Kind**: global function  
**Returns**: <code>object</code> \| <code>function</code> - {return object or callback function}  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | {from server} |
| cb | <code>function</code> | {callback function} |

