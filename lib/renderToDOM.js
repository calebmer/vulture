import createElement from 'virtual-dom/create-element'
import diffTrees from 'virtual-dom/diff'
import patchDOM from 'virtual-dom/patch'
import virtualize from 'vdom-virtualize'

/**
 * Stores the container node and rendered virtual DOM for usage in diffing in
 * later renders. This is only exported for testing purposes.
 *
 * @private
 */

export const lastRenders = new WeakMap()

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

export default function renderToDOM(nextVNode, containerNode, document) {
  const rootNode = containerNode.firstElementChild

  if (rootNode !== containerNode.lastElementChild) {
    throw new Error('Parent node have no more than one child.')
  }

  // If a render exists, use it to get patches.
  if (lastRenders.has(containerNode)) {
    const lastVNode = lastRenders.get(containerNode)
    updateDOM(lastVNode, nextVNode, rootNode)
  }

  // If there is a root node, get a virtual dom representation and patch the
  // DOM with it. We remove properties from the virtualized node to eliminate
  // wierd side effects, such as where `attributes.class` could conflict with
  // `className`.
  else if (rootNode) {
    const lastVNode = removeProperties(virtualize(rootNode))
    updateDOM(lastVNode, nextVNode, rootNode)
  }

  // If the parent node is empty, create a new dom node.
  else {
    const nextNode = createElement(nextVNode, { document })
    containerNode.appendChild(nextNode)
  }

  lastRenders.set(containerNode, nextVNode)
}

/**
 * Diff the two virtual nodes then patch the DOM node.
 *
 * @private
 * @see renderToDOM
 * @param {VNode} The old virtual node.
 * @param {VNode} The new virtual node.
 * @param {Element} The DOM node to be patched.
 */

function updateDOM(lastVNode, nextVNode, rootNode) {
  const patches = diffTrees(lastVNode, nextVNode)
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

function removeProperties(node) {
  if (node.properties) {
    node.properties = {}
  }
  if (node.children) {
    node.children = node.children.map(removeProperties)
  }
  return node
}
