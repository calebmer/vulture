var createElement = require('virtual-dom/create-element')
var diffNodes = require('virtual-dom/diff')
var patchDOM = require('virtual-dom/patch')

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
  var rootNode = containerNode.firstElementChild
  var lastVNode = lastRenders.get(containerNode)

  if (rootNode !== containerNode.lastElementChild) {
    throw new Error('Parent node may not have more than one child.')
  }

  if (rootNode && lastVNode) {
    // If a render exists, use it to get patches.
    updateDOM(lastVNode, nextVNode, rootNode)
  } else {
    // Create a new DOM node.
    var nextNode = createElement(nextVNode, { document: document })

    if (rootNode) {
      // If a node already exists, replace it.
      containerNode.replaceChild(nextNode, rootNode)
    } else {
      // Otherwise, add the child.
      containerNode.appendChild(nextNode)
    }
  }

  lastRenders.set(containerNode, nextVNode)
}

module.exports = renderToDOM

/**
 * Stores the container node and rendered virtual DOM for usage in diffing in
 * later renders.
 *
 * Has a super simple polyfill implementation.
 *
 * @private
 */

var lastRenders = WeakMap ? new WeakMap() : ({
  // An array of key/value tuples
  store: [],

  has: function has (key) {
    for (var entry in this.store) {
      if (entry[0] === key) {
        return true
      }
    }
    return false
  },

  get: function get (key) {
    for (var entry in this.store) {
      if (entry[0] === key) {
        return entry[1]
      }
    }
  },

  set: function set (key, value) {
    this.store.push([key, value])
  }
})

// Only exported for testing.
renderToDOM.lastRenders = lastRenders

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
  var patches = diffNodes(lastVNode, nextVNode)
  patchDOM(rootNode, patches)
}
