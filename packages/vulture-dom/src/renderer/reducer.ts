import {
  Patch,
  PathKey,
  NODE_REPLACE,
  ATTRIBUTE_SET,
  ATTRIBUTE_REMOVE,
  CHILDREN_ADD,
  CHILDREN_REMOVE,
  CHILDREN_ORDER,
} from 'vulture'

import { isElement } from '../utils'
import { renderNode } from './renderer'
import { setAttribute, removeAttribute } from './attributes'
import { $$key, lookupPath } from './path'

// TODO: All of the errors we throw are for assumptions the patch makes about
// the previous state of the render tree. Make sure all of these errors
// (assumptions) are documented in `vulture/src/diff/patch.ts`.
// TODO: Performance testing.
export function reduceNode (parentNode: Node, patch: Patch): Node {
  const pathString = patch.path.join('/') || '/'
  const node = lookupPath(parentNode, patch.path)

  if (!node)
    throw new Error(`Cannot patch non-existant node at path ${pathString}.`)

  switch (patch.type) {
    case NODE_REPLACE: {
      if (patch.path.length === 0) {
        const newParentNode = renderNode(patch.node)
        parentNode.parentNode.replaceChild(newParentNode, parentNode)
        return newParentNode
      }
      else {
        const newNode = renderNode(patch.node)
        newNode[$$key] = patch.path[patch.path.length - 1]
        node.parentNode.replaceChild(newNode, node)
        return parentNode
      }
    }
    case ATTRIBUTE_SET: {
      if (isElement(node))
        setAttribute(node, patch.name, patch.value)
      else
        throw new Error(`Cannot set attribute for non-element at path '${pathString}'.`)

      return parentNode
    }
    case ATTRIBUTE_REMOVE: {
      if (isElement(node))
        removeAttribute(node, patch.name)
      else
        throw new Error(`Cannot remove attribute for non-element at path '${pathString}'.`)

      return parentNode
    }
    case CHILDREN_ADD: {
      const childNode = renderNode(patch.node)
      childNode[$$key] = patch.key
      node.appendChild(childNode)
      return parentNode
    }
    case CHILDREN_REMOVE: {
      const childNode = lookupPath(node, [patch.key])
      if (!childNode)
        throw new Error(`Cannot remove child '${patch.key}' at path '${pathString}'.`)
      node.removeChild(childNode)
      return parentNode
    }
    case CHILDREN_ORDER: {
      if (patch.keys.length === 0)
        return node

      const childNodesIndex = new Map<PathKey, Node>()

      for (const child of node.childNodes)
        if (child[$$key])
          childNodesIndex.set(child[$$key], child)

      let currentNode: Node | null = node.firstChild

      for (const key of patch.keys) {
        const childNode = childNodesIndex.get(key)
        childNodesIndex.delete(key)

        // Child node for `key` does not exist so we couldn’t reorder child
        // elements.
        if (!childNode)
          throw new Error(`Failed to reorder children at '${pathString}'`)

        if (currentNode !== childNode) {
          node.removeChild(childNode)
          node.insertBefore(childNode, currentNode)
        }

        currentNode = currentNode ? currentNode.nextSibling : null
      }
      return node
    }
    default:
      throw new Error(`Patch of type '${(patch as Patch).type}' is not allowed.`)
  }
}
