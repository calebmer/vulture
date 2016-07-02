const ELEMENT_NODE = 1

export function isElement (node: Node): node is Element {
  return node.nodeType === ELEMENT_NODE
}
