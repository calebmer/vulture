'use strict'

var forEach = require('./forEach')

/**
 * Turns a virtual DOM tree into a single value. Maintains the standard `reduce`
 * function contract.
 *
 * @param {VNode} The virtual DOM tree to be reduced.
 * @param {function} The reducing function.
 * @param {any} The initial value to start with.
 * @returns {any} The reduced value.
 */

function reduce (rootNode, reducer, initialValue) {
  var value = initialValue
  forEach(rootNode, function (node) {
    value = reducer(value, node, rootNode)
  })
  return value
}

module.exports = reduce
