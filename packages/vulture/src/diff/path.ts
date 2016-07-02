import { JSXNode, JSXElement, isJSXElement } from '../jsx'

/**
 * A path used to identify any JSX node across JSX trees and rendered trees.
 * It’s comprised of a list of strings which represent nesting. For example,
 * the element named “D” would have a path that looks like
 * `["0", "hello", "1"]`:
 *
 * ```jsx
 * <A>
 *   <B key="hello">
 *     <C/>
 *     <D/>
 *   </B>
 * </A>
 * ```
 *
 * Numbers are used for `PathKey`s unless a `key` attribute is defined.
 * Renderers do not need to know the implementation details of `Path`. All they
 * need to do is use `Path` as just a cache key.
 */
export type Path = PathKey[]

/**
 * A single segment in the `Path` array.
 */
export type PathKey = string

/**
 * Gets the key for a given JSX node. The key will be the node’s key if it is
 * an element, otherwise it will be the position of the node as defined by
 * `position`.
 */
// TODO: Should this use the full children array? Then we may be able to use
// `elementName` or other hueristics as a key.
export function getPathKey (node: JSXNode, i: number): PathKey {
  if (isJSXElement(node) && node.attributes)
    return String(node.attributes['id'] || node.attributes['key'] || i)
  else
    return String(i)
}
