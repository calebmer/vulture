import { JSXPrimitive, JSXElement, Attributes, Children } from './jsx'

/**
 * A shortcut function for creating JSX elements for those who may not want to
 * use a JSX transpiler. This function is similar to hyperscript formats,
 * except *much* less complex.
 */
export function jsx(elementName: string): JSXElement
export function jsx(elementName: string, attributes: Attributes): JSXElement
export function jsx(elementName: string, children: Children): JSXElement
export function jsx(elementName: string, attributes: Attributes, children: Children): JSXElement
export function jsx(
  elementName: string,
  attributesOrChildren?: Attributes | Children,
  children?: Children
): JSXElement {
  const jsxElement: JSXElement = { elementName }

  if (!attributesOrChildren) {
    // noop…
  }
  else if (Array.isArray(attributesOrChildren)) {
    jsxElement.children = attributesOrChildren
  }
  else {
    jsxElement.attributes = attributesOrChildren
    if (children) jsxElement.children = children
  }

  return jsxElement
}

/**
 * A fast duck-type to check whether any value is a JSX Element. A JSX Element
 * must always be an object with *at least* a string `elementName`, so that’s
 * all we check for.
 */
export function isJSXElement (value: any): value is JSXElement {
  return (
    value != null &&
    typeof value === 'object' &&
    typeof value.elementName === 'string'
  )
}

/**
 * Gets whether a value is a `JSXPrimitive`
 */
export function isJSXPrimitive (value: any): value is JSXPrimitive {
  return (
    value == null ||
    typeof value === 'boolean' ||
    typeof value === 'number' ||
    typeof value === 'string'
  )
}

/**
 * Transforms a JSX primitive node to a string.
 *
 * If the node is null or undefined, an empty string is returned. If the node
 * is a boolean an empty string is returned (even for `true`!). If the node is
 * a number the node gets cast into a string. If the node is a string, nothing
 * happens.
 *
 * These are fairly intuitive rules, all except for `true` returning an empty
 * string.
 */
export function primitiveToString (node: JSXPrimitive): string {
  if (node == null) return ''
  if (typeof node === 'boolean') return ''
  return String(node)
}
