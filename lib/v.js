import isFunction from 'lodash/lang/isFunction'
import isArray from 'lodash/lang/isArray'
import isPlainObject from 'lodash/lang/isPlainObject'
import startsWith from 'lodash/string/startsWith'
import mapKeys from 'lodash/object/mapKeys'
import mapValues from 'lodash/object/mapValues'
import compose from 'lodash/function/compose'
import h from 'virtual-dom/h'
import EventHook from './EventHook'

const transformVDOMProperties = compose(addEventHooks, fixAliases)

/**
 * Vulture hyperscript implementation for use with JSX. It accepts children as
 * a rest parameter or as an array.
 *
 * If the `tagName` is a function, than we execute the function with
 * `properties` and `children` as parameters.
 *
 * @param {string|function} The tag of the element.
 * @param {object} Properties for the element.
 * @param {Array} The element's children.
 * @return {VNode} The created element.
 */

export default function v(tagName, ...children) {
  let properties = {}

  if (isPlainObject(children[0])) {
    properties = children.shift()
  }

  if (children.length === 1 && isArray(children[0])) {
    children = children[0]
  }

  if (isFunction(tagName)) {
    return tagName(properties, children)
  }

  return h(tagName, transformVDOMProperties(properties), children)
}

/**
 * Replaces all on* strings with event hooks of the same name. For example
 * `onClick` will turn into a `click` event hook.
 *
 * @private
 * @see v
 * @param {object} The original properties object.
 * @param {object} The hooked properties object.
 */

function addEventHooks(properties) {
  return mapValues(properties, (value, key) => {
    if (startsWith(key, 'on')) {
      const event = key.substring(2).toLowerCase()
      return new EventHook(event, value)
    }
    return value
  })
}

/**
 * There are some property aliases for common properties we would like to
 * support.
 *
 * @private
 * @see v
 * @param {object} The original properties object.
 * @param {object} The aliased property object.
 */

function fixAliases(properties) {
  const propertyAliases = {
    'accept-charset': 'acceptCharset',
    'class': 'className',
    'for': 'htmlFor',
    'http-equiv': 'httpEquiv'
  }

  return mapKeys(properties, (value, key) => propertyAliases[key] || key)
}
