'use strict'

/**
 * Hooks an event onto a DOM node. Complies with the `virtual-dom` hook
 * contract.
 *
 * @constructor
 * @param {string} The event to attach the listener to.
 * @param {function} The event listener.
 */

function EventHook (event, listener) {
  if (!(this instanceof EventHook)) {
    return new EventHook(event, listener)
  }

  this.event = event
  this.listener = listener
}

EventHook.prototype.hook = function hook (node) {
  node.addEventListener(this.event, this.listener)
}

EventHook.prototype.unhook = function unhook (node) {
  node.removeEventListener(this.event, this.listener)
}

module.exports = EventHook
