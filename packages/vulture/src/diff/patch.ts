import { JSXNode } from '../jsx'
import { Path, PathKey } from './path'

/**
 * A union type which contains every possible patch to a node tree.
 *
 * A list of patches must always be executed in order.
 *
 * Note how there is no patch for a JSX node’s element name. This is because if
 * an element name is changed we expect a different behavior from the element.
 * Therefore a `NodeReplacePatch` will be fired.
 *
 * Also note that *every* `Patch` has a constant string `type` property and a
 * `Path` type `path` property. This is by design and it allows renderers to at
 * least make some assumptions about the general patch type. Having `path` be
 * on every patch also allows renderers to validate for all patches at once
 * that the node at that path exists.
 */
export type Patch =
    NodeReplacePatch
  | AttributeSetPatch
  | AttributeRemovePatch
  | ChildrenAddPatch
  | ChildrenRemovePatch
  | ChildrenOrderPatch

/**
 * Replaces a node in-place wherever it is. This is the most simple and basic
 * patch of all. This is the only patch which can be applied to *all* nodes.
 * All the other patches only apply to JSX elements.
 *
 * Theoretically every diff could just return a single `NodeReplacePatch` at
 * the root like so:
 *
 * ```js
 * {
 *   type: 'NODE_REPLACE',
 *   path: [],
 *   node: nextNode,
 * }
 * ```
 *
 * …and get the same tree from the renderer. The reason why we don’t just use
 * a node replace is because that operation isn’t very fast. In addition we
 * lose all of our event handlers that we’ve attached to the DOM. This is
 * undesireable.
 *
 * Because this is perhaps the slowest patch it is used only when we can’t
 * guarantee a more specific patch will be sufficient.
 *
 * However, sometimes it can still be useful to just straight up replace a
 * node. For instance, this patch may be fired to replace one primitive value
 * with another, or to replace an element of one name with another.
 */
export type NodeReplacePatch = {
  type: NODE_REPLACE,
  path: Path,
  node: JSXNode,
}

/**
 * Sets a single attribute on an element. May be used to add or replace an
 * attribute depending on if the attribute is already there or not.
 *
 * For some vulture internal attributes, this patch will not be called.
 *
 * This cannot remove attributes, however. That is what the
 * `AttributeRemovePatch` is for. Setting an attribute to null will instead
 * keep around an attribute with a null value.
 */
export type AttributeSetPatch = {
  type: ATTRIBUTE_SET,
  path: Path,
  name: string,
  value: any,
}

/**
 * Completely removes an attribute from an element. This patch will not just
 * set an attribute to null or undefined, but rather completely blow an
 * attribute away.
 */
export type AttributeRemovePatch = {
  type: ATTRIBUTE_REMOVE,
  path: Path,
  name: string,
}

/**
 * Adds a child with a new key to an element. The added child’s path will be
 * `[...path, key]`. The reason they are seperate is it can be useful for
 * renderers to get the path to the parent seperate from the new child’s path.
 *
 * Note how this patch does not specify the order in which a child should be
 * added. The order of all child node’s is specified in a single patch all at
 * once. It is recommended that renderers instead of instantly adding children
 * directly to the bottom of a list of children, instead the renderer buffer
 * the new children and them order them when a `ChildrenOrderPatch` is
 * evaluated.
 *
 * Also note how there is only a `ChildrenAddPatch` and a `ChildrenRemovePatch`
 * but no children replace patch. This is because to replace a node you should
 * be using `NodeReplacePatch` or another more specific patch.
 */
export type ChildrenAddPatch = {
  type: CHILDREN_ADD,
  path: Path,
  key: PathKey,
  node: JSXNode,
}

/**
 * Removes a child node from an element completely. Bye-bye!
 */
export type ChildrenRemovePatch = {
  type: CHILDREN_REMOVE,
  path: Path,
  key: PathKey,
}

/**
 * Specifies the order of an element’s children. This patch should generally be
 * placed after any `ChildrenAddPatch`s for any given element.
 *
 * When this patch is executed it is also assumed that a node exists for all of
 * the `keys` and no more node’s exist outside of that list. If this assumption
 * turns out to be false, bad things may happen. Therefore it’s important to
 * always execute the appropriate `ChildrenAddPatch`s and
 * `ChildrenRemovePatch`s first.
 */
export type ChildrenOrderPatch = {
  type: CHILDREN_ORDER,
  path: Path,
  keys: PathKey[],
}

// Define constants for every patch’s `type` property. In order to do this we
// also will need to define a type as well as a constant string.
//
// Using constants for types has a couple of advantages.
//
// 1. We can name our constants whatever we want. If we wanted to someday
//    prefix our constants with say `@vulture/*`, that would be a possibility.
// 2. Constant variable names will be mangled in minification, but strings are
//    not mangled. So by defining constants we save bytes.
export type NODE_REPLACE = 'NODE_REPLACE'
export const NODE_REPLACE: NODE_REPLACE = 'NODE_REPLACE'
export type ATTRIBUTE_SET = 'ATTRIBUTE_SET'
export const ATTRIBUTE_SET: ATTRIBUTE_SET = 'ATTRIBUTE_SET'
export type ATTRIBUTE_REMOVE = 'ATTRIBUTE_REMOVE'
export const ATTRIBUTE_REMOVE: ATTRIBUTE_REMOVE = 'ATTRIBUTE_REMOVE'
export type CHILDREN_ADD = 'CHILDREN_ADD'
export const CHILDREN_ADD: CHILDREN_ADD = 'CHILDREN_ADD'
export type CHILDREN_REMOVE = 'CHILDREN_REMOVE'
export const CHILDREN_REMOVE: CHILDREN_REMOVE = 'CHILDREN_REMOVE'
export type CHILDREN_ORDER = 'CHILDREN_ORDER'
export const CHILDREN_ORDER: CHILDREN_ORDER = 'CHILDREN_ORDER'
