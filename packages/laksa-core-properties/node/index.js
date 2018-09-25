(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Laksa = factory());
}(this, (function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  class Property {
    constructor(options) {
      _defineProperty(this, "setMessanger", msg => {
        this.messanger = msg;
      });

      _defineProperty(this, "assignToObject", object => {
        const zilName = this.name;

        const asyncGetterName = getName => {
          return `get${getName.charAt(0).toUpperCase()}${getName.slice(1)}`;
        };

        const zilObject = {
          get: this.propertyBuilder(),
          enumerable: true
        };
        const newZilObject = {};
        newZilObject[asyncGetterName(zilName)] = this.propertyBuilder();
        Object.defineProperty(object, zilName, zilObject);
        Object.assign(object, newZilObject);
      });

      _defineProperty(this, "propertyBuilder", () => {
        if (this.messanger !== null) {
          return callback => {
            if (callback) {
              return this.messanger.sendAsync({
                method: this.getter
              }, callback);
            }

            return this.messanger.send({
              method: this.getter
            });
          };
        }
      });

      const {
        name,
        getter,
        setter
      } = options;
      this.name = name;
      this.getter = getter;
      this.setter = setter;
      this.messanger = null;
    }

  }

  return Property;

})));
