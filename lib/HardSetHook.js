'use strict'

var Hook = require('./Hook')

/**
 * A hook to always set the specified value on the node. This bypasses the
 * virtual dom diff algorithm and always sets the value.
 *
 * @constructor
 * @param {any} The value to hard set.
 */

function HardSetHook (value) {
  if (!(this instanceof HardSetHook)) {
    return new HardSetHook(value)
  }

  Hook.call(this)

  this.value = value
}

HardSetHook.prototype = Object.create(Hook.prototype)

HardSetHook.prototype.hook = function hook (node, property) {
  node[property] = this.value
}

module.exports = HardSetHook
