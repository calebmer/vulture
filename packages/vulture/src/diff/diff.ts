import { JSXNode, JSXElement, Attributes, Children, isJSXElement } from '../jsx'
import { Path, PathKey, getPathKey } from './path'

import {
  Patch,
  NODE_REPLACE,
  ATTRIBUTE_SET,
  ATTRIBUTE_REMOVE,
  CHILDREN_ADD,
  CHILDREN_REMOVE,
  CHILDREN_ORDER,
} from './patch'

/**
 * Diffs two JSX nodes returning a list of patches to be applied by the
 * renderer to the tree trying to mirror our JSX nodes.
 *
 * The list of patches is to be executed in definition order, starting at
 * index 0, all the way down to the final index.
 *
 * To learn more about the different patches that might be returned, see the
 * `Patch` union type.
 */
export function diff (a: JSXNode, b: JSXNode, path: Path = []): Patch[] {
  return diffNode(a, b, path)
}

/**
 * Diffs two JSX nodes. If they are both JSX elements, more complex diffing
 * will be done. Otherwise there is just a raw `NodeReplacePatch` performed.
 */
export function diffNode (a: JSXNode, b: JSXNode, path: Path): Patch[] {
  if (a === b) return []
  if (isJSXElement(a) && isJSXElement(b)) return diffElement(a, b, path)
  return [{ type: NODE_REPLACE, path, node: b }]
}

/**
 * Diffs two JSX elements. If the element names are different, a
 * `NodeReplacePatch` is scheduled to be executed. This is because we expect
 * elements of different names to have different behaviors. Therefore we can’t
 * simply swap out the element name, instead we have to replace the full
 * element.
 */
export function diffElement (a: JSXElement, b: JSXElement, path: Path): Patch[] {
  if (a === b)
    return []

  if (a.elementName !== b.elementName)
    return [{ type: NODE_REPLACE, path, node: b }]

  return [
    ...diffAttributes(a.attributes || {}, b.attributes || {}, path),
    ...diffChildren(a.children || [], b.children || [], path),
  ]
}

/**
 * Diffs two sets of attributes. This function consists of a fairly simple
 * object comparison algorithm.
 *
 * A few internal attributes (such as `key`) will be ignored.
 */
export function diffAttributes (a: Attributes, b: Attributes, path: Path): Patch[] {
  if (a === b)
    return []

  const patches: Patch[] = []

  for (const name in b)
    if (b[name] !== a[name] && name !== 'key')
      patches.push({ type: ATTRIBUTE_SET, path, name, value: b[name] })

  for (const name in a)
    if (!b.hasOwnProperty(name))
      patches.push({ type: ATTRIBUTE_REMOVE, path, name })

  return patches
}

/**
 * Diffs two lists of JSX nodes which are the children of another JSX node. The
 * algorithm executes the following steps. Relevant patch types are added for
 * reference sake:
 *
 * 1. Construct an index from the old node list where the node’s key is
 *    mapped to the the key’s node.
 * 2. Loop through all of the new nodes and do the following:
 *    1. Get the last node for the same key of this new node.
 *    2. If a last node does not exist add the new node (`ChildrenAddPatch`).
 *    3. If a last node does exist, diff it with the new node.
 * 3. Remove old nodes whose keys do not appear with the new nodes
 *    (`ChildrenRemovePatch`).
 * 4. Order the nodes using the ordered keys from the new nodes
 *    (`ChildrenOrderPatch`).
 */
// TODO: Performance test this function. There are a lot of iterations we could
// make that do the same thing. We need to find out which iteration is the most
// performant.
export function diffChildren (a: Children, b: Children, path: Path): Patch[] {
  if (a === b)
    return []

  let patches: Patch[] = []
  const aKeys: PathKey[] = []
  const bKeys: PathKey[] = []

  const aIndex = new Map<PathKey, JSXNode>(a.map((node, i) => {
    const key = getPathKey(node, i)
    aKeys.push(key)
    return [key, node] as [PathKey, JSXNode]
  }))

  b.forEach((bNode, i) => {
    const key = getPathKey(bNode, i)
    bKeys.push(key)

    if (aIndex.has(key)) {
      const aNode = aIndex.get(key)
      aIndex.delete(key)
      patches = [...patches, ...diffNode(aNode, bNode, [...path, key])]
    }
    else {
      patches.push({ type: CHILDREN_ADD, path, key, node: bNode })
    }
  })

  for (const [key, aNode] of aIndex)
    patches.push({ type: CHILDREN_REMOVE, path, key })

  let reorder = false

  if (aKeys.length !== bKeys.length) {
    reorder = true
  }
  else {
    for (const i in aKeys) {
      if (aKeys[i] !== bKeys[i]) {
        reorder = true
        break
      }
    }
  }

  if (reorder)
    patches.push({ type: CHILDREN_ORDER, path, keys: bKeys })

  return patches
}
