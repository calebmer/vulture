'use strict'

var Hook = require('./Hook')

/**
 * A hook which exposes it‘s node.
 *
 * @constructor
 */

function ExposeHook () {
  if (!(this instanceof ExposeHook)) {
    return new ExposeHook()
  }

  Hook.call(this)

  this.node = null
}

ExposeHook.prototype = Object.create(Hook.prototype)

ExposeHook.prototype.hook = function hook (node) {
  this.node = node
}

ExposeHook.prototype.unhook = function hook () {
  this.node = null
}

module.exports = ExposeHook
