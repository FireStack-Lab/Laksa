---
title: messenger
---

# messenger

## Functions

<dl>
<dt><a href="#{send}">{send}(data)</a> ⇒ <code>object</code> | <code>Error</code></dt>
<dd></dd>
<dt><a href="#{sendServer}">{sendServer}(endpoint, data)</a> ⇒ <code>object</code> | <code>Error</code></dt>
<dd></dd>
<dt><a href="#{setProvider}">{setProvider}(provider)</a> ⇒ <code>Provider</code></dt>
<dd></dd>
<dt><a href="#{setScillaProvider}">{setScillaProvider}(provider)</a> ⇒ <code>Provider</code></dt>
<dd></dd>
<dt><a href="#{providerCheck}">{providerCheck}()</a> ⇒ <code>Error</code> | <code>null</code></dt>
<dd></dd>
</dl>

<a name="{send}"></a>

## {send}(data) ⇒ <code>object</code> \| <code>Error</code>
**Kind**: global function  
**Returns**: <code>object</code> \| <code>Error</code> - {result from provider}  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | {data object with method and params} |

<a name="{sendServer}"></a>

## {sendServer}(endpoint, data) ⇒ <code>object</code> \| <code>Error</code>
**Kind**: global function  
**Returns**: <code>object</code> \| <code>Error</code> - {result from provider}  

| Param | Type | Description |
| --- | --- | --- |
| endpoint | <code>string</code> | {endpoint that point to server} |
| data | <code>object</code> | {data object with method and params} |

<a name="{setProvider}"></a>

## {setProvider}(provider) ⇒ <code>Provider</code>
**Kind**: global function  
**Returns**: <code>Provider</code> - {provider setter}  

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | {provider instance} |

<a name="{setScillaProvider}"></a>

## {setScillaProvider}(provider) ⇒ <code>Provider</code>
**Kind**: global function  
**Returns**: <code>Provider</code> - {provider setter}  

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>Provider</code> | {provider instance} |

<a name="{providerCheck}"></a>

## {providerCheck}() ⇒ <code>Error</code> \| <code>null</code>
**Kind**: global function  
**Returns**: <code>Error</code> \| <code>null</code> - {provider validator}  
