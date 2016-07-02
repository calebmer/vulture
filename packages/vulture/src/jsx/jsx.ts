/**
 * Anything that can be a JSX node in a JSX tree. All primitive types in
 * JavaScript can be considered a JSX Node, and JSX Elements may also be
 * considered a node.
 */
export type JSXNode = JSXPrimitive | JSXElement

/**
 * A primitive JSX node. Basically any JSX node that is not an element. Valid
 * node primitive values include `null`, `true`, `42`, and `'hello, world'`.
 */
export type JSXPrimitive = undefined | null | boolean | number | string

/**
 * A JSX Element is an XML-like element. It contains an element name, an
 * attributes map, and some children nodes. So for example, the following JSX:
 *
 * ```jsx
 * <a href="https://example.org">Hello, world!</a>
 * ```
 *
 * Would become the following JSX object:
 *
 * ```js
 * {
 *   elementName: 'a',
 *   attributes: { href: 'https://example.org' },
 *   children: ['Hello, world!'],
 * }
 * ```
 *
 * This is a digestible, consice format for JSX consumption by vulture.
 *
 * The property names for this JSX object were taken directly from the
 * [JSX specication][1] for maximum interoperability with other libraries using
 * JSX.
 *
 * If `chilren` is not included in the JSX Element, then the element is a self
 * closing element. Similar to `img` tags in HTML that don’t have any children:
 *
 * ```html
 * <img alt="A cat" src="cat.jpg"/>
 * ```
 *
 * [1]: http://facebook.github.io/jsx/
 */
export interface JSXElement {
  elementName: ElementName
  attributes?: Attributes
  children?: Children
}

// Just a string, pretty boring.
export type ElementName = string

/**
 * The Attributes of a JSX Element is a map of key/value pairs that are the
 * same as an XML element’s attributes.
 */
export type Attributes = {
  [name: string]: any,
}

/**
 * The children of a JSX element is an array of JSX nodes. Pretty simple, very
 * similar to how XML works.
 */
export type Children = JSXNode[]
