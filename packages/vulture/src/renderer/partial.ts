import { JSXElement, ElementName, Attributes } from '../jsx'
import { Renderer } from './renderer'

/**
 * Because Vulture abstracts away asynchronous operations, Vulture can also
 * easily allow nodes to be streamed. The `PartialRenderer` interface should be
 * implemented in order for streaming to be implemented.
 *
 * Vulture will only stream elements, as its children may finish before the
 * element itself. Therefore the partial renderer must be able to render an
 * element’s opening tag and closing tag seperately.
 *
 * The node, opening tag, and closing tag types will each be emitted in the
 * observable seperately. It is up to the observable consumer to provide a
 * concatenation strategy. The most common `PartialRenderer` is the string
 * renderer in which the opening tag and the closing tag types are the same as
 * the node’s type, string.
 */
export interface PartialRenderer<Node, OpeningTag, ClosingTag> extends Renderer<Node> {
  renderOpeningTag (elementName: ElementName, attributes: Attributes): OpeningTag
  renderClosingTag (elementName: ElementName): ClosingTag
}
