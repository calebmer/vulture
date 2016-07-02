import { Patch } from '../diff'
import { Renderer } from './renderer'

/**
 * Any renderer which can take a node and a patch and incremently upgrade the
 * node. Renderers that implement this interface are looking for performance
 * improvements in rendering. For many rendering libraries it makes more sense
 * to make small incremental updates to the render tree instead of creating a
 * new render tree on every change. See `vulture/src/diff` for more
 * documentation on available patches and diffing.
 *
 * This operation can be mutative. In other words the following can be true yet
 * updates can still happen:
 *
 * ```js
 * assert(reduceNode(node1, patch) === node1)
 * ```
 *
 * This is opposed to many reduction models that encourage immutability, in
 * this case immutability while cute can often negatively impact performance.
 * If certain renderers choose to do immutable reductions, that is there
 * choice, but this interface *does not* assume immutability. However, this
 * interface does also accept that the last node and the next node may not
 * always be equal. This could be the case if a `NodeReplacePatch` were to
 * replace the root node.
 *
 * The reducer interface was inspired by Redux, the major difference between
 * this interface and Redux is that nodes are not immutable.
 */
export interface ReducerRenderer<Node> extends Renderer<Node> {
  reduceNode (node: Node, patch: Patch): Node
}

/**
 * When `ReducerRenderer` isn’t enough for performance, a renderer may
 * implement `BatchReducerRenderer`. This allows the renderer to implement a
 * custom batching strategy. Note that a batch reduce may also return a promise
 * allowing the batch operation to be asynchronous.
 *
 * The default `batchReduceNode` implementation is:
 *
 * ```js
 * function batchReduceNode (initialNode, patches) {
 *   return Promise.resolve(patches.reduce((node, patch) => reduceNode(node, patch), initialNode))
 * }
 * ```
 */
export interface BatchReducerRenderer<Node> extends ReducerRenderer<Node> {
  batchReduceNode (node: Node, patches: Patch[]): Promise<Node>
}
