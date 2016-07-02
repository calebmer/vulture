export function setAttribute (element: Element, name: string, value: any) {
  // If the name starts with 'on', it’s an event handler. Attach the event
  // handler to the element.
  if (name.startsWith('on'))
    element[name.toLowerCase()] = value
  // If the value is undefined, null, or false we want no attributes at all. An
  // empty string is equivalent to `true` in some cases.
  else if (value === undefined || value === null || value === false)
    element.removeAttribute(name)
  // Otherwise, set the attribute.
  else
    // If the value is true, we just want an empty string. An empty string is
    // enough to represent true for many attributes like `autofocus`.
    element.setAttribute(name, value === true ? '' : String(value))
}

export function removeAttribute (element: Element, name: string) {
  // If the name starts with 'on', it’s an event handler. Remove the event
  // handler from the element.
  if (name.startsWith('on'))
    element[name.toLowerCase()] = null
  // Otherwise, remove the attribute
  else
    element.removeAttribute(name)
}
