var isObject = require('lodash/lang/isObject')
var isArray = require('lodash/lang/isArray')
var VNode = require('virtual-dom/vnode/vnode')

/**
 * Takes a virtual DOM tree and transforms every node in it. Children are
 * transformed after the parent. While this function is recursive, it maintains
 * a reference to the root node.
 *
 * @param {VNode} The root node to transform.
 * @param {function} The mapper function.
 * @return {VNode} The transformed root node and children.
 */

function map(prevNode, mapper, rootNode) {
  if (!(prevNode instanceof VNode)) {
    if (rootNode) {
      return prevNode
    }
    else {
      throw new Error('May only map over virtual nodes')
    }
  }

  rootNode = rootNode || prevNode

  var nextNode = mapper(prevNode, rootNode)

  if (!isObject(nextNode)) {
    return nextNode
  }

  var prevChildren = nextNode.children
  var nextChildren = isArray(prevChildren) ? prevChildren.map(node => map(node, mapper, rootNode)) : null
  nextNode.children = nextChildren

  return nextNode
}


module.exports = map
