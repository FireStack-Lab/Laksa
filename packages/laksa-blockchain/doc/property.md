---
title: property
---

# property

<a name="Property"></a>

## Property
**Kind**: global class  

* [Property](#Property)
    * [new Property(options, messenger)](#new_Property_new)
    * _instance_
        * [.name](#Property+name) : <code>String</code>
        * [.getter](#Property+getter) : <code>function</code>
        * [.setter](#Property+setter) : <code>function</code>
        * [.messenger](#Property+messenger) : <code>Messenger</code>
    * _static_
        * [.setMessenger(msg)](#Property.setMessenger)
        * [.assignToObject(object)](#Property.assignToObject)
        * [.propertyBuilder()](#Property.propertyBuilder) ⇒ <code>any</code>

<a name="new_Property_new"></a>

### new Property(options, messenger)
generate a property for class


| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | property options |
| messenger | <code>Messenger</code> | Messsenger instance |

<a name="Property+name"></a>

### property.name : <code>String</code>
property name

**Kind**: instance property of [<code>Property</code>](#Property)  
<a name="Property+getter"></a>

### property.getter : <code>function</code>
property getter

**Kind**: instance property of [<code>Property</code>](#Property)  
<a name="Property+setter"></a>

### property.setter : <code>function</code>
property setter

**Kind**: instance property of [<code>Property</code>](#Property)  
<a name="Property+messenger"></a>

### property.messenger : <code>Messenger</code>
Messenger instance

**Kind**: instance property of [<code>Property</code>](#Property)  
<a name="Property.setMessenger"></a>

### Property.setMessenger(msg)
messenger setter

**Kind**: static method of [<code>Property</code>](#Property)  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>Messenger</code> | messenger instance |

<a name="Property.assignToObject"></a>

### Property.assignToObject(object)
assign property to class

**Kind**: static method of [<code>Property</code>](#Property)  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | method object |

<a name="Property.propertyBuilder"></a>

### Property.propertyBuilder() ⇒ <code>any</code>
**Kind**: static method of [<code>Property</code>](#Property)  
**Returns**: <code>any</code> - - property call  
