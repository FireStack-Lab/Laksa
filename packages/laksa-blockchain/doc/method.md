---
title: method
---

# method

<a name="Method"></a>

## Method
**Kind**: global class  

* [Method](#Method)
    * [new Method(options, messenger)](#new_Method_new)
    * _instance_
        * [.name](#Method+name) : <code>String</code>
        * [.call](#Method+call) : <code>function</code>
        * [.messenger](#Method+messenger) : <code>Messsenger</code>
        * [.params](#Method+params) : <code>Object</code>
        * [.transformer](#Method+transformer) : <code>Object</code>
        * [.endpoint](#Method+endpoint) : <code>String</code>
        * [.isSendJson](#Method+isSendJson) : <code>Boolean</code>
    * _static_
        * [.setMessenger(messenger)](#Method.setMessenger)
        * [.validateArgs(args, requiredArgs, optionalArgs)](#Method.validateArgs) ⇒ <code>Boolean</code> \| <code>Error</code>
        * [.extractParams(args)](#Method.extractParams) ⇒ <code>Array.&lt;Object&gt;</code>
        * [.transformedBeforeSend(value, key)](#Method.transformedBeforeSend) ⇒ <code>any</code>
        * [.assignToObject(object)](#Method.assignToObject) ⇒ <code>Object</code>
        * [.methodBuilder()](#Method.methodBuilder) ⇒ <code>any</code>

<a name="new_Method_new"></a>

### new Method(options, messenger)
generate a method


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | to constructor |
| messenger | <code>Messenger</code> | Messenger instance |

<a name="Method+name"></a>

### method.name : <code>String</code>
method name

**Kind**: instance property of [<code>Method</code>](#Method)  
<a name="Method+call"></a>

### method.call : <code>function</code>
method to call

**Kind**: instance property of [<code>Method</code>](#Method)  
<a name="Method+messenger"></a>

### method.messenger : <code>Messsenger</code>
Messenger of Method

**Kind**: instance property of [<code>Method</code>](#Method)  
<a name="Method+params"></a>

### method.params : <code>Object</code>
params send to Method

**Kind**: instance property of [<code>Method</code>](#Method)  
<a name="Method+transformer"></a>

### method.transformer : <code>Object</code>
transformer send to Method

**Kind**: instance property of [<code>Method</code>](#Method)  
<a name="Method+endpoint"></a>

### method.endpoint : <code>String</code>
endpoint string to call

**Kind**: instance property of [<code>Method</code>](#Method)  
<a name="Method+isSendJson"></a>

### method.isSendJson : <code>Boolean</code>
whether send params as json

**Kind**: instance property of [<code>Method</code>](#Method)  
<a name="Method.setMessenger"></a>

### Method.setMessenger(messenger)
messenger setter

**Kind**: static method of [<code>Method</code>](#Method)  

| Param | Type | Description |
| --- | --- | --- |
| messenger | <code>Messenger</code> | messenger instance |

<a name="Method.validateArgs"></a>

### Method.validateArgs(args, requiredArgs, optionalArgs) ⇒ <code>Boolean</code> \| <code>Error</code>
validate args received

**Kind**: static method of [<code>Method</code>](#Method)  
**Returns**: <code>Boolean</code> \| <code>Error</code> - validate result  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>Object</code> | args objects |
| requiredArgs | <code>Object</code> | requred args object |
| optionalArgs | <code>Object</code> | optional args object |

<a name="Method.extractParams"></a>

### Method.extractParams(args) ⇒ <code>Array.&lt;Object&gt;</code>
extract params sent to Method

**Kind**: static method of [<code>Method</code>](#Method)  
**Returns**: <code>Array.&lt;Object&gt;</code> - extracted params  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>Object</code> | args object |

<a name="Method.transformedBeforeSend"></a>

### Method.transformedBeforeSend(value, key) ⇒ <code>any</code>
extract params sent to Method

**Kind**: static method of [<code>Method</code>](#Method)  
**Returns**: <code>any</code> - value that transformed  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | value that waited to transform |
| key | <code>String</code> | key to transform |

<a name="Method.assignToObject"></a>

### Method.assignToObject(object) ⇒ <code>Object</code>
assign method to class object

**Kind**: static method of [<code>Method</code>](#Method)  
**Returns**: <code>Object</code> - new object  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | method object |

<a name="Method.methodBuilder"></a>

### Method.methodBuilder() ⇒ <code>any</code>
build method when call

**Kind**: static method of [<code>Method</code>](#Method)  
**Returns**: <code>any</code> - call method  
