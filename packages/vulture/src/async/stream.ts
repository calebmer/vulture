import { JSXElement, isJSXPrimitive } from '../jsx'
import { PartialRenderer } from '../renderer'
import { JSXAsync, JSXNodeAsync, JSXElementAsync } from './jsx'
import { intoObservable } from './observable'

/**
 * The `PartialRenderer` interface gives us the power to *stream* our
 * asynchronous JSX. Some of our asynchronous JSX nodes will complete earlier
 * than others allowing us to immeadiately send them down while still waiting
 * for the rest. We can do this because `PartialRenderer` allows us to render
 * an element’s opening and closing tags *seperate* from the element’s
 * children.
 *
 * So for example, say we have three promise child nodes that resolve after one
 * second, two seconds, and three seconds respectively. This function creates a
 * function that creates an observable that will emit the opening tag for the
 * root element, then render each child in one second increments, then finally
 * emits the parent element’s closing tag.
 *
 * If the renderer can emit partial values, and a consumer can take and
 * construct them—this function provides exciting performance possibilities.
 * This is one of Vulture’s unique advantages.
 */
export function createRenderStream <A, B, C>(renderer: PartialRenderer<A, B, C>) {
  // We call this function recursively, so we need to give it a name before it
  // gets returned.
  return function renderStream (jsx: JSXAsync): Observable<A | B | C> {
    const jsxs = intoObservable(jsx)

    return new Observable<A | B | C>(observer => {
      const subscriptions: Subscription[] = []
      let node: JSXNodeAsync = null

      subscriptions.push(jsxs.subscribe(
        // Keep track of the last node “next”ed.
        nextNode => (node = nextNode),
        error => observer.error(error),
        // Wait for our JSX node to complete before streaming anything.
        () => {
          if (isJSXPrimitive(node)) {
            observer.next(renderer.renderNode(node))
            observer.complete()
          }
          else if (!node.children || node.children.length === 0) {
            observer.next(renderer.renderNode(node as JSXElement))
            observer.complete()
          }
          else {
            const parentElement: JSXElementAsync = node
            const children: JSXAsync[] = node.children
            let streamingChild = 0

            // Open the parent element tag and start streaming its contents!
            observer.next(renderer.renderOpeningTag(
              parentElement.elementName,
              parentElement.attributes || {}
            ))

            type ChildState = {
              node: JSXAsync,
              queuedValues: (A | B | C)[],
              complete: boolean,
            }

            const childrenState: ChildState[] = children.map(child => ({
              node: child,
              queuedValues: [],
              complete: false,
            }))

            childrenState.forEach((childState, thisChild) => {
              // Side effects! We watch the child’s stream and update its state
              // accordingly.
              subscriptions.push(renderStream(childState.node).subscribe(
                value => {
                  // Send the data to the observer if this child is live,
                  // otherwise add it to the child’s queue.
                  if (streamingChild === thisChild) observer.next(value)
                  else childState.queuedValues.push(value)
                },
                error => observer.error(error),
                () => {
                  // This child has completed, so set its completed value to
                  // `true`.
                  childState.complete = true

                  // If this was the currently streaming child it has a
                  // responsibility to set the next streaming child and stream
                  // everything that’s waiting in the queue.
                  if (streamingChild === thisChild) {
                    while (true) {
                      // Increment the streaming child.
                      streamingChild++

                      // If streaming child is greater than the last child
                      // index, we’ve reached the end. Complete the observable
                      // and break out of the loop.
                      if (streamingChild > children.length - 1) {
                        observer.next(renderer.renderClosingTag(parentElement.elementName))
                        observer.complete()
                        break
                      }

                      // Stream the queued values from the streaming child.
                      const childState = childrenState[streamingChild]
                      childState.queuedValues.forEach(value => observer.next(value))

                      // If the child has not yet completed, it is truly the
                      // new streaming child and we should break out of this
                      // while loop. Otherwise, the next child might be the
                      // next streaming child.
                      if (!childState.complete) break
                    }
                  }
                }
              ))
            })
          }
        }
      ))

      // Unsubscribe from all the things!
      return () => subscriptions.forEach(subscription => subscription.unsubscribe())
    })
  }
}
