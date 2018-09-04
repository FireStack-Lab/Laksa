'use strict';

var Laksa = require('laksa-core');

if (typeof window !== 'undefined' && typeof window.Laksa === 'undefined') {
  window.Laksa = Laksa;
}

module.exports = Laksa;
