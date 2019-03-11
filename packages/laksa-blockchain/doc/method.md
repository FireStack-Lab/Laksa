---
title: method
---

# method

## Functions

<dl>
<dt><a href="#{setMessenger}">{setMessenger}(msg)</a> ⇒ <code>Messenger</code></dt>
<dd></dd>
<dt><a href="#{validateArgs}">{validateArgs}(args, requiredArgs, optionalArgs)</a> ⇒ <code>boolean</code> | <code>Error</code></dt>
<dd></dd>
<dt><a href="#{extractParams}">{extractParams}(args)</a> ⇒ <code>Array.&lt;object&gt;</code></dt>
<dd></dd>
<dt><a href="#{transformedBeforeSend}">{transformedBeforeSend}(value, key)</a> ⇒ <code>any</code></dt>
<dd></dd>
<dt><a href="#{assignToObject} {assign method to some object}">{assignToObject} {assign method to some object}(object)</a> ⇒ <code>object</code></dt>
<dd></dd>
<dt><a href="#{methodBuilder}">{methodBuilder}()</a> ⇒ <code>any</code></dt>
<dd></dd>
</dl>

<a name="{setMessenger}"></a>

## {setMessenger}(msg) ⇒ <code>Messenger</code>
**Kind**: global function  
**Returns**: <code>Messenger</code> - {messenger setter}  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>Messenger</code> | {messenger instance} |

<a name="{validateArgs}"></a>

## {validateArgs}(args, requiredArgs, optionalArgs) ⇒ <code>boolean</code> \| <code>Error</code>
**Kind**: global function  
**Returns**: <code>boolean</code> \| <code>Error</code> - {validate result}  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>object</code> | {args objects} |
| requiredArgs | <code>object</code> | {requred args object} |
| optionalArgs | <code>object</code> | {optional args object} |

<a name="{extractParams}"></a>

## {extractParams}(args) ⇒ <code>Array.&lt;object&gt;</code>
**Kind**: global function  
**Returns**: <code>Array.&lt;object&gt;</code> - {extracted params}  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>object</code> | {args object} |

<a name="{transformedBeforeSend}"></a>

## {transformedBeforeSend}(value, key) ⇒ <code>any</code>
**Kind**: global function  
**Returns**: <code>any</code> - {value that transformed}  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | {value that waited to transform} |
| key | <code>string</code> | {key to transform} |

<a name="{assignToObject} {assign method to some object}"></a>

## {assignToObject} {assign method to some object}(object) ⇒ <code>object</code>
**Kind**: global function  
**Returns**: <code>object</code> - {new object}  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>object</code> | {method object} |

<a name="{methodBuilder}"></a>

## {methodBuilder}() ⇒ <code>any</code>
**Kind**: global function  
**Returns**: <code>any</code> - {built method}  
