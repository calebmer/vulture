var isFunction = require('lodash/lang/isFunction')
var isArray = require('lodash/lang/isArray')
var isPlainObject = require('lodash/lang/isPlainObject')
var startsWith = require('lodash/string/startsWith')
var mapKeys = require('lodash/object/mapKeys')
var mapValues = require('lodash/object/mapValues')
var compose = require('lodash/function/compose')
var restParam = require('lodash/function/restParam')
var h = require('virtual-dom/h')
var EventHook = require('./EventHook')

var transformVDOMProperties = compose(addEventHooks, fixAliases)

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

var v = restParam(function v(tagName, children) {
  var properties = {}

  // FIXME: `babel-plugin-transform-jsx` uses plain objects!
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
})

module.exports = v

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
      var event = key.substring(2).toLowerCase()
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

var propertyAliases = {
  'accept-charset': 'acceptCharset',
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

function fixAliases(properties) {
  return mapKeys(properties, (value, key) => propertyAliases[key] || key)
}
