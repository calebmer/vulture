'use strict'

var diff = require('virtual-dom/diff')
var patch = require('virtual-dom/patch')
var Thunk = require('./Thunk')
var ExposeHook = require('./ExposeHook')

/**
 * A thunk which can update itself.
 *
 * @constructor
 * @extends Thunk
 * @param {function} The function to be used in rendering.
 */

function UpdatableThunk (renderer) {
  if (!(this instanceof UpdatableThunk)) {
    return new UpdatableThunk()
  }

  Thunk.call(this)

  this.hook = new ExposeHook()
  this.renderer = renderer
  this.rendering = false
}

UpdatableThunk.prototype = Object.create(Thunk.prototype)

/**
 * Uses the exposed node from the hook to update the thunk both in the dom and
 * in the object representation. This bypasses the need to do a full rerender
 * and only rerenders child nodes.
 *
 * @method
 */

UpdatableThunk.prototype.update = function update () {
  var thunk = this.getLatestThunk()

  // Don’t update if we are presently rendering.
  if (thunk.rendering) {
    return
  }

  var node = thunk.hook.node
  var lastVNode = thunk.vnode
  var nextVNode = thunk.render(thunk)

  if (node) {
    var patches = diff(lastVNode, nextVNode)
    patch(node, patches)
  }

  thunk.vnode = nextVNode
}

/**
 * Get‘s the latest updatable thunk in the chain. This is useful for stale
 * `update` methods as they can get the live thunk.
 *
 * In best case scenarios it just returns `this`, but sometimes, for whatever
 * reason, an old `update` method is being held somewhere in memory that we
 * would like to keep working.
 *
 * @method
 * @returns {UpdatableThunk} The latest updatable thunk.
 */

UpdatableThunk.prototype.getLatestThunk = function getLatestThunk () {
  return this.next && this.next !== this ? this.next.getLatestThunk() : this
}

/**
 * Ghetto way of getting the exposing hook onto the virtual node.
 *
 * @method
 * @param {VNode} The virtual node to add the hook to.
 */

// TODO: More idiomatic support for hooks on thunks. See the following issue:
// https://github.com/Matt-Esch/virtual-dom/issues/343
UpdatableThunk.prototype.addHookToVNode = function addHookToVNode (vnode) {
  vnode.properties.__updateHook__ = this.hook
}

UpdatableThunk.prototype.render = function render (previous) {
  // Set the latest updatable thunk to this one on the previous thunk.
  if (previous) {
    previous.next = this
  }

  this.rendering = true
  var vnode = this.renderer()
  this.rendering = false
  this.addHookToVNode(vnode)
  return vnode
}

module.exports = UpdatableThunk
