import { JSXPrimitive, ElementName, Attributes } from '../jsx'

/**
 * The exciting part about this asynchronous variant of Vulture’s JSX is it
 * allows us to embed `Promise`s and `Observable`s *directly* into our JSX.
 * Behind the scenes, Vulture converts everything into an `Observable` which
 * lets Vulture support any spec-defined format that can be simply enoughed
 * turned into an `Observable` (the Vulture transformation process is a little
 * more complex than `Observable.from`).
 *
 * Although in the type system we only list `Promise` and `Observable`, we
 * actually support any thenable or object with a `Symbol.observable`.
 */
export type JSXAsync =
    JSXNodeAsync
  | Promise<JSXNodeAsync>
  | Observable<JSXNodeAsync>

/**
 * The only reason we have `JSXNodeAsync` is so that we have a type for
 * `JSXElementAsync`.
 */
export type JSXNodeAsync = JSXPrimitive | JSXElementAsync

/**
 * The only difference between `JSXElementAsync` and `JSXElement` is the
 * children. Asynchronous JSX elements need to allow asynchronous children, so
 * `Promise` or `Observable` `JSXNode`s are allowed.
 */
export interface JSXElementAsync {
  elementName: ElementName
  attributes?: Attributes
  children?: ChildrenAsync
}

/**
 * Exact same as the synchronous version, except for it’s an array of
 * `JSXAsync` which allows `Promise`s and `Observable`s.
 */
export type ChildrenAsync = JSXAsync[]
