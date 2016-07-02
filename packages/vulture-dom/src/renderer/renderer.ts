import {
  JSXNode,
  JSXPrimitive,
  JSXElement,
  isJSXElement,
  primitiveToString,
  Path,
  getPathKey,
} from 'vulture'

import { $$key } from './path'
import { setAttribute } from './attributes'

export function renderNode (jsxNode: JSXNode): Node {
  if (isJSXElement(jsxNode)) return renderElement(jsxNode)
  else return renderPrimitive(jsxNode)
}

function renderPrimitive (jsxPrimitive: JSXPrimitive): Text {
  return document.createTextNode(primitiveToString(jsxPrimitive))
}

function renderElement ({ elementName, attributes = {}, children = [] }: JSXElement): Element {
  const element = document.createElement(elementName)

  for (const name in attributes)
    if (attributes.hasOwnProperty(name))
      setAttribute(element, name, attributes[name])

  children.forEach((jsxChild, i) => {
    const child = renderNode(jsxChild)
    child[$$key] = getPathKey(jsxChild, i)
    element.appendChild(child)
  })

  return element
}
