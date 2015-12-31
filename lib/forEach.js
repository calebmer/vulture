var map = require('./map')

/**
 * Iterates over all nodes in a virtual DOM tree. Uses the same implementation
 * as `mapNode` except the nodes are not transformed.
 *
 * @param {VNode} The root node to start iteration.
 * @param {function} The function to iterate with.
 */

function forEach(rootNode, iteratee) {
  map(rootNode, function (node) {
    iteratee(node, rootNode)
    return node
  })
}

module.exports = forEach
