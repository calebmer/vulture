import { JSXAsync, diffAsync } from 'vulture'
import * as renderer from './renderer'

export function render (jsx: JSXAsync, container: Node) {
  if (container.childNodes.length !== 0)
    throw new Error('Container is not empty.')

  const initialJSX = null

  const nodes = new Observable<Node>(observer => {
    let lastNode: Node = renderer.renderNode(initialJSX)
    container.appendChild(lastNode)
    return diffAsync(jsx, initialJSX).subscribe(
      patches => {
        let nextNode = patches.reduce((node, patch) => renderer.reduceNode(node, patch), lastNode)
        lastNode = nextNode
      },
      error => observer.error(error),
      () => observer.complete()
    )
  })

  return nodes.subscribe(
    node => {
      if (container.firstChild !== node)
        container.replaceChild(node, container.firstChild)
    },
    error => { throw error }
  )
}
