'use strict'

var noop = require('lodash/noop')
var diffNodes = require('virtual-dom/diff')
var patchDOM = require('virtual-dom/patch')
var Hook = require('./Hook')

/**
 * A hook made to update a thunk.
 *
 * @constructor
 * @param {string} The event to attach the listener to.
 * @param {function} The event listener.
 */

function UpdateHook () {
  if (!(this instanceof UpdateHook)) {
    return new UpdateHook()
  }

  Hook.call(this)

  this.update = noop
}

UpdateHook.prototype = Object.create(Hook.prototype)

UpdateHook.prototype.hook = function hook (node) {
  this.update = function update (thunk) {
    var lastVNode = thunk.vnode
    var nextVNode = thunk.render(thunk)
    var patches = diffNodes(lastVNode, nextVNode)
    patchDOM(node, patches)

    // Make sure the thunk has the most recent node to be diffed.
    thunk.vnode = nextVNode
  }
}

module.exports = UpdateHook
