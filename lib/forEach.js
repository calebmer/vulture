var map = require('./map')

/**
 * Iterates over all nodes in a virtual DOM tree. Uses the same implementation
 * as `mapNode` except the nodes are not transformed.
 *
 * @param {VNode} The root node to start iteration.
 * @param {function} The function to iterate with.
 */

function forEach(rootNode, iteratee) {
  map(rootNode, node => (iteratee(node, rootNode), node))
}

module.exports = forEach
