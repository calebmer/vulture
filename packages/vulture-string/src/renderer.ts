import {
  JSXNode,
  JSXElement,
  ElementName,
  Attributes,
  isJSXElement,
  primitiveToString,
  Renderer,
  PartialRenderer,
} from 'vulture'

export function renderNode (jsxNode: JSXNode): string {
  if (isJSXElement(jsxNode)) return renderElement(jsxNode)
  else return primitiveToString(jsxNode)
}

function renderElement ({ elementName, attributes, children }: JSXElement): string {
  if (!children) {
    return `<${elementName}${renderAttributes(attributes || {})}/>`
  }
  else {
    return (
      renderOpeningTag(elementName, attributes || {}) +
      children.map(child => renderNode(child)).join('') +
      renderClosingTag(elementName)
    )
  }
}

export function renderOpeningTag (elementName: ElementName, attributes: Attributes): string {
  return `<${elementName}${renderAttributes(attributes)}>`
}

export function renderClosingTag (elementName: ElementName): string {
  return `</${elementName}>`
}

function renderAttributes (attributes: Attributes): string {
  let attributesString = ''

  for (let key in attributes) {
    const value = attributes[key]

    if (value === undefined || value === null || value === false || typeof value === 'function') {}
      // Noop…
    else if (value === true)
      attributesString += ` ${key}`
    else
      attributesString += ` ${key}="${value}"`
  }

  return attributesString
}
