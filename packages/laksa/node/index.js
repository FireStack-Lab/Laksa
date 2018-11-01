(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('laksa-core')) :
  typeof define === 'function' && define.amd ? define(['laksa-core'], factory) :
  (global.Laksa = factory(global.Laksa));
}(this, (function (Laksa) { 'use strict';

  if (typeof window !== 'undefined' && typeof window.Laksa === 'undefined') {
    window.Laksa = Laksa;
  }

  return Laksa;

})));
