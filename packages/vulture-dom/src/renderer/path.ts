import { Path } from 'vulture'

export const $$key = Symbol('vulture-dom/jsxKey')

export function lookupPath (initialNode: Node, path: Path): Node | null {
  return path.reduce<Node | null>((node, key) => {
    if (!node) {
      return null
    }
    else {
      for (let i = 0; i < node.childNodes.length; i++) {
        const childNode = node.childNodes[i]
        if (childNode[$$key] === key)
          return childNode
      }
      return null
    }
  }, initialNode)
}
