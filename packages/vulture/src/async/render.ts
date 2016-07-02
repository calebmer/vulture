import { JSXNode } from '../jsx'
import { Renderer, ReducerRenderer } from '../renderer'
import { JSXAsync, JSXElementAsync } from './jsx'
import { flattenAsyncJSX } from './sync'
import { diffAsync } from './diff'

export function createRender <N>(renderer: Renderer<N>) {
  return function render (jsx: JSXAsync) {
    const jsxs = flattenAsyncJSX(jsx)
    return new Observable<N>(observer => (
      jsxs.subscribe(
        node => observer.next(renderer.renderNode(node)),
        error => observer.error(error),
        () => observer.complete()
      )
    ))
  }
}
