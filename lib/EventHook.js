'use strict'

var isString = require('lodash/isString')
var Hook = require('./Hook')

/**
 * Hooks an event listener onto a dom node. May pass a string event name and a
 * function listener, or an object of multiple event/listener pairs.
 *
 * @constructor
 * @param {string} The event to attach the listener to.
 * @param {function} The event listener.
 */

function EventHook (listeners, listener) {
  Hook.call(this)

  if (isString(listeners)) {
    var eventName = listeners
    this.listeners = {}
    this.listeners[eventName] = listener
  } else {
    this.listeners = listeners
  }
}

EventHook.prototype = Object.create(Hook.prototype)

EventHook.prototype.hook = function hook (node) {
  var listeners = this.listeners
  Object.keys(listeners).forEach(function (eventName) {
    node.addEventListener(eventName, listeners[eventName])
  })
}

EventHook.prototype.unhook = function unhook (node) {
  var listeners = this.listeners
  Object.keys(listeners).forEach(function (eventName) {
    node.removeEventListener(eventName, listeners[eventName])
  })
}

module.exports = EventHook
