import { JSXNode, ElementName, Attributes, Children } from '../jsx'

/**
 * Any object which has the ability to render a `JSXNode` into any other node
 * format. Some common renderers include a renderer for `JSXNode`s to
 * `string`s, or `JSXNode`s to HTML DOM `Node`s.
 *
 * This simple interface is the base for higher level interfaces. For instance,
 * a re-render on every update is possible, but it won’t be performant. To get
 * a renderer which *reduces* (applies patches from diffed JSX) instead of
 * re-renders look at `ReducerRenderer`.
 *
 * Also note that a `Renderer` takes the synchronous `JSXNode`. This is because
 * Vulture abstracts away asynchrity from the renderer author. Whoever is
 * writing the renderer must only write preferably pure functions which perform
 * appropriate transformations to the synchronous JSX. This is because it is
 * much easier to design a performant synchronous API than an asynchronous one.
 *
 * With this abstracted async approach, Vulture is also able to give the user
 * control over scheduling. Using a `setImmediate` or `requestAnimationFrame`
 * when available.
 */
export interface Renderer<Node> {
  renderNode (jsxNode: JSXNode): Node
}
