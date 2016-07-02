import { JSXNode, JSXElement } from '../jsx'
import { Path, Patch, diff } from '../diff'
import { JSXAsync, JSXElementAsync } from './jsx'
import { flattenAsyncJSX } from './sync'

/**
 * Diffs an asynchronous JSX node with itself overtime. Because asynchronous
 * JSX nodes are internally converted into `Observable`s it is possible that
 * the node will update itself over time. Therefore we need to diff these
 * versions to incrementally update our render tree.
 */
export function diffAsync (jsx: JSXAsync, initialJSX: JSXNode = null, path: Path = []) {
  const jsxs = flattenAsyncJSX(jsx)

  return new Observable<Patch[]>(observer => {
    let lastJSX: JSXNode = initialJSX

    return jsxs.subscribe(
      nextJSX => {
        observer.next(diff(lastJSX, nextJSX, path))
        lastJSX = nextJSX
      },
      error => observer.error(error),
      () => observer.complete()
    )
  })
}
