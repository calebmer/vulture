var WeakMap = require('es6-weak-map')
var createElement = require('virtual-dom/create-element')
var diffTrees = require('virtual-dom/diff')
var patchDOM = require('virtual-dom/patch')
var virtualize = require('vdom-virtualize')

/**
 * Stores the container node and rendered virtual DOM for usage in diffing in
 * later renders. This is only exported for testing purposes.
 *
 * @private
 */

// TODO: Remove `es6-weak-map` dependency
var lastRenders = new WeakMap()

/**
 * Renders a virtual tree to a container dom node. Once rendered, the virtual
 * tree is saved so that it can be diffed against later.
 *
 * If the function is called after a previous render, the old tree will be used
 * to diff and patch the DOM. If the function is called initially and there is
 * a single node in the container, we turn it back into a virtual dom
 * representation and diff/patch against that. Finally, if the container is
 * empty, we create a dom node from the tree and append it.
 *
 * @param {VNode} The virtual node to render.
 * @param {Element} The DOM container to render in.
 */

function renderToDOM (nextVNode, containerNode, document) {
  var lastVNode
  var rootNode = containerNode.firstElementChild

  if (rootNode !== containerNode.lastElementChild) {
    throw new Error('Parent node have no more than one child.')
  }

  if (lastRenders.has(containerNode)) {
    // If a render exists, use it to get patches.
    lastVNode = lastRenders.get(containerNode)
    updateDOM(lastVNode, nextVNode, rootNode)
  } else if (rootNode) {
    // If there is a root node, get a virtual dom representation and patch the
    // DOM with it. We remove properties from the virtualized node to eliminate
    // wierd side effects, such as where `attributes.class` could conflict with
    // `className`.
    lastVNode = removeProperties(virtualize(rootNode))
    updateDOM(lastVNode, nextVNode, rootNode)
  } else {
    // If the parent node is empty, create a new dom node.
    var nextNode = createElement(nextVNode, { document: document })
    containerNode.appendChild(nextNode)
  }

  lastRenders.set(containerNode, nextVNode)
}

renderToDOM.lastRenders = lastRenders
module.exports = renderToDOM

/**
 * Diff the two virtual nodes then patch the DOM node.
 *
 * @private
 * @see renderToDOM
 * @param {VNode} The old virtual node.
 * @param {VNode} The new virtual node.
 * @param {Element} The DOM node to be patched.
 */

function updateDOM (lastVNode, nextVNode, rootNode) {
  var patches = diffTrees(lastVNode, nextVNode)
  patchDOM(rootNode, patches)
}

/**
 * Remove all virtual dom properties from the virtual node.
 *
 * @private
 * @see renderToDOM
 * @param {VNode} The node we are removing properties from.
 * @param {VNode} The node with properties removed.
 */

function removeProperties (node) {
  if (node.properties) {
    node.properties = {}
  }
  if (node.children) {
    node.children = node.children.map(removeProperties)
  }
  return node
}
