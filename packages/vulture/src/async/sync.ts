import { JSXNode, JSXElement, isJSXPrimitive } from '../jsx'
import { intoObservable } from './observable'
import { JSXAsync } from './jsx'

/**
 * Takes an asynchronous JSX element and flattens it into an observable of
 * synchronous JSX nodes. Great and easy function for making most synchronous
 * interfaces asynchronous.
 *
 * Also note that many elements will be strictly equal across many observable
 * emissions, so it’s fairly easy to reduce computations using the synchronous
 * observable using strict equality checks (`===`).
 */
export function flattenAsyncJSX (jsx: JSXAsync): Observable<JSXNode> {
  const jsxs = intoObservable(jsx)

  return new Observable<JSXNode>(observer => {
    let childSubscriptions: Subscription[] = []

    const unsubscribeChildren = () => {
      childSubscriptions.forEach(subscription => subscription.unsubscribe())
      childSubscriptions = []
    }

    let completeCount = 1

    const complete = () => {
      completeCount -= 1
      if (completeCount === 0) {
        unsubscribeChildren()
        observer.complete()
      }
    }

    const subscription = jsxs.subscribe(
      node => {
        // Reset complete count to one and unsubscribe all of our children.
        unsubscribeChildren()
        completeCount = 1

        if (isJSXPrimitive(node)) {
          observer.next(node)
        }
        else if (!node.children || node.children.length === 0) {
          observer.next(node as JSXElement)
        }
        else {
          const { elementName, attributes = {} } = node

          // We don’t want to emit any values while we are still `map`ing over
          // the array.
          let ready = false

          // Map all of the children to null. `childrenSync` is not
          // immutable. Therefore whenever we call `observer.next` we need to
          // make a shallow copy.
          const childrenSync: JSXNode[] = node.children.map(() => null)

          node.children.forEach((childAsync, i) => {
            completeCount += 1
            childSubscriptions.push(flattenAsyncJSX(childAsync).subscribe(
              childSync => {
                // Update our child for the `i` position.
                childrenSync[i] = childSync
                // If we are not yet ready, return so we don’t send an
                // intermediate value to our observer.
                if (!ready) return
                observer.next({
                  elementName,
                  attributes,
                  children: arrayShallowCopy(childrenSync),
                })
              },
              // Propagate the error.
              error => observer.error(error),
              complete
            ))
          })

          // Send an initial version.
          observer.next({
            elementName,
            attributes,
            children: arrayShallowCopy(childrenSync),
          })

          // Ok, we can send values now.
          ready = true
        }
      },
      error => observer.error(error),
      complete
    )

    return () => {
      subscription.unsubscribe()
      unsubscribeChildren()
    }
  })
}

function arrayShallowCopy <T>(array: T[]): T[] {
  return array.map(item => item)
}
